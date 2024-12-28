# urls.py
from django.urls import path
from .views import PasswordResetRequestView, PasswordResetVerifyView

app_name = 'password_management'

urlpatterns = [
    # URL for requesting a password reset code
    path(
        'request-reset/',
        PasswordResetRequestView.as_view(),
        name='password-reset-request'
    ),
    
    # URL for verifying code and resetting password
    path(
        'verify-reset/',
        PasswordResetVerifyView.as_view(),
        name='password-reset-verify'
    ),
]
