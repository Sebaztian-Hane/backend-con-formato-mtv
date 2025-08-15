from rest_framework import serializers
from models.models import UserRole, RolePermission
from django.contrib.auth import get_user_model

User = get_user_model()

class UserRoleSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_full_name = serializers.SerializerMethodField()
    role_name = serializers.CharField(source='role.name', read_only=True)
    
    class Meta:
        model = UserRole
        fields = ['id', 'user', 'user_username', 'user_full_name', 'role', 'role_name', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    
    def get_user_full_name(self, obj):
        full_name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return full_name if full_name else obj.user.username

class RolePermissionSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source='role.name', read_only=True)
    permission_name = serializers.CharField(source='permission.name', read_only=True)
    
    class Meta:
        model = RolePermission
        fields = ['id', 'role', 'role_name', 'permission', 'permission_name', 'created_at']
        read_only_fields = ['created_at']

class UserRoleDetailSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()
    
    class Meta:
        model = UserRole
        fields = ['user', 'role', 'permissions']
    
    def get_user(self, obj):
        return {
            'id': obj.user.id,
            'username': obj.user.username,
            'full_name': f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username
        }
    
    def get_role(self, obj):
        return {
            'id': obj.role.id,
            'name': obj.role.name,
            'description': obj.role.description
        }
    
    def get_permissions(self, obj):
        permissions = []
        role_permissions = RolePermission.objects.filter(role=obj.role).select_related('permission')
        
        for role_perm in role_permissions:
            permissions.append({
                'id': role_perm.permission.id,
                'name': role_perm.permission.name,
                'codename': role_perm.permission.codename,
                'detail': role_perm.permission.detail or ''
            })
        
        return permissions 