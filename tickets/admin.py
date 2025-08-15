from django.contrib import admin
from .models import Ticket

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ['id', 'ticket_number', 'appointment', 'amount', 'paid', 'created_at', 'updated_at']
    search_fields = ['ticket_number', 'appointment__patient_name']
    list_filter = ['paid', 'created_at', 'updated_at']
    readonly_fields = ['created_at', 'updated_at', 'deleted_at']
