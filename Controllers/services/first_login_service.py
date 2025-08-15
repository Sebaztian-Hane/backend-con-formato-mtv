from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status

def verify_first_login(user):
    # Aquí iría tu lógica específica si es primer login
    token = Token.objects.create(user=user)
    return Response({
        'token': token.key,
        'message': 'Inicio de sesión exitoso.'
    }, status=status.HTTP_200_OK)


