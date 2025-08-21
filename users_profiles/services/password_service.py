"""
Servicio para gestión de contraseñas de usuario
"""

from django.db import transaction
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from ..models.verification import UserVerificationCode

User = get_user_model()


class PasswordService:
    """Servicio para gestión de contraseñas de usuario"""
    
    @staticmethod
    def change_password(user, current_password, new_password):
        """
        Cambiar la contraseña de un usuario
        
        Args:
            user: Usuario al que se le cambiará la contraseña
            current_password: Contraseña actual
            new_password: Nueva contraseña
            
        Returns:
            bool: True si se cambió exitosamente
            
        Raises:
            ValidationError: Si la contraseña actual es incorrecta o la nueva es inválida
        """
        try:
            with transaction.atomic():
                # Verificar contraseña actual
                if not user.check_password(current_password):
                    raise ValidationError("La contraseña actual es incorrecta")
                
                # Validar nueva contraseña
                validate_password(new_password, user)
                
                # Cambiar contraseña
                user.set_password(new_password)
                user.save()
                
                return True
                
        except Exception as e:
            raise ValidationError(f"Error al cambiar la contraseña: {str(e)}")
    
    @staticmethod
    def reset_password_request(email):
        """
        Solicitar reset de contraseña
        
        Args:
            email: Email del usuario
            
        Returns:
            bool: True si se envió la solicitud exitosamente
            
        Raises:
            ValidationError: Si el email no existe
        """
        try:
            with transaction.atomic():
                # Verificar que el usuario existe
                user = User.objects.get(email=email)
                
                # Crear código de verificación para reset
                verification_code = UserVerificationCode.create_code(
                    user=user,
                    verification_type='password_change'
                )
                
                # Aquí se enviaría el email con el código
                # Por ahora solo retornamos True
                return True
                
        except User.DoesNotExist:
            raise ValidationError("No existe un usuario con ese email")
        except Exception as e:
            raise ValidationError(f"Error al solicitar reset de contraseña: {str(e)}")
    
    @staticmethod
    def reset_password_confirm(code, new_password):
        """
        Confirmar reset de contraseña con código
        
        Args:
            code: Código de verificación
            new_password: Nueva contraseña
            
        Returns:
            bool: True si se reseteó exitosamente
            
        Raises:
            ValidationError: Si el código es inválido o la contraseña es inválida
        """
        try:
            with transaction.atomic():
                # Verificar código
                verification, error = UserVerificationCode.verify_code(
                    code=code,
                    verification_type='password_change'
                )
                
                if not verification:
                    raise ValidationError(error)
                
                user = verification.user
                
                # Validar nueva contraseña
                validate_password(new_password, user)
                
                # Cambiar contraseña
                user.set_password(new_password)
                user.save()
                
                # Marcar código como usado
                verification.mark_as_used()
                
                return True
                
        except Exception as e:
            raise ValidationError(f"Error al confirmar reset de contraseña: {str(e)}")
    
    @staticmethod
    def validate_password_strength(password):
        """
        Validar la fortaleza de una contraseña
        
        Args:
            password: Contraseña a validar
            
        Returns:
            dict: Información sobre la fortaleza de la contraseña
        """
        try:
            validate_password(password)
            return {
                'is_valid': True,
                'strength': 'strong',
                'message': 'Contraseña válida'
            }
        except ValidationError as e:
            return {
                'is_valid': False,
                'strength': 'weak',
                'message': str(e)
            }
    
    @staticmethod
    def check_password_history(user, new_password):
        """
        Verificar que la nueva contraseña no esté en el historial
        
        Args:
            user: Usuario
            new_password: Nueva contraseña
            
        Returns:
            bool: True si la contraseña no está en el historial
        """
        # Por simplicidad, solo verificamos que no sea igual a la actual
        # En una implementación real, se verificaría contra un historial
        return not user.check_password(new_password)
    
    @staticmethod
    def force_password_change(user):
        """
        Forzar cambio de contraseña en el próximo login
        
        Args:
            user: Usuario al que forzar el cambio
            
        Returns:
            bool: True si se configuró exitosamente
        """
        try:
            # Marcar que debe cambiar contraseña en próximo login
            user.force_password_change = True
            user.save()
            return True
        except Exception as e:
            raise ValidationError(f"Error al forzar cambio de contraseña: {str(e)}")
    
    @staticmethod
    def is_first_login(user):
        """
        Verificar si es el primer login del usuario
        
        Args:
            user: Usuario a verificar
            
        Returns:
            bool: True si es el primer login
        """
        # Verificar si nunca ha cambiado la contraseña
        # Esto es una implementación simplificada
        return user.date_joined == user.last_login
    
    @staticmethod
    def get_password_policy():
        """
        Obtener la política de contraseñas
        
        Returns:
            dict: Política de contraseñas
        """
        return {
            'min_length': 8,
            'require_uppercase': True,
            'require_lowercase': True,
            'require_numbers': True,
            'require_special_chars': True,
            'max_age_days': 90,
            'history_count': 5
        }
    
    @staticmethod
    def check_password_expiration(user):
        """
        Verificar si la contraseña ha expirado
        
        Args:
            user: Usuario a verificar
            
        Returns:
            dict: Información sobre la expiración
        """
        # Implementación simplificada
        # En una implementación real, se verificaría la fecha de último cambio
        return {
            'is_expired': False,
            'days_until_expiration': 90,
            'last_changed': user.date_joined
        }
