from django.contrib import admin
from .models import Permission

@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ['name', 'content_type', 'codename', 'detail']
    list_filter = ['content_type']
    search_fields = ['name', 'codename', 'detail']
    ordering = ['name']
