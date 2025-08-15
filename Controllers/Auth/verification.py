from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from Controllers.services.verification_service import verify_code
from django.contrib.auth import get_user_model

User = get_user_model()

class VerifyCodeView(APIView):
    """
    Valida el código de verificación para el usuario autenticado.
    """

    def post(self, request):
        user = request.user

        if not user or not user.is_authenticated:
            return Response({'message': 'No se pudo determinar el usuario.'}, status=status.HTTP_400_BAD_REQUEST)

        code = request.data.get('code')

        if not code:
            return Response({'message': 'El código de verificación es requerido.'}, status=status.HTTP_400_BAD_REQUEST)

        return verify_code(user, code)
