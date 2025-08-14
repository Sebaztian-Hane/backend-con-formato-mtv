from rest_framework import serializers
from models.models import Status


class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'deleted_at')


class StatusListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = ['id', 'name', 'description', 'created_at', 'updated_at']
        read_only_fields = ('id', 'created_at', 'updated_at')


class StatusCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = ['name', 'description']

    def validate_name(self, value):
        # Check if status with this name already exists (not deleted)
        if Status.objects.filter(
            name=value,
            deleted_at__isnull=True
        ).exists():
            raise serializers.ValidationError(
                "Este estado de cita ya está registrado."
            )
        return value


class StatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = ['name', 'description']

    def validate_name(self, value):
        # Check if status with this name already exists (excluding current instance)
        if Status.objects.filter(
            name=value,
            deleted_at__isnull=True
        ).exclude(id=self.instance.id).exists():
            raise serializers.ValidationError(
                "Este estado de cita ya está registrado."
            )
        return value 