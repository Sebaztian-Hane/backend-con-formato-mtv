# Controllers/web_views.py
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import get_user_model
from Services.verification_service import VerificationService

User = get_user_model()

def email_verify_page(request):
    """
    Página simple para enviar y verificar códigos por email (modo demo).
    POST params:
      - action = 'send' -> email
      - action = 'verify' -> email + code
    """
    if request.method == 'POST':
        action = request.POST.get('action')
        email = request.POST.get('email', '').strip().lower()
        if not email:
            messages.error(request, 'Ingresa un correo.')
            return redirect('email-verify')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            messages.error(request, 'Usuario con ese correo no encontrado.')
            return redirect('email-verify')

        if action == 'send':
            resp, status = VerificationService.send_code(user)
            if resp.get('success'):
                messages.success(request, resp.get('message', 'Código enviado.'))
            else:
                messages.error(request, resp.get('message', 'Error al enviar código.'))
            return redirect('email-verify')

        if action == 'verify':
            code = request.POST.get('code', '').strip()
            resp, status = VerificationService.verify_code(user, code)
            if resp.get('success'):
                messages.success(request, resp.get('message', 'Código válido.'))
            else:
                messages.error(request, resp.get('message', 'Código inválido.'))
            return redirect('email-verify')

    return render(request, 'email_verify.html')
