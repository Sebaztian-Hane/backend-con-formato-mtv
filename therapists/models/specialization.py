from django.db import models

class Specialization(models.Model):
    """
    Modelo para las especialidades de los terapeutas
    """
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Especialidad"
        verbose_name_plural = "Especialidades"
