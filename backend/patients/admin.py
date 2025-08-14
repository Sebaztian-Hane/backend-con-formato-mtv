from django.contrib import admin
from .models import Patient

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name', 'document_number', 'created_at')
    search_fields = ('first_name', 'last_name', 'document_number')
    list_filter = ('created_at',)
