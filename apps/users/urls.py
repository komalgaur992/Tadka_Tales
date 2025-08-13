from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

app_name = 'users'

urlpatterns = [
    # Authentication endpoints
    path('auth/signup/', views.UserRegistrationView.as_view(), name='signup'),
    path('auth/signup/phone/', views.PhoneRegistrationView.as_view(), name='phone_signup'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),
    
    # OTP endpoints
    path('auth/send-otp/', views.SendOTPView.as_view(), name='send_otp'),
    path('auth/verify-otp/', views.VerifyOTPView.as_view(), name='verify_otp'),
    
    # JWT token endpoints
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Profile endpoints
    path('auth/profile/', views.UserProfileView.as_view(), name='profile'),
    path('auth/profile/extended/', views.ExtendedUserProfileView.as_view(), name='extended_profile'),
    path('auth/change-password/', views.ChangePasswordView.as_view(), name='change_password'),
    
    # User stats
    path('auth/stats/', views.user_stats, name='user_stats'),
]

from .views import UserProfileView
urlpatterns.append(path('profile/', UserProfileView.as_view(), name='user-profile'))
