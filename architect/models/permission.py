from django.db import models
from django.contrib.auth.models import Permission as DjangoPermission
from .base import BaseModel


class Permission(DjangoPermission, BaseModel):
    detail = models.TextField(blank=True, null=True, verbose_name="Detalle")
    
    class Meta:
        verbose_name = "Permiso"
        verbose_name_plural = "Permisos"
    
    def __str__(self):
        return self.name


class RoleEnum(models.TextChoices):
    ADMIN = 'Admin', 'Admin'
    MEMBER = 'Member', 'Member'


class Role(BaseModel):
    name = models.CharField(
        max_length=50,
        choices=RoleEnum.choices,
        default=RoleEnum.MEMBER,
        verbose_name="Nombre del Rol"
    )
    description = models.TextField(blank=True, null=True, verbose_name="Descripción")
    
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