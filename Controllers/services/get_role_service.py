from rest_framework.response import Response
from rest_framework import status

def get_user_role_and_permissions(user):
    """
    Devuelve el rol y permisos del usuario autenticado.
    """
    # Aquí deberías adaptar según tu modelo real de roles y permisos
    role = getattr(user, 'role', 'No definido')
    permissions = list(user.get_all_permissions()) if hasattr(user, 'get_all_permissions') else []

    return Response({
        'role': role,
        'permissions': permissions
    }, status=status.HTTP_200_OK)
