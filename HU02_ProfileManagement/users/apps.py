# HU02_ProfileManagement/users/apps.py

from django.apps import AppConfig

class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'HU02_ProfileManagement.users'
    label = 'users'  # ✅ ESTA LÍNEA es esencial
