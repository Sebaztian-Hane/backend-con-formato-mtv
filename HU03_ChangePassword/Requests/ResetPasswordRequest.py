from rest_framework import serializers

class ResetPasswordRequest(serializers.Serializer):
    email = serializers.EmailField(required=True)

    class Meta:
        fields = ['email']