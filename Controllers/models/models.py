from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import get_user_model

User = get_user_model()

class UserVerificationToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def is_expired(self):
        # El token expira después de 10 minutos
        return self.created_at < timezone.now() - timedelta(minutes=10)

    def __str__(self):
        return f"{self.user.email} - {self.code}"
