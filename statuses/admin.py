from django.contrib import admin
from .models import Status
@admin.register(Status)
class AppointmentStatusAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'description', 'created_at', 'updated_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Información del Estado', {
            'fields': ('name', 'description')
        }),
        ('Información del Sistema', {
            'fields': ('created_at', 'updated_at', 'deleted_at'),
            'classes': ('collapse',)
        }),
    ) 