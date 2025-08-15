# HU05_UserSearchFilters/models/profile.py

from django.db import models
from django.conf import settings  # 👈 Usar settings para referirse al modelo de usuario actual

class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    documento = models.CharField(max_length=50, unique=True)
    rol = models.CharField(max_length=50)

    def __str__(self):
        return f'{self.user.username} - {self.rol}'
