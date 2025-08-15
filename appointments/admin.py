from django.contrib import admin
from .models import Appointment
# Register your models here.
@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'patient_name', 'appointment_date', 'appointment_hour', 
        'appointment_type', 'status', 'therapist_name', 'room'
    ]
    list_filter = [
        'appointment_date', 'status', 'appointment_type', 
        'room', 'social_benefit', 'created_at'
    ]
    search_fields = [
        'patient_name', 'patient_id', 'ailments', 'diagnosis', 'observation'
    ]
    date_hierarchy = 'appointment_date'
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Información de la Cita', {
            'fields': ('appointment_date', 'appointment_hour', 'appointment_type', 'room')
        }),
        ('Paciente y Terapeuta', {
            'fields': ('patient_name', 'patient_id', 'therapist_name', 'therapist_id')
        }),
        ('Estado y Pago', {
            'fields': ('status', 'payment_type_name', 'payment', 'payment_detail', 'ticket_number')
        }),
        ('Información Médica', {
            'fields': ('ailments', 'diagnosis', 'surgeries', 'reflexology_diagnostics', 'medications')
        }),
        ('Observaciones', {
            'fields': ('observation', 'initial_date', 'final_date', 'social_benefit')
        }),
        ('Información del Sistema', {
            'fields': ('created_at', 'updated_at', 'deleted_at'),
            'classes': ('collapse',)
        }),
    ) 