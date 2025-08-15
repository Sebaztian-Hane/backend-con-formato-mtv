from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import status
import logging
from django.utils import timezone

logger = logging.getLogger(__name__)
User = get_user_model()

class FirstLoginService:
    def verify_first_login(self, user):
        try:
            if user.last_session:
                from rest_framework.authtoken.models import Token
                token, _ = Token.objects.get_or_create(user=user)
                
                return {
                    'first_login': False,
                    'message': 'Login exitoso',
                    'token': token.key,
                    'role': user.groups.first().name if user.groups.exists() else None
                }

            # Primer login
            return {
                'first_login': True,
                'user_id': user.id,
                'message': 'Se enviará un código de verificación'
            }

        except Exception as e:
            logger.error(f'Error en FirstLoginService: {str(e)}')
            return {
                'error': True,
                'message': 'Error interno en la verificación de inicio de sesión',
                'exception': str(e)
            }