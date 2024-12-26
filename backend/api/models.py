from django.db import models  # Import the Django models module to define model fields
from django.contrib.auth.models import User  # Import the User model to create a foreign key relationship
from django.conf import settings
# Create your models here.

class Note(models.Model):
    # A model class to represent a note.

    title = models.CharField(max_length=100)  # This field holds the title of the note, which is a string with a maximum length of 100 characters.
    content = models.TextField()  # This field holds the content of the note. It's a text field and doesn't have a fixed length.
    create_at = models.DateTimeField(auto_now_add=True)  # This field automatically stores the creation date and time of the note.
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")  # This field creates a relationship with the User model.
    # It represents the user who authored the note. If a user is deleted, all their notes will be deleted too (on_delete=models.CASCADE).
    # The 'related_name' option allows you to access the notes related to a user using 'user.notes'.

    def __str__(self):
        # This method defines the string representation of the model.
        # When you print an instance of this model, it will display the title of the note.
        return self.title
    
# Add this to api/models.py along with your existing Note model
class RememberMeToken(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        db_table = 'remember_me_tokens'
