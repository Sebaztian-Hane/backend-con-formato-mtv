from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import random
import string


class UserVerificationCode(models.Model):
    """
    Modelo para códigos de verificación de email
    Utilizado para cambiar email y contraseña
    """
    
    VERIFICATION_TYPES = [
        ('email_change', 'Cambio de Email'),
        ('password_change', 'Cambio de Contraseña'),
        ('email_verification', 'Verificación de Email'),
    ]
    
    # Relación con el usuario
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='verification_codes',
        verbose_name='Usuario'
    )
    
    # Tipo de verificación
    verification_type = models.CharField(
        max_length=20,
        choices=VERIFICATION_TYPES,
        verbose_name='Tipo de Verificación'
    )
    
    # Código de verificación (6 dígitos)
    code = models.CharField(
        max_length=6,
        verbose_name='Código de Verificación'
    )
    
    # Email al que se envía el código (para cambio de email)
    target_email = models.EmailField(
        null=True,
        blank=True,
        verbose_name='Email Objetivo'
    )
    
    # Estado del código
    is_used = models.BooleanField(
        default=False,
        verbose_name='Código Utilizado'
    )
    
    # Fechas
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Fecha de Creación'
    )
    
    expires_at = models.DateTimeField(
        verbose_name='Fecha de Expiración'
    )
    
    # Intentos de uso
    attempts = models.PositiveIntegerField(
        default=0,
        verbose_name='Intentos de Uso'
    )
    
    max_attempts = models.PositiveIntegerField(
        default=3,
        verbose_name='Máximo de Intentos'
    )
    
    class Meta:
        verbose_name = 'Código de Verificación'
        verbose_name_plural = 'Códigos de Verificación'
        db_table = 'user_verification_codes'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'verification_type']),
            models.Index(fields=['code', 'is_used']),
        ]
    
    def __str__(self):
        return f"Código {self.code} para {self.user.username} - {self.get_verification_type_display()}"
    
    def save(self, *args, **kwargs):
        """Genera automáticamente el código y la fecha de expiración"""
        if not self.code:
            self.code = self.generate_code()
        
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=15)  # 15 minutos de validez
        
        super().save(*args, **kwargs)
    
    @staticmethod
    def generate_code():
        """Genera un código de 6 dígitos"""
        return ''.join(random.choices(string.digits, k=6))
    
    def is_expired(self):
        """Verifica si el código ha expirado"""
        return timezone.now() > self.expires_at
    
    def is_valid(self):
        """Verifica si el código es válido para usar"""
        return not self.is_used and not self.is_expired() and self.attempts < self.max_attempts
    
    def mark_as_used(self):
        """Marca el código como utilizado"""
        self.is_used = True
        self.save(update_fields=['is_used'])
    
    def increment_attempts(self):
        """Incrementa el contador de intentos"""
        self.attempts += 1
        self.save(update_fields=['attempts'])
    
    def can_attempt(self):
        """Verifica si se pueden hacer más intentos"""
        return self.attempts < self.max_attempts
    
    @classmethod
    def create_code(cls, user, verification_type, target_email=None):
        """Crea un nuevo código de verificación"""
        # Invalidar códigos anteriores del mismo tipo para el usuario
        cls.objects.filter(
            user=user,
            verification_type=verification_type,
            is_used=False
        ).update(is_used=True)
        
        # Crear nuevo código
        return cls.objects.create(
            user=user,
            verification_type=verification_type,
            target_email=target_email
        )
    
    @classmethod
    def verify_code(cls, user, code, verification_type):
        """Verifica un código de verificación"""
        try:
            verification = cls.objects.get(
                user=user,
                code=code,
                verification_type=verification_type,
                is_used=False
            )
            
            if verification.is_expired():
                return None, "Código expirado"
            
            if not verification.can_attempt():
                return None, "Demasiados intentos fallidos"
            
            return verification, None
            
        except cls.DoesNotExist:
            return None, "Código inválido"
