# views.py
import logging
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils import timezone
from .models import PasswordResetCode

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
                # Generate reset code
                reset_code = PasswordResetCode.create_for_user(user)
                
                # Log the reset code for debugging (remove in production)
                logger.info(f"Password reset code generated for user: {user.username}")
                
                context = {
                    'user': user,
                    'reset_code': reset_code.code
                }
                
                email_html = render_to_string('password_management/reset_email_code.html', context)
                
                try:
                    send_mail(
                        subject='Your Password Reset Code',
                        message=f'Your password reset code is: {reset_code.code}',
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[email],
                        html_message=email_html,
                        fail_silently=False,
                    )
                    logger.info(f"Password reset code sent successfully to {email}")
                except Exception as e:
                    logger.error(f"Failed to send password reset email: {str(e)}")
                    return Response(
                        {
                            'error': 'Failed to send email',
                            'detail': 'There was an error sending the reset code. Please try again later.'
                        },
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            
            # Don't reveal if the email exists
            return Response({
                'message': 'If an account exists with this email, you will receive a reset code.'
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

class PasswordResetVerifyView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    
    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')
        new_password = request.data.get('new_password')

        if not all([email, code, new_password]):
            return Response(
                {
                    'error': 'Missing required fields',
                    'detail': 'Email, code and new password are required.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.filter(email=email).first()
            if not user:
                return Response(
                    {
                        'error': 'Invalid reset code',
                        'detail': 'The reset code is invalid or has expired.'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Find valid reset code
            reset_code = PasswordResetCode.objects.filter(
                user=user,
                code=code,
                used=False,
                expires_at__gt=timezone.now()
            ).first()

            if not reset_code:
                logger.warning(f"Invalid or expired reset code attempt for email: {email}")
                return Response(
                    {
                        'error': 'Invalid reset code',
                        'detail': 'The reset code is invalid or has expired. Please request a new one.'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Set new password
            user.set_password(new_password)
            user.save()

            # Mark code as used
            reset_code.used = True
            reset_code.save()

            logger.info(f"Password successfully reset for user {user.username}")
            return Response({
                'message': 'Password reset successful. You can now log in with your new password.'
            })

        except Exception as e:
            logger.error(f"Password reset verification error: {str(e)}")
            return Response(
                {
                    'error': 'Server error',
                    'detail': 'An unexpected error occurred while resetting your password. Please try again.'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )