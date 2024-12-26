# views.py - Main logic for password reset system

# Import necessary modules from Django REST framework
from rest_framework import status  # HTTP status codes (200=success, 400=bad request, etc)
from rest_framework.response import Response  # For sending API responses
from rest_framework.views import APIView  # Base class for API endpoints
from rest_framework.permissions import AllowAny  # Allows public access

# Django imports for authentication and utilities
from django.contrib.auth import get_user_model  # Gets the active User model (default or custom)
from django.core.mail import send_mail  # Email functionality
from django.template.loader import render_to_string  # Convert HTML templates to strings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode  # For encoding/decoding IDs
from django.utils.encoding import force_bytes, force_str  # Convert between bytes and strings
from django.contrib.auth.tokens import default_token_generator  # Create secure tokens
from django.conf import settings  # Access project settings

# Get the User model that's currently active in the project
User = get_user_model()

class PasswordResetRequestView(APIView):
    """
    First step of password reset:
    1. User submits their email
    2. System generates reset token and link
    3. System sends email with reset link
    """
    # Security settings - anyone can access this endpoint
    permission_classes = [AllowAny]  # Public access allowed
    authentication_classes = []      # No authentication needed

    def post(self, request):
        # Extract email from the POST request data
        email = request.data.get('email')
        
        # Check if email was provided
        if not email:
            return Response(
                {'error': 'Email is required'},
                status=status.HTTP_400_BAD_REQUEST  # 400 status code
            )
        
        # Look for user with this email
        # .first() returns None if no user found
        user = User.objects.filter(email=email).first()
        
        # If we found a user with this email
        if user:
            # Generate unique security token for this user
            token = default_token_generator.make_token(user)
            
            # Convert user ID to secure format for URL
            # 1. Convert ID to bytes with force_bytes
            # 2. Encode bytes to base64 with urlsafe_base64_encode
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # Create the password reset URL
            # Example: https://mysite.com/reset-password/MTIz/abcd1234
            reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"
            
            # Prepare data for email template
            context = {
                'user': user,
                'reset_url': reset_url
            }
            
            # Convert HTML template to string with context
            email_html = render_to_string('password_management/reset_email.html', context)
            
            # Send the password reset email
            send_mail(
                subject='Password Reset Request',
                message='Please click the link to reset your password',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                html_message=email_html,
                fail_silently=False,  # Raise errors if email fails
            )
        
        # Return generic response for security
        # Don't reveal if email exists in system
        return Response({
            'message': 'If an account exists with this email, you will receive password reset instructions.'
        })

class PasswordResetConfirmView(APIView):
    """
    Second step of password reset:
    1. User clicks link from email
    2. System verifies token
    3. User sets new password
    """
    permission_classes = [AllowAny]
    authentication_classes = []
    
    def post(self, request, uidb64, token):
        try:
            # Decode the user ID from URL
            # 1. Decode base64 to bytes
            # 2. Convert bytes to string
            uid = force_str(urlsafe_base64_decode(uidb64))
            
            # Find user with this ID
            user = User.objects.get(pk=uid)
            
            # Verify the token is valid for this user
            if default_token_generator.check_token(user, token):
                # Get new password from request
                new_password = request.data.get('new_password')
                
                # Verify new password was provided
                if not new_password:
                    return Response(
                        {'error': 'New password is required'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Set user's new password (handles hashing)
                user.set_password(new_password)
                user.save()
                
                return Response({'message': 'Password reset successful'})
            
            # Token was invalid
            return Response(
                {'error': 'Invalid reset link'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Handle all possible errors during decoding/lookup
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {'error': 'Invalid reset link'},
                status=status.HTTP_400_BAD_REQUEST
            )
