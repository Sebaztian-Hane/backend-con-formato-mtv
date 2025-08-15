from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from services.services import GetRoleService

@login_required
@require_http_methods(["GET"])
def get_user_role(request):
    """
    Vista para obtener el rol y permisos del usuario autenticado.
    Equivalente al endpoint que usaría el getRoleService.php en Laravel.
    """
    return GetRoleService.get_role_user(request.user)

@login_required
@require_http_methods(["GET"])
def get_user_permissions(request):
    """
    Vista para obtener solo los permisos del usuario autenticado.
    """
    permissions = GetRoleService.get_user_permissions(request.user)
    permission_list = []
    
    for permission in permissions:
        permission_list.append({
            'id': permission.id,
            'name': permission.name,
            'codename': permission.codename,
            'detail': permission.detail or ''
        })
    
    return JsonResponse({
        'user_id': request.user.id,
        'permissions': permission_list
    }, status=200)

@login_required
@require_http_methods(["POST"])
def assign_role_to_user(request):
    """
    Vista para asignar un rol a un usuario.
    """
    try:
        role_name = request.POST.get('role_name')
        if not role_name:
            return JsonResponse({
                'message': 'El nombre del rol es requerido.'
            }, status=400)
        
        success = GetRoleService.assign_role_to_user(request.user, role_name)
        
        if success:
            return JsonResponse({
                'message': f'Rol "{role_name}" asignado correctamente al usuario.'
            }, status=200)
        else:
            return JsonResponse({
                'message': f'Error al asignar el rol "{role_name}".'
            }, status=400)
            
    except Exception as e:
        return JsonResponse({
            'message': 'Error interno del servidor.'
        }, status=500)
