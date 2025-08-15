from django.db import transaction
from django.contrib.auth.hashers import make_password
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

class ChangePasswordService:
    """
    Servicio para manejar el cambio de contraseña.
    Equivalente a ChangePasswordService.php en Laravel.
    """
    
    def change_password(self, user, new_password):
        """
        Actualiza la contraseña del usuario y marca como cambiada.
        
        Args:
            user: Instancia del modelo User de Django
            new_password: Nueva contraseña en texto plano
            
        Returns:
            dict: Diccionario con el resultado de la operación
        """
        try:
            with transaction.atomic():  # Equivalente a DB::beginTransaction()
                user.password = make_password(new_password)
                user.password_change = True  # Necesitarás este campo en tu modelo User
                user.last_session = timezone.now()
                user.save()
                
                return {
                    'password_change': True,
                    'message': "Contraseña cambiada correctamente"
                }
                
        except Exception as e:
            logger.error('Error al cambiar contraseña', extra={
                'user_id': user.id,
                'password_change': False,
                'error': str(e),
            })
            
            return {
                'status': False,
                'password_change': False,
                'message': 'Error inesperado al cambiar la contraseña.',
                'exception': str(e)
            }