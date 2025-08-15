from rest_framework import serializers

class SendVerifyCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()
