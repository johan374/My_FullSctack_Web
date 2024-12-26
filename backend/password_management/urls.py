# password_management/urls.py
from django.urls import path
from .views import PasswordResetRequestView, PasswordResetConfirmView

app_name = 'password_management'

urlpatterns = [
    # URL for step 1 - requesting password reset
    path('request-reset/', 
         PasswordResetRequestView.as_view(), 
         name='request-reset'),

    # URL for step 2 - confirming reset and setting new password
    # <str:uidb64> and <str:token> are URL parameters passed to the view
    path('confirm-reset/<str:uidb64>/<str:token>/', 
         PasswordResetConfirmView.as_view(), 
         name='confirm-reset'),
]