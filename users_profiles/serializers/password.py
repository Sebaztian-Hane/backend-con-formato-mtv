from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.models import update_last_login


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer para cambio de contraseña con verificación de contraseña actual"""
    
    current_password = serializers.CharField(
        write_only=True,
        help_text='Tu contraseña actual'
    )
    
    new_password = serializers.CharField(
        write_only=True,
        validators=[validate_password],
        help_text='Tu nueva contraseña'
    )
    
    new_password_confirm = serializers.CharField(
        write_only=True,
        help_text='Confirma tu nueva contraseña'
    )
    
    def validate_current_password(self, value):
        """Valida que la contraseña actual sea correcta"""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("La contraseña actual es incorrecta")
        return value
    
    def validate(self, attrs):
        """Validación personalizada para el cambio de contraseña"""
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("Las nuevas contraseñas no coinciden")
        
        if attrs['current_password'] == attrs['new_password']:
            raise serializers.ValidationError("La nueva contraseña debe ser diferente a la actual")
        
        return attrs
    
    def save(self):
        """Cambia la contraseña del usuario"""
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        
        # Actualizar la última fecha de login
        update_last_login(None, user)
        
        return user


class PasswordResetSerializer(serializers.Serializer):
    """Serializer para solicitar restablecimiento de contraseña"""
    
    email = serializers.EmailField(
        help_text='Email asociado a tu cuenta'
    )
    
    def validate_email(self, value):
        """Valida que el email exista en el sistema"""
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No existe una cuenta con este email")
        
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer para confirmar el restablecimiento de contraseña"""
    
    code = serializers.CharField(
        max_length=6,
        help_text='Código de verificación de 6 dígitos'
    )
    
    new_password = serializers.CharField(
        write_only=True,
        validators=[validate_password],
        help_text='Tu nueva contraseña'
    )
    
    new_password_confirm = serializers.CharField(
        write_only=True,
        help_text='Confirma tu nueva contraseña'
    )
    
    def validate(self, attrs):
        """Validación personalizada para el restablecimiento de contraseña"""
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("Las contraseñas no coinciden")
        return attrs


class PasswordStrengthSerializer(serializers.Serializer):
    """Serializer para validar la fortaleza de una contraseña"""
    
    password = serializers.CharField(
        help_text='Contraseña a validar'
    )
    
    def validate_password(self, value):
        """Valida la fortaleza de la contraseña"""
        try:
            validate_password(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value


class PasswordHistorySerializer(serializers.Serializer):
    """Serializer para historial de cambios de contraseña"""
    
    changed_at = serializers.DateTimeField(
        read_only=True,
        help_text='Fecha del cambio de contraseña'
    )
    
    ip_address = serializers.IPAddressField(
        read_only=True,
        help_text='Dirección IP desde donde se cambió la contraseña'
    )
    
    user_agent = serializers.CharField(
        read_only=True,
        help_text='Navegador/dispositivo utilizado'
    )
