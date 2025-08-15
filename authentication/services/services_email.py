from django.core.mail import send_mail
from django.conf import settings
import random
from models.models_email_verification import EmailVerificationCode
from django.utils import timezone

class EmailService:
    @staticmethod
    def generate_code():
        return str(random.randint(100000, 999999))

    @staticmethod
    def send_verification_code(email):
        code = EmailService.generate_code()
        EmailVerificationCode.objects.create(email=email, code=code)
        send_mail(
            'Código de verificación',
            f'Tu código de verificación es: {code}',
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        return code

    @staticmethod
    def can_send_code(email):
        cooldown_minutes = 5
        last_code = EmailVerificationCode.objects.filter(email=email).order_by('-created_at').first()
        if last_code and (timezone.now() - last_code.created_at).total_seconds() < cooldown_minutes * 60:
            return False
        return True
