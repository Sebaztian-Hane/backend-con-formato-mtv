# Views/home.py
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Models.UserVerificationCode import UserVerificationCode
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.conf import settings
import json
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import get_user_model

User = get_user_model()

def home(request):
    return render(request, "home.html")

def _get_request_data(request):
    """
    Lee datos de POST form o JSON.
    """
    if request.content_type and "application/json" in request.content_type:
        try:
            return json.loads(request.body.decode("utf-8") or "{}")
        except Exception:
            return {}
    return request.POST

@csrf_exempt
def send_verify_email(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Método no permitido"}, status=405)

    data = _get_request_data(request)
    email = data.get("email")

    if not email:
        return JsonResponse({"success": False, "message": "Email es requerido"}, status=400)

    # Si usas User vinculado, opcionalmente buscar user:
    try:
        user = User.objects.filter(email=email).first()
    except Exception:
        user = None

    # Generar código de 6 dígitos
    code = get_random_string(length=6, allowed_chars="0123456789")
    expiration = timezone.now() + timedelta(minutes=10)

    # Si tienes el modelo vinculado a user, usa user; en tu modelo actual puedes adaptarlo.
    # Aquí asumimos que UserVerificationCode tiene campo user (FK). Si no, adapta.
    if user:
        UserVerificationCode.objects.create(user=user, code=code, expires_at=expiration, failed_attempts=0)
    else:
        # Si no hay user, puedes crear con user=None o manejar de otra forma.
        # Como tu modelo exige FK, lo correcto es forzar existencia de usuario.
        return JsonResponse({"success": False, "message": "Usuario no encontrado"}, status=404)

    # Enviar correo
    try:
        send_mail(
            subject="Código de verificación",
            message=f"Tu código de verificación es: {code}",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False,
        )
    except Exception as e:
        return JsonResponse({"success": False, "message": "Error al enviar correo", "error": str(e)}, status=500)

    return JsonResponse({"success": True, "message": "Código enviado correctamente."}, status=200)


@csrf_exempt
def verify_email(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Método no permitido"}, status=405)

    data = _get_request_data(request)
    email = data.get("email")
    code = data.get("code")

    if not email or not code:
        return JsonResponse({"success": False, "message": "Email y código son requeridos"}, status=400)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({"success": False, "message": "Usuario no encontrado"}, status=404)

    try:
        ver = UserVerificationCode.objects.filter(user=user, code=code).order_by("-created_at").first()
        if not ver:
            return JsonResponse({"success": False, "message": "Código inválido o no encontrado"}, status=400)

        if ver.locked_until and timezone.now() < ver.locked_until:
            return JsonResponse({"success": False, "message": "Demasiados intentos. Intenta más tarde."}, status=403)

        if ver.is_expired():
            return JsonResponse({"success": False, "message": "El código ha expirado."}, status=400)

        # Si llegó aquí, éxito: marca user como verificado y borra códigos
        UserVerificationCode.objects.filter(user=user).delete()
        user.is_verified = True
        user.save()

        return JsonResponse({"success": True, "message": "Código verificado correctamente."}, status=200)

    except Exception as e:
        return JsonResponse({"success": False, "message": "Error interno", "error": str(e)}, status=500)
