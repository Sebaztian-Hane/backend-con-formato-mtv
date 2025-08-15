from rest_framework import serializers

class ChangePasswordRequest(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(
        required=True,
        min_length=8,
        error_messages={
            'min_length': 'La contraseña debe tener al menos 8 caracteres.'
        }
    )

    def validate(self, attrs):
        # Validaciones adicionales pueden ir aquí
        return attrs
    