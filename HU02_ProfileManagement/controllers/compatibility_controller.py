from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from django.http import JsonResponse

User = get_user_model()

class CompatibilityController(APIView):
    """
    Controlador para manejar endpoints de compatibilidad con el frontend React
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, endpoint=None):
        """Maneja GET requests para endpoints de compatibilidad"""
        if endpoint == 'photo':
            # Redirigir a la vista de foto existente
            from .image_controller import ShowUserPhotoView
            return ShowUserPhotoView().get(request, user_id=request.user.id)
        
        # Para otros endpoints GET, redirigir al perfil
        from .profile_controller import ProfileView
        return ProfileView().get(request)

    def post(self, request, endpoint=None):
        """Maneja POST requests para endpoints de compatibilidad"""
        if endpoint == 'sendVerifyCode':
            # Endpoint dummy para verificación de email
            return Response({
                'message': 'Código de verificación enviado (simulado)',
                'success': True
            }, status=status.HTTP_200_OK)
        
        elif endpoint == 'verification':
            # Endpoint dummy para verificar código
            code = request.data.get('code', '')
            if code:
                return Response({
                    'valid': True,
                    'message': 'Código verificado correctamente (simulado)'
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'valid': False,
                    'message': 'Código inválido'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        elif endpoint == 'validate-password':
            # Endpoint dummy para validar contraseña
            password = request.data.get('password', '')
            if password:
                return Response({
                    'valid': True,
                    'message': 'Contraseña válida (simulado)'
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'valid': False,
                    'message': 'Contraseña inválida'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        elif endpoint == 'photo':
            # Redirigir a la vista de subir foto existente
            from .image_controller import UploadUserPhotoView
            return UploadUserPhotoView().put(request, user_id=request.user.id)
        
        else:
            return Response({
                'message': 'Endpoint no implementado'
            }, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, endpoint=None):
        """Maneja PUT requests para endpoints de compatibilidad"""
        if endpoint == 'change-password':
            # Endpoint dummy para cambiar contraseña
            return Response({
                'message': 'Contraseña cambiada correctamente (simulado)',
                'success': True
            }, status=status.HTTP_200_OK)
        
        elif endpoint == 'profile':
            # Redirigir a la vista de actualizar perfil existente
            from .profile_controller import ProfileView
            return ProfileView().put(request)
        
        else:
            return Response({
                'message': 'Endpoint no implementado'
            }, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, endpoint=None):
        """Maneja PATCH requests para endpoints de compatibilidad"""
        if endpoint == 'profile':
            # Redirigir a la vista de actualizar perfil existente
            from .profile_controller import ProfileView
            return ProfileView().put(request)  # Django usa PUT para updates
        
        else:
            return Response({
                'message': 'Endpoint no implementado'
            }, status=status.HTTP_404_NOT_FOUND)

