from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator


class User(AbstractUser):
    """
    Modelo de usuario personalizado que extiende AbstractUser
    Incluye campos adicionales para el perfil del usuario
    """
    
    # Campos adicionales para el perfil
    profile_photo = models.ImageField(
        upload_to='profile_photos/',
        null=True,
        blank=True,
        verbose_name='Foto de Perfil'
    )
    
    # Validación para el teléfono
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="El número de teléfono debe estar en formato: '+999999999'. Hasta 15 dígitos permitidos."
    )
    
    phone_number = models.CharField(
        validators=[phone_regex],
        max_length=17,
        null=True,
        blank=True,
        verbose_name='Número de Teléfono'
    )
    
    # Campos de verificación
    email_verified = models.BooleanField(
        default=False,
        verbose_name='Email Verificado'
    )
    
    # Campos de fecha
    date_of_birth = models.DateField(
        null=True,
        blank=True,
        verbose_name='Fecha de Nacimiento'
    )
    
    # Campos de ubicación
    country = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        verbose_name='País'
    )
    
    city = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        verbose_name='Ciudad'
    )
    
    # Campos de redes sociales
    website = models.URLField(
        null=True,
        blank=True,
        verbose_name='Sitio Web'
    )
    
    bio = models.TextField(
        max_length=500,
        null=True,
        blank=True,
        verbose_name='Biografía'
    )
    
    # Configuración del modelo
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        db_table = 'users'
    
    def __str__(self):
        return self.username
    
    def get_full_name(self):
        """Retorna el nombre completo del usuario"""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.username
    
    def has_profile_photo(self):
        """Verifica si el usuario tiene una foto de perfil"""
        return bool(self.profile_photo)
    
    def get_profile_photo_url(self):
        """Retorna la URL de la foto de perfil o None"""
        if self.profile_photo:
            return self.profile_photo.url
        return None
