from rest_framework import serializers

MAX_FILE_SIZE_MB = 2  # límite de 2MB

class UploadImageSerializer(serializers.Serializer):
    photo = serializers.ImageField()

    def validate_photo(self, value):
        max_size = MAX_FILE_SIZE_MB * 1024 * 1024  # convertir a bytes
        if value.size > max_size:
            raise serializers.ValidationError("La imagen es demasiado grande. Tamaño máximo permitido: 2MB.")
        return value
