# Create your models here.
from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone


class Appointment(models.Model):
    appointment_date = models.DateField()
    appointment_hour = models.TimeField(null=True, blank=True)
    ailments = models.TextField(max_length=1000, null=True, blank=True)
    diagnosis = models.TextField(max_length=1000, null=True, blank=True)
    surgeries = models.TextField(max_length=1000, null=True, blank=True)
    reflexology_diagnostics = models.TextField(max_length=1000, null=True, blank=True)
    medications = models.CharField(max_length=255, null=True, blank=True)
    observation = models.CharField(max_length=255, null=True, blank=True)
    initial_date = models.DateField(null=True, blank=True)
    final_date = models.DateField(null=True, blank=True)
    appointment_type = models.CharField(max_length=255, null=True, blank=True)
    room = models.ForeignKey(
        'rooms.Room',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='appointments'
    )
    social_benefit = models.BooleanField(null=True, blank=True)
    payment_detail = models.CharField(max_length=255, null=True, blank=True)
    payment = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True,
        validators=[MinValueValidator(0)]
    )
    ticket_number = models.IntegerField(null=True, blank=True)
    status = models.ForeignKey(
        'statuses.Status',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='appointments'
    )
    # Simplified fields to avoid external dependencies
    payment_type_name = models.CharField(max_length=255, null=True, blank=True)
    patient_name = models.CharField(max_length=255, null=True, blank=True)
    patient_id = models.IntegerField(null=True, blank=True)
    therapist_name = models.CharField(max_length=255, null=True, blank=True)
    therapist_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'appointments'
        ordering = ['-appointment_date', '-appointment_hour']
        unique_together = ['patient_id', 'appointment_date', 'appointment_hour']

    def __str__(self):
        patient_info = self.patient_name or f"Patient ID: {self.patient_id}"
        return f"Cita {self.id} - {patient_info} - {self.appointment_date}"

    def delete(self, using=None, keep_parents=False):
        self.deleted_at = timezone.now()
        self.save()

    def restore(self):
        self.deleted_at = None
        self.save()

    @property
    def is_deleted(self):
        return self.deleted_at is not None 