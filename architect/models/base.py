from django.db import models


class BaseModel(models.Model):
    """
    Modelo base abstracto con campos comunes
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        abstract = True 