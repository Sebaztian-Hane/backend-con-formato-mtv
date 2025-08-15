from guardian.shortcuts import get_perms
from django.contrib.auth import get_user_model

class GetRoleService:
    @staticmethod
    def get_user_roles_and_perms(user):
        roles = []
        perms = set()
        if user.is_superuser:
            roles.append('superuser')
        if user.is_staff:
            roles.append('staff')
        # Puedes agregar lógica para roles personalizados aquí
        # Ejemplo: roles de grupos
        for group in user.groups.all():
            roles.append(group.name)
        # Permisos a nivel de objeto y global
        perms.update(user.get_all_permissions())
        # Guardian object permissions (ejemplo para Company)
        # from yourapp.models import Company
        # for company in Company.objects.all():
        #     perms.update(get_perms(user, company))
        return {
            'roles': roles,
            'permissions': list(perms)
        }
