from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.urls import reverse


def send_welcome_email(user):
    """
    Envía email de bienvenida al usuario registrado
    """
    subject = '¡Bienvenido a Django Entorno!'
    
    # Crear contenido HTML
    html_message = render_to_string('authentication/emails/welcome.html', {
        'user': user,
        'site_name': 'Django Entorno'
    })
    
    # Crear contenido de texto plano
    plain_message = strip_tags(html_message)
    
    # Enviar email
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )


def send_password_reset_email(user, request):
    """
    Envía email para restablecer contraseña
    """
    # Generar token
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    
    # Crear URL de reset
    reset_url = request.build_absolute_uri(
        reverse('authentication:password_reset_confirm', kwargs={'uidb64': uid, 'token': token})
    )
    
    subject = 'Restablecer contraseña - Django Entorno'
    
    # Crear contenido HTML
    html_message = render_to_string('authentication/emails/password_reset.html', {
        'user': user,
        'reset_url': reset_url,
        'site_name': 'Django Entorno'
    })
    
    # Crear contenido de texto plano
    plain_message = strip_tags(html_message)
    
    # Enviar email
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )


def send_email_verification(user, request):
    """
    Envía email de verificación de cuenta
    """
    # Generar token de verificación
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    
    # Crear URL de verificación
    verify_url = request.build_absolute_uri(
        reverse('authentication:email_verify', kwargs={'uidb64': uid, 'token': token})
    )
    
    subject = 'Verificar tu cuenta - Django Entorno'
    
    # Crear contenido HTML
    html_message = render_to_string('authentication/emails/email_verification.html', {
        'user': user,
        'verify_url': verify_url,
        'site_name': 'Django Entorno'
    })
    
    # Crear contenido de texto plano
    plain_message = strip_tags(html_message)
    
    # Enviar email
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )


def send_notification_email(user, subject, template_name, context=None):
    """
    Envía email de notificación genérico
    """
    if context is None:
        context = {}
    
    context['user'] = user
    context['site_name'] = 'Django Entorno'
    
    # Crear contenido HTML
    html_message = render_to_string(f'authentication/emails/{template_name}.html', context)
    
    # Crear contenido de texto plano
    plain_message = strip_tags(html_message)
    
    # Enviar email
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    ) 