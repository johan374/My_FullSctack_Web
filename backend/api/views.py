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
    """Custom JWT token serializer that supports login with either username or email"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Replace username field with login field
        self.fields['login'] = serializers.CharField(required=True)
        self.fields.pop('username', None)

    def validate(self, attrs):
        login = attrs.get('login', '').strip()
        password = attrs.get('password', '')

        try:
            # First try username
            user = User.objects.filter(username=login).first()
            
            # If not found, try email
            if not user:
                user = User.objects.filter(email=login).first()
                if user:
                    login = user.username  # Use username for authentication
            
            if not user:
                raise serializers.ValidationError({
                    'error': 'Account not found. Please check your username or email.'
                })

            # Authenticate with username (not email)
            user = authenticate(username=login, password=password)
            
            if not user:
                raise serializers.ValidationError({
                    'error': 'Invalid password.'
                })

            if not user.is_active:
                raise serializers.ValidationError({
                    'error': 'This account is inactive.'
                })

            # Set username for parent class
            attrs['username'] = user.username
            return super().validate(attrs)

        except Exception as e:
            raise serializers.ValidationError({
                'error': str(e)
            })


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        try:                       # This line should be indented
            # Get the response from parent class first
            response = super().post(request, *args, **kwargs)
            
            if response.status_code == 200:
                # Get the login field from request
                login = request.data.get('login')
                
                # Find the user
                user = User.objects.filter(username=login).first()
                if not user:
                    user = User.objects.filter(email=login).first()
                
                if user:
                    # Only create remember_me token if requested
                    remember_me = request.data.get('remember_me', False)
                    if remember_me:
                        RememberMeToken.objects.update_or_create(
                            user=user,
                            defaults={
                                'token': response.data['refresh'],
                                'expires_at': timezone.now() + timedelta(days=60)
                            }
                        )
                        
                        # Add expiration info to response
                        response.data['access_expires'] = timezone.now() + timedelta(days=30)
                        response.data['refresh_expires'] = timezone.now() + timedelta(days=60)
            
            return response
        
        except Exception as e:
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


def create(self, request, *args, **kwargs):
    try:
        # Attempt to create user via parent class method
        response = super().create(request, *args, **kwargs)
        # Return 201 status on success
        return Response(response.data, status=status.HTTP_201_CREATED)
        
    except serializers.ValidationError as e:
        # Handle validation errors (like invalid password)
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        # Check error message for specific cases
        if "username already exists" in str(e).lower():
            return Response({"error": "Username already exists"}, 
                          status=status.HTTP_409_CONFLICT)
        if "email already exists" in str(e).lower():
            return Response({"error": "Email already exists"}, 
                          status=status.HTTP_409_CONFLICT)
        # Generic server error for other exceptions    
        return Response({"error": "Server error"}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request, *args, **kwargs):
        try:
            # Attempt to create user via parent class method
            response = super().create(request, *args, **kwargs)
            # Return 201 status on success
            return Response(response.data, status=status.HTTP_201_CREATED)
            
        except serializers.ValidationError as e:
            # Handle validation errors (like invalid password)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            # Check error message for specific cases
            if "username already exists" in str(e).lower():
                return Response({"error": "Username already exists"}, 
                            status=status.HTTP_409_CONFLICT)
            if "email already exists" in str(e).lower():
                return Response({"error": "Email already exists"}, 
                            status=status.HTTP_409_CONFLICT)
            # Generic server error for other exceptions    
            return Response({"error": "Server error"}, 
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
