from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

class ResetPasswordServices:
    def verify_email(self, email):
        try:
            user = User.objects.filter(email=email).first()

            if not user:
                return {
                    'status': False,
                    'message': 'No se encontró un usuario con ese correo.'
                }

            return {
                'user_id': user.id,
                'status': True,
                'message': 'Correo verificado correctamente.'
            }

        except Exception as e:
            logger.error(f'Error en ResetPasswordServices: {str(e)}')
            return {
                'status': False,
                'message': 'Error interno al verificar el correo',
                'exception': str(e)
            }