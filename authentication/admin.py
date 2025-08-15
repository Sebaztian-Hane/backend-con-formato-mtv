from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User
from .models_email_verification import EmailVerificationCode


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """
    Configuración personalizada del admin para el modelo User
    """
    list_display = ('email', 'username', 'first_name', 'last_name', 'is_active', 'is_staff', 'created_at')
    list_filter = ('is_active', 'is_staff', 'is_superuser', 'created_at')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('-created_at',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Información Personal', {'fields': ('username', 'first_name', 'last_name', 'phone')}),
        ('Permisos', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Fechas importantes', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
    )

admin.site.register(EmailVerificationCode)
