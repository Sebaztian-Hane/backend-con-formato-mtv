from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """
    Permiso personalizado para usuarios administradores
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.rol == 'Admin'


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permiso personalizado para propietarios o solo lectura
    """
    def has_object_permission(self, request, view, obj):
        # Permisos de lectura para cualquier usuario autenticado
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Permisos de escritura solo para el propietario
        return obj.user == request.user 