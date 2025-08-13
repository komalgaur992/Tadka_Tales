from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User, OTPVerification, UserProfile
from .utils import send_otp_sms
import re


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('email', 'password', 'password_confirm', 'first_name', 'last_name', 
                 'phone_number', 'language_preference')
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        return attrs
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email already exists.")
        return value
    
    def validate_phone_number(self, value):
        if value and User.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("User with this phone number already exists.")
        
        # Basic phone number validation
        if value and not re.match(r'^\+?1?\d{9,15}$', value):
            raise serializers.ValidationError("Enter a valid phone number.")
        return value
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        
        # Create user profile
        UserProfile.objects.create(user=user)
        return user


class PhoneRegistrationSerializer(serializers.Serializer):
    """Serializer for phone number registration."""
    
    phone_number = serializers.CharField(max_length=15)
    first_name = serializers.CharField(max_length=30, required=False)
    last_name = serializers.CharField(max_length=30, required=False)
    language_preference = serializers.ChoiceField(
        choices=[('en', 'English'), ('hi', 'Hindi')],
        default='en'
    )
    
    def validate_phone_number(self, value):
        if not re.match(r'^\+?1?\d{9,15}$', value):
            raise serializers.ValidationError("Enter a valid phone number.")
        return value


class OTPSendSerializer(serializers.Serializer):
    """Serializer for sending OTP."""
    
    phone_number = serializers.CharField(max_length=15)
    
    def validate_phone_number(self, value):
        if not re.match(r'^\+?1?\d{9,15}$', value):
            raise serializers.ValidationError("Enter a valid phone number.")
        return value


class OTPVerifySerializer(serializers.Serializer):
    """Serializer for OTP verification."""
    
    phone_number = serializers.CharField(max_length=15)
    otp_code = serializers.CharField(max_length=6)
    
    def validate_otp_code(self, value):
        if not re.match(r'^\d{6}$', value):
            raise serializers.ValidationError("OTP must be 6 digits.")
        return value


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    
    email = serializers.EmailField(required=False)
    phone_number = serializers.CharField(max_length=15, required=False)
    password = serializers.CharField(required=False)
    otp_code = serializers.CharField(max_length=6, required=False)
    
    def validate(self, attrs):
        email = attrs.get('email')
        phone_number = attrs.get('phone_number')
        password = attrs.get('password')
        otp_code = attrs.get('otp_code')
        
        if not (email or phone_number):
            raise serializers.ValidationError("Either email or phone number is required.")
        
        if email and not password:
            raise serializers.ValidationError("Password is required for email login.")
        
        if phone_number and not otp_code:
            raise serializers.ValidationError("OTP is required for phone login.")
        
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile."""
    
    full_name = serializers.CharField(read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'email', 'phone_number', 'first_name', 'last_name', 
                 'full_name', 'avatar', 'language_preference', 'is_phone_verified',
                 'is_email_verified', 'date_joined')
        read_only_fields = ('id', 'email', 'is_phone_verified', 'is_email_verified', 
                           'date_joined')


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile."""
    
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'avatar', 'language_preference')


class ExtendedUserProfileSerializer(serializers.ModelSerializer):
    """Serializer for extended user profile information."""
    
    class Meta:
        model = UserProfile
        fields = ('bio', 'profile_picture', 'phone_number', 'date_of_birth')


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for password change."""
    
    old_password = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])
    new_password_confirm = serializers.CharField()
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New passwords don't match.")
        return attrs
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value


class PasswordResetSerializer(serializers.Serializer):
    """Serializer for password reset request."""
    
    email = serializers.EmailField()
    
    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email does not exist.")
        return value
