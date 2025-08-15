from django.contrib.auth.models import AbstractUser
from django.db import models
from guardian.shortcuts import assign_perm, remove_perm, get_perms


class User(AbstractUser):
    """
    Modelo de usuario personalizado que extiende AbstractUser
    """
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
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
