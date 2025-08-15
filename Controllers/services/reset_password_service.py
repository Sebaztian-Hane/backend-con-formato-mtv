from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import status

User = get_user_model()

def verify_email(email):
    if User.objects.filter(email=email).exists():
        return Response({
            'message': 'El email existe en la base de datos.',
            'status': True
        }, status=status.HTTP_200_OK)

    return Response({
        'message': 'El email no existe.',
        'status': False
    }, status=status.HTTP_404_NOT_FOUND)
