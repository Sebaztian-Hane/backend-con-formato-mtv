from django.db import models

# Create your models here.
from django.db import models
from appointments.models import Appointment

class Ticket(models.Model):
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name='ticket')
    ticket_number = models.IntegerField(unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Ticket {self.ticket_number} - Cita {self.appointment_id}"