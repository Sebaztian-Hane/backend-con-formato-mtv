from django.db import models
from django.utils import timezone

class EmailVerificationCode(models.Model):
    email = models.EmailField()
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def is_expired(self):
        expiration_minutes = 10
        return timezone.now() > self.created_at + timezone.timedelta(minutes=expiration_minutes)

    def __str__(self):
        return f"{self.email} - {self.code}"
