from rest_framework import serializers
from models.user import User

class UpdateUserRequest(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'email', 'phone']