from django.http import JsonResponse
from django.views import View
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from Controllers.services.first_login_service import verify_first_login


class LoginView(APIView):
    """
    Verifica las credenciales del usuario y devuelve un token.
    Si es el primer inicio, delega al servicio verify_first_login.
    """
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(request, username=email, password=password)

        if user is None:
            return Response({'message': 'Credenciales inválidas.'}, status=status.HTTP_401_UNAUTHORIZED)

        # Elimina tokens antiguos
        Token.objects.filter(user=user).delete()

        # Usa el servicio para lógica adicional del primer inicio
        return verify_first_login(user)


class LogoutView(APIView):
    """
    Revoca el token del usuario autenticado.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({'message': 'Cerró sesión exitosamente.'}, status=status.HTTP_200_OK)
