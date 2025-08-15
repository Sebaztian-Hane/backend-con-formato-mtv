# Services/verification_service.py

import logging
import random
from datetime import timedelta
from django.db import transaction
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.mail import EmailMessage
from django.conf import settings
from rest_framework.authtoken.models import Token

from Models.UserVerificationCode import UserVerificationCode

User = get_user_model()
logger = logging.getLogger(__name__)

class VerificationService:
    @staticmethod
    def send_code(user: User) -> tuple[dict, int]:
        """
        Genera y envía un código de verificación al correo del usuario:
        1) Crea un código aleatorio de 6 dígitos con expiración.
        2) Lo guarda en la base de datos.
        3) Envía el correo usando el backend configurado.
        """
        try:
            code = ''.join(random.choices('0123456789', k=6))
            expiration = timezone.now() + timedelta(minutes=10)

            UserVerificationCode.objects.create(
                user=user,
                code=code,
                expires_at=expiration,
                failed_attempts=0
            )

            subject = "Código de verificación"
            message = f"Tu código de verificación es: {code}"

            email = EmailMessage(
                subject=subject,
                body=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[user.email]
            )
            email.content_subtype = "plain"
            email.encoding = "utf-8"
            email.send(fail_silently=False)

            return {'success': True, 'message': 'Código enviado al correo.'}, 200

        except Exception as e:
            logger.error(
                'Error al enviar código de verificación',
                exc_info=e,
                extra={'user_id': user.id}
            )
            return {
                'success': False,
                'message': 'Error interno al enviar el código.',
                'error': str(e)
            }, 500

    @staticmethod
    def verify_code(user: User, code: str) -> tuple[dict, int]:
        """
        Orquesta la verificación de un código de usuario:
        1) Obtiene el último código válido (SELECT FOR UPDATE).
        2) Lo valida (coincidencia, expiración, bloqueo).
        3) En caso de éxito, maneja la verificación exitosa y genera/reutiliza token.
        """
        latest_code = (
            UserVerificationCode.objects
            .select_for_update()
            .filter(user=user)
            .order_by('-created_at')
            .first()
        )

        verif = VerificationService._validation_verify(latest_code, user, code)
        if verif.get('success', False):
            return VerificationService._handle_successful_verification(user, latest_code)
        return verif, 400

    @staticmethod
    def _validation_verify(
        code_obj: UserVerificationCode | None,
        user: User,
        code: str
    ) -> dict:
        if not code_obj:
            VerificationService._increment_failed_attempts(user)
            return {'success': False, 'message': 'No se encontró un código válido para este usuario.'}

        if code_obj.code != code:
            VerificationService._increment_failed_attempts(user)
            return {'success': False, 'message': 'El código ingresado no coincide.'}

        if code_obj.locked_until and timezone.now() < code_obj.locked_until:
            return {
                'success': False,
                'message': 'Demasiados intentos fallidos. Intenta nuevamente en 10 minutos.'
            }

        if code_obj.is_expired():
            code_obj.delete()
            VerificationService._increment_failed_attempts(user)
            return {'success': False, 'message': 'El código ha expirado.'}

        return {'success': True, 'message': 'Código validado.'}

    @staticmethod
    def _handle_successful_verification(
        user: User,
        code_obj: UserVerificationCode
    ) -> tuple[dict, int]:
        try:
            with transaction.atomic():
                UserVerificationCode.objects.filter(user=user).delete()
                user.is_verified = True
                user.save()

                token_obj, created = Token.objects.get_or_create(user=user)
                token = token_obj.key

                roles = getattr(user, 'roles', None)
                role_id = None
                if roles and roles.exists():
                    role_id = roles.first().id

            return ({
                'success': True,
                'message': 'Código válido.',
                'token': token,
                'role': role_id,
            }, 200)
        except Exception as e:
            logger.error(
                'Error al verificar código',
                exc_info=e,
                extra={'user_id': user.id}
            )
            return ({
                'success': False,
                'message': 'Error interno al procesar el código.',
                'error': str(e)
            }, 500)

    @staticmethod
    def _increment_failed_attempts(user: User) -> None:
        """
        Incrementa el contador en el último UserVerificationCode
        y bloquea si supera 3 intentos.
        """
        code_obj = (
            UserVerificationCode.objects
            .filter(user=user)
            .order_by('-created_at')
            .first()
        )
        if not code_obj:
            return

        code_obj.failed_attempts = (code_obj.failed_attempts or 0) + 1
        if code_obj.failed_attempts >= 3:
            code_obj.locked_until = timezone.now() + timedelta(minutes=10)
        code_obj.save()
