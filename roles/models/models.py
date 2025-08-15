from django.db import models
from django.contrib.auth.models import AbstractUser

class RoleEnum(models.TextChoices):
    ADMIN = 'Admin', 'Admin'
    MEMBER = 'Member', 'Member'

class Role(models.Model):
    name = models.CharField(
        max_length=50,
        choices=RoleEnum.choices,
        default=RoleEnum.MEMBER,
        verbose_name="Nombre del Rol"
    )
    description = models.TextField(blank=True, null=True, verbose_name="Descripción")
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Fecha de Actualización")
    
    class Meta:
        verbose_name = "Rol"
        verbose_name_plural = "Roles"
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    @classmethod
    def get_admin_role(cls):
        return cls.objects.get_or_create(name=RoleEnum.ADMIN)[0]
    
    @classmethod
    def get_member_role(cls):
        return cls.objects.get_or_create(name=RoleEnum.MEMBER)[0]
