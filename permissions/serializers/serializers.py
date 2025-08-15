from rest_framework import serializers
from models.models import Permission

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'content_type', 'codename', 'detail'] 