from django.db import models
from django.conf import settings
from django.contrib.auth.models import Permission as DjangoPermission

# Create your models here.

class UserRole(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name="Usuario")
    role = models.ForeignKey('roles.Role', on_delete=models.CASCADE, verbose_name="Rol")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Fecha de Actualización")
    
    class Meta:
        verbose_name = "Rol de Usuario"
        verbose_name_plural = "Roles de Usuario"
        unique_together = ['user', 'role']
    
    def __str__(self):
        return f"{self.user.username} - {self.role.name}"

class RolePermission(models.Model):
    role = models.ForeignKey('roles.Role', on_delete=models.CASCADE, verbose_name="Rol")
    permission = models.ForeignKey('permissions.Permission', on_delete=models.CASCADE, verbose_name="Permiso")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Creación")
    
    class Meta:
        verbose_name = "Permiso de Rol"
        verbose_name_plural = "Permisos de Rol"
        unique_together = ['role', 'permission']
    
    def __str__(self):
        return f"{self.role.name} - {self.permission.name}"
