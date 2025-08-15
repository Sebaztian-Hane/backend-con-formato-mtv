from django.contrib import admin
from .models import UserRole, RolePermission

@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'created_at', 'updated_at']
    list_filter = ['role', 'created_at']
    search_fields = ['user__username', 'user__first_name', 'user__last_name', 'role__name']
    ordering = ['user__username']

@admin.register(RolePermission)
class RolePermissionAdmin(admin.ModelAdmin):
    list_display = ['role', 'permission', 'created_at']
    list_filter = ['role', 'permission__content_type', 'created_at']
    search_fields = ['role__name', 'permission__name']
    ordering = ['role__name']
