from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import generics, serializers, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import UserSerializer, NoteSerializer
from .models import Note
from django.utils import timezone
from datetime import timedelta
from .models import Note, RememberMeToken  # Update this line to include RememberMeToken

# Authentication Classes
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT token serializer that extends the default TokenObtainPairSerializer
    to allow login with either username or email
    """
    
    def __init__(self, *args, **kwargs):
        # Call the parent class's __init__ method to set up the initial serializer
        super().__init__(*args, **kwargs)
        
        # Dynamically modify the serializer fields:
        # 1. Add a new 'login' field that can accept either username or email
        # - This field is required and will be used for authentication
        # - It replaces the standard 'username' field
        self.fields['login'] = serializers.CharField(required=True)
        
        # Remove the original 'username' field
        # - This allows our new 'login' field to be the primary authentication identifier
        # - If 'username' doesn't exist, it won't raise an error (None is returned)
        self.fields.pop('username', None)

    def validate(self, attrs):
        # Extract the login credential and password from the input
        # - .strip() removes any leading/trailing whitespace
        # - Default to empty string if not provided
        login = attrs.get('login', '').strip()
        password = attrs.get('password', '')

        try:
            # Authentication attempt strategy:
            # 1. First, try to find user by username
            user = User.objects.filter(username=login).first()
            
            # 2. If no user found by username, try finding by email
            if not user:
                user = User.objects.filter(email=login).first()
                if user:
                    # If found by email, use the username for Django's authenticate method
                    login = user.username
            
            # 3. If no user found at all, raise a validation error
            if not user:
                raise serializers.ValidationError({
                    'error': 'Account not found. Please check your username or email.'
                })

            # 4. Attempt to authenticate using username
            # - Django's authenticate uses username, not email
            user = authenticate(username=login, password=password)
            
            # 5. Check if authentication failed
            if not user:
                raise serializers.ValidationError({
                    'error': 'Invalid password.'
                })

            # 6. Check if the user account is active
            if not user.is_active:
                raise serializers.ValidationError({
                    'error': 'This account is inactive.'
                })

            # 7. Set the username for the parent class's validation
            # - This ensures compatibility with the parent JWT token serializer
            attrs['username'] = user.username
            
            # 8. Call the parent class's validate method to complete the token generation
            return super().validate(attrs)

        except Exception as e:
            # 9. Catch any unexpected errors and convert them to a validation error
            # - This provides a consistent error response format
            raise serializers.ValidationError({
                'error': str(e)
            })


class CustomTokenObtainPairView(TokenObtainPairView):
    # Override the serializer to use our custom serializer that supports email/username login
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        try:
            # 1. Call the parent class's post method to generate JWT tokens
            # - This uses the CustomTokenObtainPairSerializer we defined earlier
            # - Generates access and refresh tokens
            response = super().post(request, *args, **kwargs)
            
            # 2. Check if token generation was successful
            # - 200 status code indicates successful authentication
            if response.status_code == 200:
                # 3. Retrieve the login credential used for authentication
                # - This could be either username or email
                login = request.data.get('login')
                
                # 4. Find the user based on the login credential
                # First, try to find by username
                user = User.objects.filter(username=login).first()
                
                # If not found by username, try to find by email
                if not user:
                    user = User.objects.filter(email=login).first()
                
                # 5. If a user is found, check for "Remember Me" functionality
                if user:
                    # Get the "remember me" flag from the request
                    # - Defaults to False if not provided
                    remember_me = request.data.get('remember_me', False)
                    
                    # 6. If "Remember Me" is selected, create a long-lived token
                    if remember_me:
                        # Create or update a RememberMeToken for this user
                        RememberMeToken.objects.update_or_create(
                            user=user,
                            defaults={
                                # Use the refresh token for the remember me token
                                'token': response.data['refresh'],
                                # Set expiration to 60 days from now
                                'expires_at': timezone.now() + timedelta(days=60)
                            }
                        )
                        
                        # 7. Add token expiration information to the response
                        # - Helps client understand token lifetimes
                        response.data['access_expires'] = timezone.now() + timedelta(days=30)
                        response.data['refresh_expires'] = timezone.now() + timedelta(days=60)
                
                # 8. Return the response with potentially modified data
                return response
        
        # 9. Catch and handle any unexpected errors during the process
        except Exception as e:
            # Return a 400 Bad Request response with the error message
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
# User Management Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """Return details of the currently authenticated user"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class CreateUserView(generics.CreateAPIView):
    # Class-level configuration for the user creation view

    # 1. Define the queryset: Specifies all User objects in the database
    # - This allows the view to interact with the entire User model
    # - Used for operations like checking existing users
    queryset = User.objects.all()

    # 2. Specify the serializer class for user creation
    # - UserSerializer handles validation, data transformation, and user creation
    # - Defines how user data should be processed and validated
    serializer_class = UserSerializer

    # 3. Set permission classes
    # - AllowAny means anyone can access this view without authentication
    # - Critical for user registration endpoint where new users can sign up
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        try:
            # 4. Call the parent class's create method
            # - This uses the UserSerializer to validate and create the user
            # - Handles the standard user creation process
            response = super().create(request, *args, **kwargs)
            
            # 5. Return a successful response
            # - 201 Created status indicates successful resource creation
            # - Sends back the created user's data
            return Response(response.data, status=status.HTTP_201_CREATED)

        except serializers.ValidationError as e:
            # 6. Handle validation errors specific to user creation
            # - These are errors caught during data validation
            
            # 6.1 Extract error details
            # - If 'detail' attribute exists, use it
            # - Otherwise, use the first argument of the error
            error_data = e.detail if hasattr(e, 'detail') else e.args[0]

            # 6.2 Log validation errors for server-side debugging
            print("Validation Error:", error_data)

            # 6.3 Specific error handling based on error type
            # - Check if error_data is a dictionary (structured error)
            if isinstance(error_data, dict):
                # 6.4 Handle username-related errors
                if 'username' in error_data:
                    return Response(
                        {
                            "error": "Username already exists", 
                            "details": error_data['username']
                        }, 
                        status=status.HTTP_409_CONFLICT  # Conflict status
                    )
                
                # 6.5 Handle email-related errors
                if 'email' in error_data:
                    return Response(
                        {
                            "error": "Email already exists", 
                            "details": error_data['email']
                        }, 
                        status=status.HTTP_409_CONFLICT  # Conflict status
                    )
                
                # 6.6 Handle password-related errors
                if 'password' in error_data:
                    return Response(
                        {
                            "error": error_data['password'][0]  # First password error
                        }, 
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # 6.7 Fallback error response for unhandled validation errors
            return Response(
                {"error": str(error_data)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            # 7. Catch-all error handling for unexpected errors
            # - Provides a safety net for any unhandled exceptions
            
            # 7.1 Log the unexpected error for server-side investigation
            print("Unexpected error during user creation:", str(e))
            
            # 7.2 Return a generic server error response
            return Response(
                {
                    "error": "Server error occurred", 
                    "details": str(e)
                }, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

# Note Management Views
class NoteListCreate(generics.ListCreateAPIView):
    """List and create notes for authenticated users"""
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return only notes belonging to the current user"""
        return Note.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        """Create a new note, setting the current user as author"""
        try:
            serializer.save(author=self.request.user)
        except Exception as e:
            raise serializers.ValidationError(str(e))

    def create(self, request, *args, **kwargs):
        """Override create to provide better error responses"""
        try:
            response = super().create(request, *args, **kwargs)
            return Response({
                'success': True,
                'message': 'Note created successfully',
                'data': response.data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class NoteDelete(generics.DestroyAPIView):
    """Delete a specific note"""
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return only notes belonging to the current user"""
        return Note.objects.filter(author=self.request.user)

    def destroy(self, request, *args, **kwargs):
        """Override destroy to provide better error responses"""
        try:
            response = super().destroy(request, *args, **kwargs)
            return Response({
                'success': True,
                'message': 'Note deleted successfully'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)