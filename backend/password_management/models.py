# Add this to your models.py
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
import random

User = get_user_model()

class PasswordResetCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)

    @classmethod
    def generate_code(cls):
        """Generate a random 6-digit code"""
        return ''.join([str(random.randint(0, 9)) for _ in range(6)])

    @classmethod
    def create_for_user(cls, user):
        """Create a new reset code for a user"""
        # Delete any existing unused codes
        cls.objects.filter(user=user, used=False).delete()
        
        # Generate new code
        code = cls.generate_code()
        # Set expiration to 15 minutes from now
        expires_at = timezone.now() + timezone.timedelta(minutes=15)
        
        return cls.objects.create(
            user=user,
            code=code,
            expires_at=expires_at
        )