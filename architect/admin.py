from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, UserVerificationCode, Permission, Role


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'rol', 'is_active', 'created_at')
    list_filter = ('rol', 'is_active', 'created_at')
    search_fields = ('email', 'username')
    ordering = ('-created_at',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('username', 'phone', 'rol')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'created_at', 'updated_at')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'rol'),
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')


@admin.register(UserVerificationCode)
class UserVerificationCodeAdmin(admin.ModelAdmin):
    list_display = ('user', 'code', 'expires_at', 'is_used', 'created_at')
    list_filter = ('is_used', 'created_at')
    search_fields = ('user__email', 'code')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ('name', 'codename', 'content_type', 'detail', 'is_active')
    list_filter = ('content_type', 'is_active')
    search_fields = ('name', 'codename')
    ordering = ('content_type', 'codename')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'is_active', 'created_at')
    list_filter = ('name', 'is_active', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('name',)
    readonly_fields = ('created_at', 'updated_at') 