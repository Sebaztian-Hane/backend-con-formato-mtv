from django.db import models

class Schedule(models.Model):
    """
    Modelo para los horarios de los terapeutas
    """
    DAYS_OF_WEEK = [
        ('monday', 'Lunes'),
        ('tuesday', 'Martes'),
        ('wednesday', 'Miércoles'),
        ('thursday', 'Jueves'),
        ('friday', 'Viernes'),
        ('saturday', 'Sábado'),
        ('sunday', 'Domingo'),
    ]

    therapist = models.ForeignKey('Therapist', on_delete=models.CASCADE, related_name='schedules')
    day_of_week = models.CharField(max_length=10, choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.therapist} - {self.get_day_of_week_display()} {self.start_time}-{self.end_time}"

    class Meta:
        verbose_name = "Horario"
        verbose_name_plural = "Horarios"
        unique_together = ['therapist', 'day_of_week']
