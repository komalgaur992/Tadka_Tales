from django.conf import settings
from twilio.rest import Client
import logging

logger = logging.getLogger(__name__)


def send_otp_sms(phone_number, otp_code):
    """
    Send OTP via SMS using Twilio.
    For development, this can be mocked.
    """
    if settings.DEBUG:
        # Mock SMS sending in development
        logger.info(f"Mock SMS: OTP {otp_code} sent to {phone_number}")
        print(f"Mock SMS: Your Tadka Tales OTP is {otp_code}")
        return True
    
    try:
        # Production SMS sending with Twilio
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        
        message = client.messages.create(
            body=f"Your Tadka Tales verification code is: {otp_code}. Valid for 5 minutes.",
            from_=settings.TWILIO_PHONE_NUMBER,
            to=phone_number
        )
        
        logger.info(f"SMS sent successfully to {phone_number}, SID: {message.sid}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send SMS to {phone_number}: {str(e)}")
        return False


def generate_username_from_email(email):
    """Generate a unique username from email."""
    from .models import User
    import uuid
    
    base_username = email.split('@')[0]
    username = base_username
    counter = 1
    
    while User.objects.filter(username=username).exists():
        username = f"{base_username}_{counter}"
        counter += 1
    
    return username


def create_user_from_social_auth(strategy, details, user=None, *args, **kwargs):
    """Create user from social authentication."""
    from .models import User, UserProfile
    
    if user:
        return {'is_new': False}
    
    email = details.get('email')
    first_name = details.get('first_name', '')
    last_name = details.get('last_name', '')
    
    if not email:
        return None
    
    # Check if user already exists
    try:
        existing_user = User.objects.get(email=email)
        return {'is_new': False, 'user': existing_user}
    except User.DoesNotExist:
        pass
    
    # Create new user
    user = User.objects.create_user(
        email=email,
        first_name=first_name,
        last_name=last_name,
        username=generate_username_from_email(email),
        is_email_verified=True  # Email is verified through social auth
    )
    
    # Create user profile
    UserProfile.objects.create(user=user)
    
    return {'is_new': True, 'user': user}
