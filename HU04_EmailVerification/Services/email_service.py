from django.core.mail import send_mail
from django.conf import settings

def send_verification_email(to_email: str, code: str):
    subject = 'Tu código de verificación'
    message = f'Tu código de verificación es: {code}'
    from_email = settings.DEFAULT_FROM_EMAIL

    send_mail(subject, message, from_email, [to_email])
