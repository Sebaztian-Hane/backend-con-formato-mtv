from ..models import Permission, Role


class PermissionService:
    @staticmethod
    def get_all_permissions():
        return Permission.objects.all()

    @staticmethod
    def get_permission_by_id(permission_id):
        try:
            return Permission.objects.get(id=permission_id)
        except Permission.DoesNotExist:
            return None

    @staticmethod
    def create_permission(permission_data):
        return Permission.objects.create(**permission_data)

    @staticmethod
    def update_permission(permission, permission_data):
        for field, value in permission_data.items():
            setattr(permission, field, value)
        permission.save()
        return permission

    @staticmethod
    def delete_permission(permission):
        permission.delete()
        return True


class RoleService:
    @staticmethod
    def get_all_roles():
        return Role.objects.all()

    @staticmethod
    def get_role_by_id(role_id):
        try:
            return Role.objects.get(id=role_id)
        except Role.DoesNotExist:
            return None

    @staticmethod
    def create_role(role_data):
        return Role.objects.create(**role_data)

    @staticmethod
    def update_role(role, role_data):
        for field, value in role_data.items():
            setattr(role, field, value)
        role.save()
        return role

    @staticmethod
    def delete_role(role):
        role.delete()
        return True 