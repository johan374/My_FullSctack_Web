from django.db import IntegrityError
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.throttling import AnonRateThrottle

class NewsletterRateThrottle(AnonRateThrottle):
    rate = '3/hour'

@api_view(['POST'])
@throttle_classes([NewsletterRateThrottle])
def newsletter_subscribe(request):
    serializer = NewsletterSerializer(data=request.data)
    if serializer.is_valid():
        try:
            serializer.save()
            return Response(
                {"message": "Successfully subscribed to newsletter"}, 
                status=status.HTTP_201_CREATED
            )
        except IntegrityError:
            return Response(
                {"error": "This email is already subscribed"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)