import os
import django
from django.utils import timezone
from datetime import timedelta

# Configura Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from Models.UserVerificationCode import UserVerificationCode

# Crea un usuario si no existe
user, _ = User.objects.get_or_create(username='testuser', defaults={'password': '12345'})

# Crea un código de verificación
code = UserVerificationCode.objects.create(
    user=user,
    code='ABC123',
    expires_at=timezone.now() + timedelta(days=1)
)

print(f'Código creado: {code.code}, Expira en: {code.expires_at}')
print('¿Expirado?:', code.is_expired())
