from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from ..models import UserVerificationCode
from ..serializers.verification import (
    VerificationCodeSerializer, EmailChangeSerializer,
    EmailChangeConfirmSerializer, VerificationCodeRequestSerializer,
    VerificationCodeResendSerializer, VerificationStatusSerializer
)

User = get_user_model()


class VerificationCodeView(APIView):
    """Vista para solicitar códigos de verificación"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Solicita un código de verificación"""
        serializer = VerificationCodeRequestSerializer(data=request.data)
        
        if serializer.is_valid():
            verification_type = serializer.validated_data['verification_type']
            target_email = serializer.validated_data.get('target_email')
            
            # Crear código de verificación
            verification_code = UserVerificationCode.create_code(
                user=request.user,
                verification_type=verification_type,
                target_email=target_email
            )
            
            # Aquí se enviaría el email con el código
            # Por ahora solo retornamos el código en la respuesta
            
            return Response({
                'message': 'Código de verificación enviado exitosamente',
                'code': verification_code.code,  # Solo en desarrollo
                'expires_at': verification_code.expires_at,
                'verification_type': verification_type
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmailChangeView(APIView):
    """Vista para solicitar cambio de email"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Solicita cambio de email"""
        serializer = EmailChangeSerializer(data=request.data)
        
        if serializer.is_valid():
            new_email = serializer.validated_data['new_email']
            
            # Crear código de verificación para cambio de email
            verification_code = UserVerificationCode.create_code(
                user=request.user,
                verification_type='email_change',
                target_email=new_email
            )
            
            # Aquí se enviaría el email con el código
            # Por ahora solo retornamos el código en la respuesta
            
            return Response({
                'message': 'Se ha enviado un código de verificación a tu nuevo email',
                'code': verification_code.code,  # Solo en desarrollo
                'expires_at': verification_code.expires_at,
                'target_email': new_email
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmailChangeConfirmView(APIView):
    """Vista para confirmar cambio de email"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Confirma el cambio de email"""
        serializer = EmailChangeConfirmSerializer(data=request.data)
        
        if serializer.is_valid():
            code = serializer.validated_data['code']
            
            # Buscar el código de verificación
            try:
                verification = UserVerificationCode.objects.get(
                    user=request.user,
                    code=code,
                    verification_type='email_change',
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
                
                # Cambiar el email
                new_email = verification.target_email
                request.user.email = new_email
                request.user.email_verified = True
                request.user.save()
                
                # Marcar el código como usado
                verification.mark_as_used()
                
                return Response({
                    'message': 'Email cambiado exitosamente',
                    'new_email': new_email
                }, status=status.HTTP_200_OK)
                
            except UserVerificationCode.DoesNotExist:
                return Response({
                    'error': 'Código de verificación inválido'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerificationCodeResendView(APIView):
    """Vista para reenviar códigos de verificación"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Reenvía un código de verificación"""
        serializer = VerificationCodeResendSerializer(data=request.data)
        
        if serializer.is_valid():
            verification_type = serializer.validated_data['verification_type']
            target_email = serializer.validated_data.get('target_email')
            
            # Invalidar códigos anteriores
            UserVerificationCode.objects.filter(
                user=request.user,
                verification_type=verification_type,
                is_used=False
            ).update(is_used=True)
            
            # Crear nuevo código
            verification_code = UserVerificationCode.create_code(
                user=request.user,
                verification_type=verification_type,
                target_email=target_email
            )
            
            # Aquí se enviaría el email con el código
            # Por ahora solo retornamos el código en la respuesta
            
            return Response({
                'message': 'Nuevo código de verificación enviado exitosamente',
                'code': verification_code.code,  # Solo en desarrollo
                'expires_at': verification_code.expires_at
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerificationStatusView(APIView):
    """Vista para obtener el estado de verificación"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Retorna el estado de verificación del usuario"""
        user = request.user
        
        # Obtener códigos de verificación activos
        active_codes = UserVerificationCode.objects.filter(
            user=user,
            is_used=False
        ).order_by('-created_at')
        
        verification_status = []
        
        for code in active_codes:
            status_data = {
                'verification_type': code.verification_type,
                'expires_at': code.expires_at,
                'attempts_remaining': code.max_attempts - code.attempts,
                'is_valid': code.is_valid()
            }
            verification_status.append(status_data)
        
        return Response({
            'user_email': user.email,
            'email_verified': user.email_verified,
            'active_verifications': verification_status
        })


class EmailVerificationView(APIView):
    """Vista para verificar email de registro"""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """Solicita verificación de email"""
        serializer = VerificationCodeRequestSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data.get('target_email')
            
            if not email:
                return Response({
                    'error': 'El email es requerido'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                user = User.objects.get(email=email)
                
                if user.email_verified:
                    return Response({
                        'error': 'Este email ya está verificado'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                # Crear código de verificación
                verification_code = UserVerificationCode.create_code(
                    user=user,
                    verification_type='email_verification'
                )
                
                # Aquí se enviaría el email con el código
                # Por ahora solo retornamos el código en la respuesta
                
                return Response({
                    'message': 'Código de verificación enviado exitosamente',
                    'code': verification_code.code,  # Solo en desarrollo
                    'expires_at': verification_code.expires_at
                }, status=status.HTTP_200_OK)
                
            except User.DoesNotExist:
                return Response({
                    'error': 'No existe una cuenta con este email'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmailVerificationConfirmView(APIView):
    """Vista para confirmar verificación de email"""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """Confirma la verificación de email"""
        serializer = EmailChangeConfirmSerializer(data=request.data)
        
        if serializer.is_valid():
            code = serializer.validated_data['code']
            
            # Buscar el código de verificación
            try:
                verification = UserVerificationCode.objects.get(
                    code=code,
                    verification_type='email_verification',
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
                
                # Marcar email como verificado
                user = verification.user
                user.email_verified = True
                user.save()
                
                # Marcar el código como usado
                verification.mark_as_used()
                
                return Response({
                    'message': 'Email verificado exitosamente'
                }, status=status.HTTP_200_OK)
                
            except UserVerificationCode.DoesNotExist:
                return Response({
                    'error': 'Código de verificación inválido'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
