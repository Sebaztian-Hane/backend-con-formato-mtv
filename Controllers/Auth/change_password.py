from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth.hashers import check_password

from Controllers.services.change_password_service import change_user_password


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        """
        Cambia la contraseña del usuario autenticado.
        """
        user = request.user
        new_password = request.data.get('password')

        if not new_password:
            return Response({'error': 'Se requiere la nueva contraseña.'}, status=status.HTTP_400_BAD_REQUEST)

        return change_user_password(user, new_password)


class ValidatePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Valida si la contraseña actual proporcionada es correcta.
        """
        user = request.user
        current_password = request.data.get('current_password')

        if check_password(current_password, user.password):
            return Response({
                'message': 'La contraseña actual es válida.',
                'status': True
            }, status=status.HTTP_200_OK)

        return Response({
            'message': 'La contraseña actual es incorrecta.',
            'status': False
        }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
