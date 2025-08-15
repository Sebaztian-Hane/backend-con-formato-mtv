import os
import django
from datetime import timedelta
from django.utils import timezone

# Cargar configuración de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

# Importar modelos y servicios
from django.contrib.auth import get_user_model
from Models.UserVerificationCode import UserVerificationCode
from Services.email_service import send_verification_email

# Obtener el modelo User
User = get_user_model()

# Buscar o crear el usuario
email = 'juniorgiancarlo2743@gmail.com'
user, created = User.objects.get_or_create(
    email=email,
    defaults={'username': 'junior_test_user', 'password': 'testpassword123'}
)

if created:
    print(f'Usuario creado: {user.username}')
else:
    print(f'Usuario ya existía: {user.username}')

# Crear código de verificación
code = '123456'
UserVerificationCode.objects.create(
    user=user,
    code=code,
    expires_at=timezone.now() + timedelta(minutes=10)
)

# Enviar correo
send_verification_email(user.email, code)

print(f'✅ Correo enviado a {user.email} con código {code}')
