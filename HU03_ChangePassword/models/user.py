from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    password_change = models.BooleanField(default=False)
    last_session = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        permissions = [
            ("change_password", "Can change password"),
        ]