# Django core imports
from django.contrib import admin  # For Django's admin interface
from django.urls import path, include  # URL routing utilities
from api.views import CreateUserView, CustomTokenObtainPairView  # Add CustomTokenObtainPairView  # Custom view for user registration

# JWT (JSON Web Token) authentication views
from rest_framework_simplejwt.views import (
    TokenRefreshView,     # Handles token refresh
)

# API root view function
from django.http import JsonResponse

def api_root(request):
    """
    Root API view that provides documentation of available endpoints
    Returns a JSON response listing all available API endpoints
    """
    return JsonResponse({
        "message": "Welcome to My Web API",
        "endpoints": {
            "notes": "/api/notes/",              # Endpoint for notes operations
            "auth": "/api/token/",               # Authentication endpoint
            "payments": "/api/payments/config/",  # Payment configuration endpoint
            "register": "api/user/register/",     # User registration endpoint
            'login': "api/token/"                # Login endpoint (same as auth)
        }
    })

# URL Patterns Configuration
urlpatterns = [
    # Django Admin Interface
    # Provides access to Django's built-in admin site
    path('admin/', admin.site.urls),

    # User Registration Endpoint
    # Handles POST requests for creating new users
    # Uses CreateUserView which interfaces with UserSerializer
    path('api/user/register/', 
         CreateUserView.as_view(), 
         name="register"),

    # Login Endpoint (Custom Token Generation that accepts username or email)
    path("api/token/", 
         CustomTokenObtainPairView.as_view(), 
         name="get_token"),

    # Token Refresh Endpoint
    # Handles POST requests to refresh expired access tokens
    # Requires a valid refresh token
    # Example request body: {"refresh": "refresh_token"}
    path("api/token/refresh/", 
         TokenRefreshView.as_view(), 
         name="refresh"),

    # DRF Authentication URLs
    # Includes Django REST Framework's built-in authentication views
    # Useful for the browsable API interface
    path("api-auth/", 
         include("rest_framework.urls")),

    # API Application URLs
    # Includes all URLs defined in the api app's urls.py
    path("api/", 
         include("api.urls")),

    # Payment URLs
    # Includes all payment-related URLs from the payments app
    path('api/payments/', 
         include('payments.urls')),

    # API Root
    # Shows the welcome message and available endpoints
    path('', 
         api_root, 
         name='api-root'),

    # Password Management URLs
    # Includes password-related functionality (reset, change, etc.)
    path('api/password/', 
         include('password_management.urls')),
]

"""
Authentication Flow:

1. Registration:
   POST /api/user/register/
   Body: {
       "username": "newuser",
       "password": "userpass",
       "email": "user@example.com"
   }

2. Login (Token Generation):
   POST /api/token/
   Body: {
       "username": "newuser",
       "password": "userpass"
   }
   Response: {
       "access": "eyJ0eXAiOi...",  # Access token
       "refresh": "eyJ0eXAiOi..."  # Refresh token
   }

3. Token Refresh:
   POST /api/token/refresh/
   Body: {
       "refresh": "eyJ0eXAiOi..."  # Your refresh token
   }
   Response: {
       "access": "eyJ0eXAiOi..."  # New access token
   }

Note: Access tokens typically expire after a short time (e.g., 5 minutes)
      Refresh tokens last longer (e.g., 24 hours)
"""