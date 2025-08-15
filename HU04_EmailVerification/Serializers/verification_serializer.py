from rest_framework import serializers

class VerificationSerializer(serializers.Serializer):
    code = serializers.CharField(
        max_length=6,
        min_length=6,
        required=True,
        trim_whitespace=True,
        help_text="Código de verificación de 6 dígitos"
    )

    def validate_code(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("El código debe contener solo dígitos.")
        return value
