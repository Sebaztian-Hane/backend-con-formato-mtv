# Configuración de Email para Django
# Copia este archivo y renómbralo como email_settings.py
# Luego actualiza las credenciales

EMAIL_CONFIG = {
    # Para Gmail
    'EMAIL_BACKEND': 'django.core.mail.backends.smtp.EmailBackend',
    'EMAIL_HOST': 'smtp.gmail.com',
    'EMAIL_PORT': 587,
    'EMAIL_USE_TLS': True,
    'EMAIL_HOST_USER': 'tu-email@gmail.com',  # Cambiar por tu email
    'EMAIL_HOST_PASSWORD': 'tu-password-de-aplicacion',  # Cambiar por tu contraseña de aplicación
    
    # Para desarrollo (consola)
    # 'EMAIL_BACKEND': 'django.core.mail.backends.console.EmailBackend',
    
    'DEFAULT_FROM_EMAIL': 'Django Entorno <tu-email@gmail.com>'
}

# Instrucciones para configurar Gmail:
# 1. Ve a tu cuenta de Google
# 2. Activa la verificación en dos pasos
# 3. Ve a "Contraseñas de aplicación"
# 4. Genera una nueva contraseña para "Django"
# 5. Usa esa contraseña en EMAIL_HOST_PASSWORD

# Para Outlook/Hotmail:
# EMAIL_HOST = 'smtp-mail.outlook.com'
# EMAIL_PORT = 587

# Para Yahoo:
# EMAIL_HOST = 'smtp.mail.yahoo.com'
# EMAIL_PORT = 587 