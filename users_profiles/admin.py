from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model
from .models import UserProfile, UserVerificationCode

User = get_user_model()


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Administración personalizada para el modelo User"""
    
    list_display = [
        'username', 'email', 'first_name', 'last_name', 'email_verified',
        'is_active', 'date_joined', 'last_login'
    ]
    
    list_filter = [
        'is_active', 'email_verified', 'is_staff', 'is_superuser',
        'date_joined', 'last_login'
    ]
    
    search_fields = ['username', 'email', 'first_name', 'last_name']
    
    ordering = ['-date_joined']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Perfil', {
            'fields': (
                'profile_photo', 'phone_number', 'date_of_birth',
                'country', 'city', 'website', 'bio', 'email_verified'
            )
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Información Personal', {
            'fields': ('first_name', 'last_name', 'email')
        }),
    )
    
    readonly_fields = ['date_joined', 'last_login']
    
    def get_queryset(self, request):
        """Optimiza las consultas del admin"""
        return super().get_queryset(request).select_related('profile')


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """Administración para el modelo UserProfile"""
    
    list_display = [
        'user', 'first_name', 'paternal_lastname', 'maternal_lastname',
        'gender', 'email', 'is_public', 'created_at', 'updated_at'
    ]
    
    list_filter = [
        'gender', 'is_public', 'show_email', 'show_phone',
        'receive_notifications', 'created_at', 'updated_at'
    ]
    
    search_fields = [
        'user__username', 'user__email', 'first_name',
        'paternal_lastname', 'maternal_lastname'
    ]
    
    ordering = ['-updated_at']
    
    fieldsets = (
        ('Usuario', {
            'fields': ('user',)
        }),
        ('Información Personal', {
            'fields': (
                'first_name', 'paternal_lastname', 'maternal_lastname',
                'gender', 'email'
            )
        }),
        ('Configuración', {
            'fields': (
                'is_public', 'show_email', 'show_phone',
                'receive_notifications'
            )
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def get_queryset(self, request):
        """Optimiza las consultas del admin"""
        return super().get_queryset(request).select_related('user')


@admin.register(UserVerificationCode)
class UserVerificationCodeAdmin(admin.ModelAdmin):
    """Administración para el modelo UserVerificationCode"""
    
    list_display = [
        'user', 'verification_type', 'code', 'target_email',
        'is_used', 'attempts', 'created_at', 'expires_at'
    ]
    
    list_filter = [
        'verification_type', 'is_used', 'created_at', 'expires_at'
    ]
    
    search_fields = ['user__username', 'user__email', 'code', 'target_email']
    
    ordering = ['-created_at']
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('user', 'verification_type', 'code', 'target_email')
        }),
        ('Estado', {
            'fields': ('is_used', 'attempts', 'max_attempts')
        }),
        ('Fechas', {
            'fields': ('created_at', 'expires_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'expires_at']
    
    def get_queryset(self, request):
        """Optimiza las consultas del admin"""
        return super().get_queryset(request).select_related('user')
    
    def has_add_permission(self, request):
        """No permite crear códigos manualmente"""
        return False
    
    def has_change_permission(self, request, obj=None):
        """Solo permite ver, no editar"""
        return False


# Configuración del sitio admin
admin.site.site_header = "Administración de Perfiles de Usuario"
admin.site.site_title = "Perfiles de Usuario"
admin.site.index_title = "Panel de Administración"
