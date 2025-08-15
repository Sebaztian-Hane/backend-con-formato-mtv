from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers_email import SendVerifyCodeSerializer
from .services_email import EmailService
from django.contrib.auth import get_user_model

User = get_user_model()

class SendVerifyCodeView(APIView):
    def post(self, request):
        serializer = SendVerifyCodeSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            # Validar si el email ya está registrado (opcional)
            if User.objects.filter(email=email).exists():
                return Response({'detail': 'El email ya está registrado.'}, status=status.HTTP_400_BAD_REQUEST)
            # Cooldown
            if not EmailService.can_send_code(email):
                return Response({'detail': 'Espera antes de solicitar otro código.'}, status=status.HTTP_429_TOO_MANY_REQUESTS)
            EmailService.send_verification_code(email)
            return Response({'detail': 'Código enviado.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
