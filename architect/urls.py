from django.urls import path
from .views import (
    LoginView, RegisterView, UserView,
    PermissionView, RoleView
)

app_name = 'architect'

urlpatterns = [
    # Autenticación
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    
    # Usuarios
    path('users/', UserView.as_view(), name='users'),
    
    # Permisos
    path('permissions/', PermissionView.as_view(), name='permissions'),
    
    # Roles
    path('roles/', RoleView.as_view(), name='roles'),
] 