from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings

class VerificationEmail:
    def __init__(self, user, code, subject='Verificación de cuenta', template='emails/verification.html'):
        self.user = user
        self.code = code
        self.subject = subject
        self.template = template

    def send(self):
        context = {
            'user': self.user,
            'code': self.code,
        }

        # Renderiza HTML
        html_content = render_to_string(self.template, context)
        # Renderiza texto plano opcional (puedes crear otro template)
        text_content = f'Hola {self.user.first_name}, tu código de verificación es: {self.code}'

        email = EmailMultiAlternatives(
            subject=self.subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[self.user.email],
        )
        email.attach_alternative(html_content, "text/html")
        email.send()
