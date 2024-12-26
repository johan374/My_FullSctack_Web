from django.urls import path
from . import views

urlpatterns = [
    # ... your other URLs ...
    path('api/newsletter/subscribe', views.newsletter_subscribe, name='newsletter_subscribe'),
]