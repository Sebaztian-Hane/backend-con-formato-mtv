from rest_framework import serializers
from .models import AppointmentStatus


class AppointmentStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentStatus
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'deleted_at')


class AppointmentStatusListSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentStatus
        fields = ['id', 'name', 'description', 'created_at', 'updated_at']
        read_only_fields = ('id', 'created_at', 'updated_at')


class AppointmentStatusCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentStatus
        fields = ['name', 'description']

    def validate_name(self, value):
        # Check if status with this name already exists (not deleted)
        if AppointmentStatus.objects.filter(
            name=value,
            deleted_at__isnull=True
        ).exists():
            raise serializers.ValidationError(
                "Este estado de cita ya está registrado."
            )
        return value


class AppointmentStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentStatus
        fields = ['name', 'description']

    def validate_name(self, value):
        # Check if status with this name already exists (excluding current instance)
        if AppointmentStatus.objects.filter(
            name=value,
            deleted_at__isnull=True
        ).exclude(id=self.instance.id).exists():
            raise serializers.ValidationError(
                "Este estado de cita ya está registrado."
            )
        return value 