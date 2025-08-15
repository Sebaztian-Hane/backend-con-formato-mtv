from django.db import models
from django.contrib.auth.models import Permission as DjangoPermission

class Permission(DjangoPermission):
    detail = models.TextField(blank=True, null=True, verbose_name="Detalle")
    
    class Meta:
        verbose_name = "Permiso"
        verbose_name_plural = "Permisos"
    
    def __str__(self):
        return self.name
