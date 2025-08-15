from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.translation import gettext_lazy as _

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True, write_only=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            raise serializers.ValidationError(_('Se requieres email y contraseña.'))

        user = authenticate(request=self.context.get('request'), username=email, password=password)

        if user is None:
            raise AuthenticationFailed(_('Credenciales inválidas.'))
        
        if user.is_active is None:
            raise AuthenticationFailed(_('Cuenta no activada.'))
        
        refresh = RefreshToken.for_user(user)

        return {
            'email': user.email,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id': user.id,
        }
        
