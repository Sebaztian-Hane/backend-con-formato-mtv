from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.contrib.auth.models import update_last_login
from ..serializers.password import (
    PasswordChangeSerializer, PasswordResetSerializer,
    PasswordResetConfirmSerializer, PasswordStrengthSerializer
)
from ..models import UserVerificationCode

User = get_user_model()


class PasswordChangeView(APIView):
    """Vista para cambiar la contraseña del usuario autenticado"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Cambia la contraseña del usuario"""
        serializer = PasswordChangeSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            user = serializer.save()
            update_last_login(None, user)
            
            return Response({
                'message': 'Contraseña cambiada exitosamente'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetView(APIView):
    """Vista para solicitar restablecimiento de contraseña"""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """Solicita el restablecimiento de contraseña"""
        serializer = PasswordResetSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            try:
                user = User.objects.get(email=email)
                
                # Crear código de verificación
                verification_code = UserVerificationCode.create_code(
                    user=user,
                    verification_type='password_change'
                )
                
                # Aquí se enviaría el email con el código
                # Por ahora solo retornamos el código en la respuesta
                
                return Response({
                    'message': 'Se ha enviado un código de verificación a tu email',
                    'code': verification_code.code,  # Solo en desarrollo
                    'expires_at': verification_code.expires_at
                }, status=status.HTTP_200_OK)
                
            except User.DoesNotExist:
                # Por seguridad, no revelamos si el email existe o no
                return Response({
                    'message': 'Si el email existe, se ha enviado un código de verificación'
                }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmView(APIView):
    """Vista para confirmar el restablecimiento de contraseña"""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """Confirma el restablecimiento de contraseña"""
        serializer = PasswordResetConfirmSerializer(data=request.data)
        
        if serializer.is_valid():
            code = serializer.validated_data['code']
            new_password = serializer.validated_data['new_password']
            
            # Buscar el código de verificación
            try:
                verification = UserVerificationCode.objects.get(
                    code=code,
                    verification_type='password_change',
                    is_used=False
                )
                
                if verification.is_expired():
                    return Response({
                        'error': 'El código de verificación ha expirado'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                if not verification.can_attempt():
                    return Response({
                        'error': 'Demasiados intentos fallidos'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                # Cambiar la contraseña
                user = verification.user
                user.set_password(new_password)
                user.save()
                
                # Marcar el código como usado
                verification.mark_as_used()
                
                # Actualizar última fecha de login
                update_last_login(None, user)
                
                return Response({
                    'message': 'Contraseña restablecida exitosamente'
                }, status=status.HTTP_200_OK)
                
            except UserVerificationCode.DoesNotExist:
                return Response({
                    'error': 'Código de verificación inválido'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordStrengthView(APIView):
    """Vista para validar la fortaleza de una contraseña"""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """Valida la fortaleza de una contraseña"""
        serializer = PasswordStrengthSerializer(data=request.data)
        
        if serializer.is_valid():
            password = serializer.validated_data['password']
            
            # La validación ya se hizo en el serializer
            return Response({
                'message': 'La contraseña cumple con los requisitos de seguridad',
                'is_strong': True
            }, status=status.HTTP_200_OK)
        
        return Response({
            'message': 'La contraseña no cumple con los requisitos de seguridad',
            'is_strong': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class PasswordHistoryView(APIView):
    """Vista para obtener el historial de cambios de contraseña"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Retorna el historial de cambios de contraseña"""
        # Por simplicidad, retornamos información básica
        # En una implementación real, se podría tener un modelo para esto
        
        return Response({
            'message': 'Historial de cambios de contraseña',
            'last_changed': request.user.last_login,
            'total_changes': 1  # Placeholder
        })


class PasswordPolicyView(APIView):
    """Vista para obtener la política de contraseñas"""
    
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        """Retorna la política de contraseñas"""
        return Response({
            'message': 'Política de contraseñas',
            'requirements': [
                'Mínimo 8 caracteres',
                'Al menos una letra mayúscula',
                'Al menos una letra minúscula',
                'Al menos un número',
                'Al menos un carácter especial',
                'No puede ser similar a información personal',
                'No puede ser una contraseña común'
            ]
        })
