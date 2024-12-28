# urls.py
from django.urls import path
from .views import PasswordResetRequestView, PasswordResetConfirmView

app_name = 'password_management'

urlpatterns = [
    # URL for requesting a password reset
    path(
        'request-reset/',
        PasswordResetRequestView.as_view(),
        name='password-reset-request'
    ),
    
    # URL for confirming password reset
    path(
        'confirm-reset/<str:uidb64>/<str:token>/',
        PasswordResetConfirmView.as_view(),
        name='password-reset-confirm'
    ),
]