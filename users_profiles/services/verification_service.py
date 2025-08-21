"""
Servicio para verificación de email de usuario
"""

from django.db import transaction
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from ..models.verification import UserVerificationCode

User = get_user_model()


class VerificationService:
    """Servicio para verificación de email de usuario"""
    
    @staticmethod
    def send_verification_email(user, verification_type='email_verification'):
        """
        Enviar email de verificación
        
        Args:
            user: Usuario al que enviar el email
            verification_type: Tipo de verificación
            
        Returns:
            bool: True si se envió exitosamente
            
        Raises:
            ValidationError: Si hay error al enviar el email
        """
        try:
            with transaction.atomic():
                # Crear código de verificación
                verification_code = UserVerificationCode.create_code(
                    user=user,
                    verification_type=verification_type
                )
                
                # Preparar contenido del email
                subject, message, html_message = VerificationService._prepare_email_content(
                    user, verification_code, verification_type
                )
                
                # Enviar email
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    html_message=html_message,
                    fail_silently=False
                )
                
                return True
                
        except Exception as e:
            raise ValidationError(f"Error al enviar email de verificación: {str(e)}")
    
    @staticmethod
    def verify_email_code(code, verification_type='email_verification'):
        """
        Verificar código de email
        
        Args:
            code: Código de verificación
            verification_type: Tipo de verificación
            
        Returns:
            tuple: (bool, str) - (éxito, mensaje)
        """
        try:
            with transaction.atomic():
                # Verificar código
                verification, error = UserVerificationCode.verify_code(
                    code=code,
                    verification_type=verification_type
                )
                
                if not verification:
                    return False, error
                
                user = verification.user
                
                # Marcar email como verificado según el tipo
                if verification_type == 'email_verification':
                    user.is_email_verified = True
                    user.save()
                elif verification_type == 'email_change':
                    # Cambiar email si es cambio de email
                    new_email = verification.metadata.get('new_email')
                    if new_email:
                        user.email = new_email
                        user.is_email_verified = True
                        user.save()
                
                # Marcar código como usado
                verification.mark_as_used()
                
                return True, "Email verificado exitosamente"
                
        except Exception as e:
            return False, f"Error al verificar email: {str(e)}"
    
    @staticmethod
    def resend_verification_email(user, verification_type='email_verification'):
        """
        Reenviar email de verificación
        
        Args:
            user: Usuario al que reenviar el email
            verification_type: Tipo de verificación
            
        Returns:
            bool: True si se reenvió exitosamente
        """
        try:
            # Invalidar códigos anteriores del mismo tipo
            UserVerificationCode.objects.filter(
                user=user,
                verification_type=verification_type,
                is_used=False
            ).update(is_used=True)
            
            # Enviar nuevo email
            return VerificationService.send_verification_email(user, verification_type)
            
        except Exception as e:
            raise ValidationError(f"Error al reenviar email de verificación: {str(e)}")
    
    @staticmethod
    def request_email_change(user, new_email):
        """
        Solicitar cambio de email
        
        Args:
            user: Usuario que solicita el cambio
            new_email: Nuevo email
            
        Returns:
            bool: True si se envió la solicitud exitosamente
            
        Raises:
            ValidationError: Si el email ya está en uso o hay otros errores
        """
        try:
            with transaction.atomic():
                # Verificar que el nuevo email no esté en uso
                if User.objects.filter(email=new_email).exists():
                    raise ValidationError("El email ya está en uso")
                
                # Crear código de verificación con metadata
                verification_code = UserVerificationCode.create_code(
                    user=user,
                    verification_type='email_change',
                    metadata={'new_email': new_email}
                )
                
                # Preparar contenido del email
                subject, message, html_message = VerificationService._prepare_email_content(
                    user, verification_code, 'email_change', new_email
                )
                
                # Enviar email al nuevo email
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[new_email],
                    html_message=html_message,
                    fail_silently=False
                )
                
                return True
                
        except Exception as e:
            raise ValidationError(f"Error al solicitar cambio de email: {str(e)}")
    
    @staticmethod
    def _prepare_email_content(user, verification_code, verification_type, new_email=None):
        """
        Preparar contenido del email de verificación
        
        Args:
            user: Usuario
            verification_code: Código de verificación
            verification_type: Tipo de verificación
            new_email: Nuevo email (para cambio de email)
            
        Returns:
            tuple: (subject, message, html_message)
        """
        base_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        
        if verification_type == 'email_verification':
            subject = "Verifica tu email"
            verification_url = f"{base_url}/verify-email?code={verification_code.code}"
            message = f"""
            Hola {user.get_full_name() or user.username},
            
            Gracias por registrarte. Para verificar tu email, haz clic en el siguiente enlace:
            
            {verification_url}
            
            Este enlace expirará en 24 horas.
            
            Si no solicitaste esta verificación, puedes ignorar este email.
            """
            
            html_message = f"""
            <h2>Verifica tu email</h2>
            <p>Hola {user.get_full_name() or user.username},</p>
            <p>Gracias por registrarte. Para verificar tu email, haz clic en el siguiente enlace:</p>
            <p><a href="{verification_url}">Verificar Email</a></p>
            <p>Este enlace expirará en 24 horas.</p>
            <p>Si no solicitaste esta verificación, puedes ignorar este email.</p>
            """
            
        elif verification_type == 'email_change':
            subject = "Confirma cambio de email"
            verification_url = f"{base_url}/confirm-email-change?code={verification_code.code}"
            message = f"""
            Hola {user.get_full_name() or user.username},
            
            Has solicitado cambiar tu email a: {new_email}
            
            Para confirmar este cambio, haz clic en el siguiente enlace:
            
            {verification_url}
            
            Este enlace expirará en 24 horas.
            
            Si no solicitaste este cambio, puedes ignorar este email.
            """
            
            html_message = f"""
            <h2>Confirma cambio de email</h2>
            <p>Hola {user.get_full_name() or user.username},</p>
            <p>Has solicitado cambiar tu email a: <strong>{new_email}</strong></p>
            <p>Para confirmar este cambio, haz clic en el siguiente enlace:</p>
            <p><a href="{verification_url}">Confirmar Cambio</a></p>
            <p>Este enlace expirará en 24 horas.</p>
            <p>Si no solicitaste este cambio, puedes ignorar este email.</p>
            """
            
        elif verification_type == 'password_change':
            subject = "Recupera tu contraseña"
            verification_url = f"{base_url}/reset-password?code={verification_code.code}"
            message = f"""
            Hola {user.get_full_name() or user.username},
            
            Has solicitado recuperar tu contraseña.
            
            Para crear una nueva contraseña, haz clic en el siguiente enlace:
            
            {verification_url}
            
            Este enlace expirará en 1 hora.
            
            Si no solicitaste este cambio, puedes ignorar este email.
            """
            
            html_message = f"""
            <h2>Recupera tu contraseña</h2>
            <p>Hola {user.get_full_name() or user.username},</p>
            <p>Has solicitado recuperar tu contraseña.</p>
            <p>Para crear una nueva contraseña, haz clic en el siguiente enlace:</p>
            <p><a href="{verification_url}">Crear Nueva Contraseña</a></p>
            <p>Este enlace expirará en 1 hora.</p>
            <p>Si no solicitaste este cambio, puedes ignorar este email.</p>
            """
        
        else:
            raise ValidationError(f"Tipo de verificación no válido: {verification_type}")
        
        return subject, message, html_message
    
    @staticmethod
    def get_verification_status(user):
        """
        Obtener estado de verificación del usuario
        
        Args:
            user: Usuario a verificar
            
        Returns:
            dict: Estado de verificación
        """
        return {
            'is_email_verified': user.is_email_verified,
            'email': user.email,
            'has_pending_verifications': UserVerificationCode.objects.filter(
                user=user,
                is_used=False
            ).exists()
        }
    
    @staticmethod
    def cleanup_expired_codes():
        """
        Limpiar códigos de verificación expirados
        
        Returns:
            int: Número de códigos eliminados
        """
        from django.utils import timezone
        
        expired_codes = UserVerificationCode.objects.filter(
            expires_at__lt=timezone.now()
        )
        count = expired_codes.count()
        expired_codes.delete()
        
        return count
