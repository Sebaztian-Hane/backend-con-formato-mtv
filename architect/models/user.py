from django.contrib.auth.models import AbstractUser
from django.db import models
from guardian.shortcuts import assign_perm, remove_perm, get_perms
from .base import BaseModel


class User(AbstractUser, BaseModel):
    """
    Modelo de usuario personalizado que extiende AbstractUser
    """
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    ROL_CHOICES = (
        ('Admin', 'Admin'),
        ('User', 'User'),
    )
    rol = models.CharField(max_length=10, choices=ROL_CHOICES, default='User')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

    def assign_permission(self, permission, obj):
        """
        Asigna un permiso a este usuario para un objeto específico
        """
        return assign_perm(permission, self, obj)

    def remove_permission(self, permission, obj):
        """
        Remueve un permiso de este usuario para un objeto específico
        """
        return remove_perm(permission, self, obj)

    def get_object_permissions(self, obj):
        """
        Obtiene todos los permisos de este usuario para un objeto específico
        """
        return get_perms(self, obj)

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'


class UserVerificationCode(BaseModel):
    """
    Modelo para códigos de verificación de usuario
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"Code for {self.user.email}"

    class Meta:
        verbose_name = 'Código de Verificación'
        verbose_name_plural = 'Códigos de Verificación' 