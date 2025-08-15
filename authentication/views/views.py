
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from serializers.serializers import LoginRequest, RegisteredUserRequest, UserSerializer
from models.models import User



# LoginView
class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = LoginRequest(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        user = authenticate(request, username=email, password=password)
        if user is not None:
            login(request, user)
            return Response({
                'message': 'Login exitoso',
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

# LogoutView
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        logout(request)
        return Response({'message': 'Logout exitoso'}, status=status.HTTP_200_OK)

# RegisterView
class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisteredUserRequest(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        login(request, user)
        return Response({
            'message': 'Usuario registrado exitosamente',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
def password_reset_request(request):
    """
    Vista para solicitar restablecimiento de contraseña
    """
    email = request.data.get('email')
    
    if not email:
        return Response({
            'error': 'El campo email es requerido'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
        
        # Enviar email de restablecimiento
        try:
            from utils.utils import send_password_reset_email
            send_password_reset_email(user, request)
            return Response({
                'message': 'Se ha enviado un email con las instrucciones para restablecer tu contraseña.'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': 'Error enviando el email. Intenta nuevamente.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    except User.DoesNotExist:
        # Por seguridad, no revelamos si el email existe o no
        return Response({
            'message': 'Si el email existe en nuestra base de datos, recibirás las instrucciones.'
        }, status=status.HTTP_200_OK)
