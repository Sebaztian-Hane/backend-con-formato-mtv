from django.contrib import admin
from .models import Room

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'description', 'is_active', 'created_at', 'updated_at']
    search_fields = ['name', 'description']
    list_filter = ['is_active', 'created_at', 'updated_at']
    readonly_fields = ['created_at', 'updated_at', 'deleted_at']
