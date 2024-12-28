# views.py
import logging
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings

# Set up logging
logger = logging.getLogger(__name__)

User = get_user_model()

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response(
                {
                    'error': 'Email is required',
                    'detail': 'Please provide an email address to reset your password.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.filter(email=email).first()
            
            if user:
                # Generate reset token and URL
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"
                
                # Log the reset URL for debugging (remove in production)
                logger.info(f"Password reset URL generated: {reset_url}")
                
                context = {
                    'user': user,
                    'reset_url': reset_url
                }
                
                email_html = render_to_string('password_management/reset_email.html', context)
                
                try:
                    send_mail(
                        subject='Password Reset Request',
                        message='Please click the link to reset your password',
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[email],
                        html_message=email_html,
                        fail_silently=False,
                    )
                    logger.info(f"Password reset email sent successfully to {email}")
                except Exception as e:
                    logger.error(f"Failed to send password reset email: {str(e)}")
                    return Response(
                        {
                            'error': 'Failed to send email',
                            'detail': 'There was an error sending the password reset email. Please try again later.'
                        },
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            
            # Don't reveal if the email exists
            return Response({
                'message': 'If an account exists with this email, you will receive password reset instructions.'
            })
            
        except Exception as e:
            logger.error(f"Password reset request error: {str(e)}")
            return Response(
                {
                    'error': 'Server error',
                    'detail': 'An unexpected error occurred. Please try again later.'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    
    def post(self, request, uidb64, token):
        try:
            # Log the received reset attempt
            logger.info(f"Password reset confirmation attempt - UID: {uidb64}")
            
            # Decode the user ID
            try:
                uid = force_str(urlsafe_base64_decode(uidb64))
                user = User.objects.get(pk=uid)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist) as e:
                logger.error(f"Invalid user ID in password reset: {str(e)}")
                return Response(
                    {
                        'error': 'Invalid reset link',
                        'detail': 'The password reset link is invalid or has expired. Please request a new one.'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Verify the token
            if not default_token_generator.check_token(user, token):
                logger.warning(f"Invalid or expired token used for user {uid}")
                return Response(
                    {
                        'error': 'Invalid or expired token',
                        'detail': 'This password reset link has expired. Please request a new one.'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get and validate new password
            new_password = request.data.get('new_password')
            if not new_password:
                return Response(
                    {
                        'error': 'Password required',
                        'detail': 'Please provide a new password.'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Set new password
            user.set_password(new_password)
            user.save()
            logger.info(f"Password successfully reset for user {uid}")
            
            return Response({
                'message': 'Password reset successful. You can now log in with your new password.'
            })
            
        except Exception as e:
            logger.error(f"Unexpected error in password reset confirmation: {str(e)}")
            return Response(
                {
                    'error': 'Server error',
                    'detail': 'An unexpected error occurred while resetting your password. Please try again.'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )