from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class UserProfile(models.Model):
    """
    Modelo para información adicional del perfil del usuario
    Extiende la información básica del modelo User
    """
    
    GENDER_CHOICES = [
        ('M', 'Masculino'),
        ('F', 'Femenino'),
        ('O', 'Otro'),
        ('P', 'Prefiero no decir'),
    ]
    
    # Relación con el usuario
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile',
        verbose_name='Usuario'
    )
    
    # Información personal
    first_name = models.CharField(
        max_length=50,
        verbose_name='Nombre'
    )
    
    paternal_lastname = models.CharField(
        max_length=50,
        verbose_name='Apellido Paterno'
    )
    
    maternal_lastname = models.CharField(
        max_length=50,
        verbose_name='Apellido Materno'
    )
    
    gender = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        verbose_name='Género'
    )
    
    # Información de contacto
    email = models.EmailField(
        verbose_name='Correo Electrónico'
    )
    
    # Configuración del perfil
    is_public = models.BooleanField(
        default=True,
        verbose_name='Perfil Público'
    )
    
    show_email = models.BooleanField(
        default=False,
        verbose_name='Mostrar Email'
    )
    
    show_phone = models.BooleanField(
        default=False,
        verbose_name='Mostrar Teléfono'
    )
    
    # Preferencias
    receive_notifications = models.BooleanField(
        default=True,
        verbose_name='Recibir Notificaciones'
    )
    
    # Campos de fecha
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Fecha de Creación'
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Fecha de Actualización'
    )
    
    class Meta:
        verbose_name = 'Perfil de Usuario'
        verbose_name_plural = 'Perfiles de Usuario'
        db_table = 'user_profiles'
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"Perfil de {self.user.username}"
    
    def get_full_name(self):
        """Retorna el nombre completo del usuario"""
        names = [self.first_name, self.paternal_lastname, self.maternal_lastname]
        return ' '.join(filter(None, names))
    
    def get_display_name(self):
        """Retorna el nombre para mostrar (nombre + apellido paterno)"""
        if self.first_name and self.paternal_lastname:
            return f"{self.first_name} {self.paternal_lastname}"
        return self.user.username
    
    def is_complete(self):
        """Verifica si el perfil está completo"""
        required_fields = ['first_name', 'paternal_lastname', 'email']
        return all(getattr(self, field) for field in required_fields)
    
    def get_completion_percentage(self):
        """Calcula el porcentaje de completitud del perfil"""
        fields = ['first_name', 'paternal_lastname', 'maternal_lastname', 
                 'gender', 'email', 'user.profile_photo']
        completed = 0
        
        for field in fields:
            if '.' in field:
                # Campo relacionado (ej: user.profile_photo)
                related_field, attr = field.split('.')
                if hasattr(getattr(self, related_field), attr):
                    value = getattr(getattr(self, related_field), attr)
                    if value:
                        completed += 1
            else:
                # Campo directo
                if getattr(self, field):
                    completed += 1
        
        return int((completed / len(fields)) * 100)
