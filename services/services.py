from django.contrib.auth import get_user_model
from django.db.models import Q
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from .models import UserRole, RolePermission
from roles.models import Role
from permissions.models import Permission
import logging

logger = logging.getLogger(__name__)

class GetRoleService:
    """
    Servicio para obtener el rol del usuario autenticado y sus permisos.
    Equivalente al getRoleService.php de Laravel.
    """
    
    @staticmethod
    def get_role_user(user):
        """
        Consulta el rol del usuario autenticado y sus permisos, y devuelve
        los resultados en un objeto JSON.
        
        Args:
            user: El usuario autenticado.
            
        Returns:
            JsonResponse: Un objeto JSON con los resultados.
        """
        if not user:
            return JsonResponse({
                'message': 'Usuario no encontrado.'
            }, status=404)
        
        try:
            # Consulta optimizada en una sola query usando Django ORM
            user_roles = UserRole.objects.select_related(
                'role'
            ).filter(user=user)
            
            if not user_roles.exists():
                return JsonResponse({
                    'message': 'No se encontraron roles para este usuario.',
                    'user_id': user.id
                }, status=404)
            
            # Obtener el primer rol del usuario
            user_role = user_roles.first()
            role = user_role.role
            
            # Obtener permisos del rol
            role_permissions = RolePermission.objects.select_related(
                'permission'
            ).filter(role=role)
            
            # Construir la respuesta
            permissions = []
            for role_perm in role_permissions:
                permissions.append({
                    'name': role_perm.permission.name,
                    'details': role_perm.permission.detail or ''
                })
            
            # Obtener el nombre completo del usuario
            full_name = f"{user.first_name} {user.last_name}".strip()
            if not full_name:
                full_name = user.username
            
            response_data = {
                'name': full_name,
                'user_id': user.id,
                'role_id': role.id,
                'name_role': role.name,
                'permissions': permissions
            }
            
            return JsonResponse(response_data, status=200)
            
        except ObjectDoesNotExist as e:
            logger.error(f"Error al obtener rol del usuario {user.id}: {str(e)}")
            return JsonResponse({
                'message': 'Error al obtener información del usuario.',
                'user_id': user.id
            }, status=500)
        except Exception as e:
            logger.error(f"Error inesperado al obtener rol del usuario {user.id}: {str(e)}")
            return JsonResponse({
                'message': 'Error interno del servidor.',
                'user_id': user.id
            }, status=500)
    
    @staticmethod
    def get_user_permissions(user):
        """
        Método auxiliar para obtener solo los permisos del usuario.
        
        Args:
            user: El usuario autenticado.
            
        Returns:
            list: Lista de permisos del usuario.
        """
        try:
            user_roles = UserRole.objects.select_related('role').filter(user=user)
            permissions = []
            
            for user_role in user_roles:
                role_permissions = RolePermission.objects.select_related('permission').filter(role=user_role.role)
                for role_perm in role_permissions:
                    permissions.append(role_perm.permission)
            
            return permissions
        except Exception as e:
            logger.error(f"Error al obtener permisos del usuario {user.id}: {str(e)}")
            return []
    
    @staticmethod
    def assign_role_to_user(user, role_name):
        """
        Asigna un rol a un usuario.
        
        Args:
            user: El usuario al que asignar el rol.
            role_name: Nombre del rol a asignar.
            
        Returns:
            bool: True si se asignó correctamente, False en caso contrario.
        """
        try:
            role = Role.objects.get(name=role_name)
            UserRole.objects.get_or_create(user=user, role=role)
            return True
        except Role.DoesNotExist:
            logger.error(f"Rol '{role_name}' no encontrado")
            return False
        except Exception as e:
            logger.error(f"Error al asignar rol '{role_name}' al usuario {user.id}: {str(e)}")
            return False
    
    @staticmethod
    def assign_permission_to_role(role_name, permission_name):
        """
        Asigna un permiso a un rol.
        
        Args:
            role_name: Nombre del rol.
            permission_name: Nombre del permiso.
            
        Returns:
            bool: True si se asignó correctamente, False en caso contrario.
        """
        try:
            role = Role.objects.get(name=role_name)
            permission = Permission.objects.get(name=permission_name)
            RolePermission.objects.get_or_create(role=role, permission=permission)
            return True
        except (Role.DoesNotExist, Permission.DoesNotExist) as e:
            logger.error(f"Error al asignar permiso '{permission_name}' al rol '{role_name}': {str(e)}")
            return False
        except Exception as e:
            logger.error(f"Error inesperado al asignar permiso: {str(e)}")
            return False 