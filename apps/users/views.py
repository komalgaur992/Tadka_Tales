from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.utils import timezone
from django.db import transaction
from .models import User, OTPVerification, UserProfile
from .serializers import (
    UserRegistrationSerializer, PhoneRegistrationSerializer, OTPSendSerializer,
    OTPVerifySerializer, LoginSerializer, UserProfileSerializer,
    UserProfileUpdateSerializer, ExtendedUserProfileSerializer,
    PasswordChangeSerializer, PasswordResetSerializer
)
from .utils import send_otp_sms
import logging

logger = logging.getLogger(__name__)


class UserRegistrationView(APIView):
    """User registration with email and password."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'User registered successfully',
                'user': UserProfileSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PhoneRegistrationView(APIView):
    """User registration with phone number (requires OTP verification)."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PhoneRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']
            
            # Check if user already exists
            if User.objects.filter(phone_number=phone_number).exists():
                return Response({
                    'error': 'User with this phone number already exists'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create or get OTP verification
            otp_verification, created = OTPVerification.objects.get_or_create(
                phone_number=phone_number,
                defaults={'expires_at': timezone.now() + timezone.timedelta(minutes=5)}
            )
            
            if not created and not otp_verification.is_expired():
                return Response({
                    'error': 'OTP already sent. Please wait before requesting a new one.'
                }, status=status.HTTP_429_TOO_MANY_REQUESTS)
            
            # Generate and send OTP
            otp_code = otp_verification.generate_otp()
            
            if send_otp_sms(phone_number, otp_code):
                return Response({
                    'message': 'OTP sent successfully',
                    'phone_number': phone_number
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Failed to send OTP'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SendOTPView(APIView):
    """Send OTP to phone number."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = OTPSendSerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']
            
            # Create or update OTP verification
            otp_verification, created = OTPVerification.objects.get_or_create(
                phone_number=phone_number,
                defaults={'expires_at': timezone.now() + timezone.timedelta(minutes=5)}
            )
            
            if not created:
                # Update expiry time
                otp_verification.expires_at = timezone.now() + timezone.timedelta(minutes=5)
                otp_verification.is_verified = False
            
            # Generate and send OTP
            otp_code = otp_verification.generate_otp()
            
            if send_otp_sms(phone_number, otp_code):
                return Response({
                    'message': 'OTP sent successfully',
                    'expires_in': 300  # 5 minutes in seconds
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Failed to send OTP'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyOTPView(APIView):
    """Verify OTP and complete phone registration."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']
            otp_code = serializer.validated_data['otp_code']
            
            try:
                otp_verification = OTPVerification.objects.get(phone_number=phone_number)
                
                if otp_verification.is_expired():
                    return Response({
                        'error': 'OTP has expired'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                if otp_verification.verify_otp(otp_code):
                    # Mark OTP as verified
                    otp_verification.is_verified = True
                    otp_verification.save()
                    
                    # Create user if doesn't exist
                    user, created = User.objects.get_or_create(
                        phone_number=phone_number,
                        defaults={
                            'is_phone_verified': True,
                            'username': f"user_{phone_number[-4:]}"
                        }
                    )
                    
                    if created:
                        # Create user profile
                        UserProfile.objects.create(user=user)
                    else:
                        # Update verification status
                        user.is_phone_verified = True
                        user.save()
                    
                    # Generate JWT tokens
                    refresh = RefreshToken.for_user(user)
                    
                    return Response({
                        'message': 'Phone number verified successfully',
                        'user': UserProfileSerializer(user).data,
                        'tokens': {
                            'refresh': str(refresh),
                            'access': str(refresh.access_token),
                        }
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({
                        'error': 'Invalid OTP'
                    }, status=status.HTTP_400_BAD_REQUEST)
                    
            except OTPVerification.DoesNotExist:
                return Response({
                    'error': 'OTP not found. Please request a new OTP.'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """User login with email/password or phone/OTP."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            phone_number = serializer.validated_data.get('phone_number')
            password = serializer.validated_data.get('password')
            otp_code = serializer.validated_data.get('otp_code')
            
            user = None
            
            # Email/Password login
            if email and password:
                user = authenticate(request, email=email, password=password)
                if not user:
                    return Response({
                        'error': 'Invalid email or password'
                    }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Phone/OTP login
            elif phone_number and otp_code:
                try:
                    otp_verification = OTPVerification.objects.get(phone_number=phone_number)
                    
                    if otp_verification.is_expired():
                        return Response({
                            'error': 'OTP has expired'
                        }, status=status.HTTP_400_BAD_REQUEST)
                    
                    if otp_verification.verify_otp(otp_code):
                        user = User.objects.get(phone_number=phone_number)
                        otp_verification.is_verified = True
                        otp_verification.save()
                    else:
                        return Response({
                            'error': 'Invalid OTP'
                        }, status=status.HTTP_401_UNAUTHORIZED)
                        
                except (OTPVerification.DoesNotExist, User.DoesNotExist):
                    return Response({
                        'error': 'Invalid phone number or OTP'
                    }, status=status.HTTP_401_UNAUTHORIZED)
            
            if user:
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    'message': 'Login successful',
                    'user': UserProfileSerializer(user).data,
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                }, status=status.HTTP_200_OK)
            
            return Response({
                'error': 'Authentication failed'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get and update user profile."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserProfileSerializer
        return UserProfileUpdateSerializer
    
    def get_object(self):
        return self.request.user


class ExtendedUserProfileView(generics.RetrieveUpdateAPIView):
    """Get and update extended user profile information."""
    
    serializer_class = ExtendedUserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile


class ChangePasswordView(APIView):
    """Change user password."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            return Response({
                'message': 'Password changed successfully'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """Logout user by blacklisting refresh token."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            return Response({
                'message': 'Logout successful'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': 'Invalid token'
            }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_stats(request):
    """Get user statistics."""
    user = request.user
    
    # Import here to avoid circular imports
    from apps.recipes.models import Recipe
    
    stats = {
        'total_recipes': Recipe.objects.filter(author=user).count(),
        'favorite_recipes': user.favorite_recipes.count() if hasattr(user, 'favorite_recipes') else 0,
        'profile_completion': calculate_profile_completion(user),
        'member_since': user.date_joined.strftime('%B %Y'),
    }
    
    return Response(stats, status=status.HTTP_200_OK)


def calculate_profile_completion(user):
    """Calculate profile completion percentage."""
    fields = ['first_name', 'last_name', 'avatar', 'phone_number']
    completed_fields = sum(1 for field in fields if getattr(user, field))
    
    # Check extended profile
    if hasattr(user, 'profile'):
        extended_fields = ['bio', 'cooking_experience', 'favorite_cuisines']
        completed_fields += sum(1 for field in extended_fields if getattr(user.profile, field))
        total_fields = len(fields) + len(extended_fields)
    else:
        total_fields = len(fields)
    
    return int((completed_fields / total_fields) * 100)

from .models import UserProfile
from .serializers import UserProfileSerializer
from rest_framework import generics, permissions

class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.userprofile
