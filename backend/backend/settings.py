from pathlib import Path #new importsss
from datetime import timedelta
from dotenv import load_dotenv
import os

load_dotenv()

# Add these to your existing settings
STRIPE_PUBLISHABLE_KEY = os.getenv('STRIPE_PUBLISHABLE_KEY')
STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY')



# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


SIMPLE_JWT = {
    # Sets the lifetime of the access token.
    # This token is used to authenticate API requests.
    # It will expire after 30 minutes, requiring clients to either log in again or use a refresh token.
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    
    # Sets the lifetime of the refresh token.
    # This token is used to obtain new access tokens when they expire.
    # It remains valid for 1 day, allowing clients to reauthenticate without providing their credentials again.
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}
#end of new code

# Application definition

INSTALLED_APPS = [
    # Default Django apps required for core functionality
    'django.contrib.admin',          # Admin panel for managing the database and site content.
    'django.contrib.auth',           # User authentication system (login, logout, permissions).
    'django.contrib.contenttypes',   # Framework for handling different content types.
    'django.contrib.sessions',       # Manages user sessions (storing data between requests).
    'django.contrib.messages',       # Messaging framework for flashing one-time messages to users.
    'django.contrib.staticfiles',    # Manages serving static files like CSS, JS, and images.

    # Custom app for the project
    "api",                           # Your custom app where API-related functionality is implemented.
    'payments',
    'password_management',
    'SendEmail',

    # Third-party libraries for added functionality
    "rest_framework",                # Django REST Framework for building and managing APIs.
    "corsheaders",                   # Middleware to handle Cross-Origin Resource Sharing (CORS) policies.
]


MIDDLEWARE = [
    # Security middleware that helps protect the site from common security threats
    'django.middleware.security.SecurityMiddleware',   # Provides security-related headers and protections (e.g., HTTPS redirection).
    # Middleware to handle user session management (preserves session data between requests)
    'django.contrib.sessions.middleware.SessionMiddleware',   # Manages sessions to store information across requests (e.g., user logged in).
    # Middleware that provides common view handling functionality
    'django.middleware.common.CommonMiddleware',   # Provides some common utilities like URL normalization and handling of 404 errors.
    # Middleware that provides Cross-Site Request Forgery (CSRF) protection
    'django.middleware.csrf.CsrfViewMiddleware',   # Ensures requests made by users are from trusted sources to prevent CSRF attacks.
    # Middleware to handle user authentication (manages user login and permission checking)
    'django.contrib.auth.middleware.AuthenticationMiddleware',   # Associates the authenticated user with the request.
    # Middleware for handling and displaying messages to users (flash messages)
    'django.contrib.messages.middleware.MessageMiddleware',   # Handles one-time messages (e.g., success or error messages after form submission).
    # Middleware to prevent clickjacking attacks by setting an X-Frame-Options header
    'django.middleware.clickjacking.XFrameOptionsMiddleware',   # Prevents the site from being embedded in iframes to protect against clickjacking.
    
    # CORS middleware to allow cross-origin requests from other domains (needed for APIs)
    "corsheaders.middleware.CorsMiddleware",   # Handles CORS (Cross-Origin Resource Sharing) headers, allowing your API to be accessed from different domains.
]


ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'templates'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

# Configure database using dj_database_url
# Import the library that helps us parse database URLs
from dotenv import load_dotenv  # Import to read .env file
import os

# Load all environment variables from .env file
# This makes them available through os.getenv()
load_dotenv()

# Database configuration using environment variables
DATABASES = {
    'default': {
        # Specify PostgreSQL as the database engine
        'ENGINE': 'django.db.backends.postgresql',
        # Get database name from .env, fallback to 'my_db' if not found
        'NAME': os.getenv('DB_NAME', 'my_db'),       
        # Get database user from .env
        'USER': os.getenv('DB_USER'),    
        # Get database password from .env
        'PASSWORD': os.getenv('DB_PASSWORD'), 
        # Get host from .env (localhost for local development)
        'HOST': os.getenv('DB_HOST'),
        # Get port from .env (default PostgreSQL port is 5432)
        'PORT': os.getenv('DB_PORT'),
    }
}



# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

import os

# Static files settings
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Extra static file directories (if you have any)
# Remove or comment out STATICFILES_DIRS if you have it
# STATICFILES_DIRS = [
#     os.path.join(BASE_DIR, 'static'),
# ]

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Add this to your settings.py after the existing configurations

# Logging configuration if we have an error
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}

# Create logs directory if it doesn't exist
LOGS_DIR = os.path.join(BASE_DIR, 'logs')
if not os.path.exists(LOGS_DIR):
    os.makedirs(LOGS_DIR)

# Allowing all origins (domains) to make cross-origin requests to the API
#CORS_ALLOW_ALL_ORIGINS = True   # This allows any domain to access your API, which is useful in development but should be restricted in production to ensure security.

CORS_ALLOWED_ORIGINS = [
    "https://my-fullsctack-web-frontend.onrender.com",  # Replace with your frontend URL
    "http://localhost:5173",
]

# Allowing credentials (cookies, HTTP authentication, etc.) to be included in cross-origin requests
CORS_ALLOW_CREDENTIALS = True   # This allows requests to include credentials (e.g., cookies, HTTP authentication), which can be necessary for maintaining user sessions across different domains.

# Email settings (configure according to your email provider)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'  # Or your email provider's SMTP server
EMAIL_PORT = 587
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True') == 'True'
EMAIL_HOST_USER = 'robloxmapa@gmail.com'
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD') #important
DEFAULT_FROM_EMAIL = 'robloxmapa@gmail.com'

# Frontend URL for password reset
FRONTEND_URL = 'https://my-fullsctack-web-frontend.onrender.com'  # Adjust to your frontend URL

#################################
# Security Settings
# This setting automatically redirects all HTTP traffic to HTTPS in production
# It's like having a security guard that ensures everyone uses the secure entrance
SECURE_SSL_REDIRECT = not DEBUG
# This tells Django how to know if a request came through HTTPS when using a proxy
# Imagine your application is in a secure building, but visitors first check in at a front desk (the proxy)
# This setting helps your application trust what the front desk tells it about visitors
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# This ensures session cookies (which contain sensitive user data) are only sent over HTTPS
# Think of it like sending confidential documents only via secure courier, never regular mail
SESSION_COOKIE_SECURE = not DEBUG
# Similarly, this ensures CSRF tokens (which protect against cross-site request forgery)
# are only sent over secure connections
# It's like requiring a secure channel for sending security access codes
CSRF_COOKIE_SECURE = not DEBUG

# Enables the browser's built-in protection against Cross-Site Scripting (XSS) attacks
# It's like having an automatic security system that checks for suspicious code
SECURE_BROWSER_XSS_FILTER = True
# Prevents browsers from trying to guess (or "sniff") the type of file being sent
# Imagine a malicious file pretending to be a harmless image - this prevents that
SECURE_CONTENT_TYPE_NOSNIFF = True
# Prevents your site from being embedded in frames on other websites
# This is like preventing someone from putting your house's security camera feed
# inside their own surveillance system
X_FRAME_OPTIONS = 'DENY'

# Forces browsers to use HTTPS for your site for one year
# Once a browser visits your site, it will remember to always use HTTPS
# for the next year (31536000 seconds)
SECURE_HSTS_SECONDS = 31536000
# Applies this HTTPS-only rule to all subdomains too
# If your main site is secure.example.com, this ensures that
# blog.secure.example.com, shop.secure.example.com, etc. are also secure
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
# Allows browsers to know about your HTTPS-only policy before they even visit
# Modern browsers maintain a list of sites that should only be accessed via HTTPS
# This setting puts your site on that list
SECURE_HSTS_PRELOAD = True

# Session Settings
SESSION_COOKIE_HTTPONLY = True  # Prevent JavaScript access to session cookie
SESSION_EXPIRE_AT_BROWSER_CLOSE = True  # Session expires when browser closes
SESSION_COOKIE_AGE = 1209600  # 2 weeks in seconds

# CSRF Settings
CSRF_COOKIE_HTTPONLY = True  # Prevent JavaScript access to CSRF cookie
#specifies which domains are allowed to send POST, PUT, PATCH, or DELETE requests to your Django backend:
CSRF_TRUSTED_ORIGINS = [
    "https://my-fullsctack-web-frontend.onrender.com",
    "http://localhost:5173",
]

# Password Settings
# Password hashing configuration - defines how user passwords are secured
PASSWORD_HASHERS = [
   # Primary hasher - Argon2 is the recommended choice
   'django.contrib.auth.hashers.Argon2PasswordHasher',  # Modern, memory-hard algorithm
   # Fallback hashers - used for legacy passwords and if Argon2 is unavailable
   'django.contrib.auth.hashers.PBKDF2PasswordHasher',  # PBKDF2 with SHA256
   'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',  # PBKDF2 with SHA1
]

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
# Ensure DEBUG is properly set based on environment
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'

# You might want to update your ALLOWED_HOSTS based on environment
if not DEBUG:
    ALLOWED_HOSTS = [
        'my-fullsctack-web.onrender.com',
        'my-fullsctack-web-frontend.onrender.com',
    ]
else:
    ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']

#new code
# REST_FRAMEWORK settings - controls Django REST Framework behavior
REST_FRAMEWORK = {
    # Specifies the default authentication mechanisms for the Django REST Framework.
    # In this case, it uses JWT (JSON Web Tokens) for authentication, provided by Simple JWT.
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    
    # Specifies the default permission classes for API views.
    # 'IsAuthenticated' ensures that only authenticated users can access the API endpoints.
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    # Rate limiting settings to prevent API abuse
   'DEFAULT_THROTTLE_RATES': {
       'anon': '100/day',    # Unauthenticated users: 100 requests/day
       'user': '1000/day'    # Authenticated users: 1000 requests/day
   }
}

# Add django-cors-headers to INSTALLED_APPS if not already there
# This checks if 'corsheaders' is in your installed apps
# If it's not there, it adds it to the list
# This is like making sure you have the right tool before trying to use it
if 'corsheaders' not in INSTALLED_APPS:
    INSTALLED_APPS.append('corsheaders')

# This puts the CORS middleware at the very start of the middleware list
# It's critical for it to be first because it needs to check if requests 
# from different origins are allowed before any other processing happens
MIDDLEWARE.insert(0, 'corsheaders.middleware.CorsMiddleware')

# Similarly, this ensures the security middleware is present and at the start
# This middleware provides essential security features like HTTPS handling
if 'django.middleware.security.SecurityMiddleware' not in MIDDLEWARE:
    MIDDLEWARE.insert(0, 'django.middleware.security.SecurityMiddleware')

# This sets a maximum size for individual file uploads
FILE_UPLOAD_MAX_MEMORY_SIZE = 2621440  # 2.5 MB
# If someone tries to upload a file larger than 2.5 MB, it will be rejected
# This prevents someone from overwhelming your server with huge files

# This sets a maximum size for all data in a POST request
DATA_UPLOAD_MAX_MEMORY_SIZE = 2621440  # 2.5 MB
# This includes everything sent in the request - form data, files, JSON, etc.
# It's like putting a weight limit on how much data can be sent at once

#CAHCES###  
# Redis cache configuration for better performance
##used for
# Cache configuration for production scalability
# Currently using database for data storage, but Redis is configured 
# for future implementation of:
# - High-performance caching
# - Session management
# - Rate limiting
##
# Cache configuration for Redis on Render
CACHES = {
    'default': {
        # Specify Redis as our caching backend
        # This tells Django to use Redis for storing cached data
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        
        # The LOCATION setting determines where Redis is running
        # os.getenv('REDIS_URL') - First tries to get the Redis URL from environment variables
        # When deployed on Render:
        # - Render automatically manages the full Redis URL with authentication
        # - The URL includes username, password, host, and port
        # - We don't see the full URL for security reasons
        # 
        # 'redis://localhost:6379/0' - Fallback for local development
        # - Used when REDIS_URL isn't found in environment
        # - localhost: connects to Redis on your local machine
        # - 6379: default Redis port
        # - /0: uses database 0 (Redis can have multiple databases)
        'LOCATION': os.getenv('REDIS_URL', 'redis://localhost:6379/0'),

        # Note: When running on Render, the connection works like this:
        # 1. Your web service and Redis instance are in Render's private network
        # 2. Render injects the full Redis URL into your application's environment
        # 3. Django uses this URL to establish a secure connection to Redis
        # 4. All communication happens within Render's internal network
        #
        # This is similar to how a building's internal phone system works:
        # - You don't need the full phone number, just the extension
        # - The building's system handles all the routing
        # - Connections are secure because they never leave the building
    }
}
################################################ 