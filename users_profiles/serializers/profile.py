from rest_framework import serializers
from .user import UserSerializer
from ..models import UserProfile


class ProfileSerializer(serializers.ModelSerializer):
    """Serializer para lectura del perfil de usuario"""
    
    user = UserSerializer(read_only=True)
    completion_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'first_name', 'paternal_lastname', 'maternal_lastname',
            'gender', 'email', 'is_public', 'show_email', 'show_phone',
            'receive_notifications', 'created_at', 'updated_at', 'completion_percentage'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_completion_percentage(self, obj):
        """Retorna el porcentaje de completitud del perfil"""
        return obj.get_completion_percentage()


class ProfileCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear un perfil de usuario"""
    
    class Meta:
        model = UserProfile
        fields = [
            'first_name', 'paternal_lastname', 'maternal_lastname',
            'gender', 'email', 'is_public', 'show_email', 'show_phone',
            'receive_notifications'
        ]
    
    def validate_email(self, value):
        """Validación personalizada para el email"""
        # Verificar que el email no esté en uso por otro perfil
        if UserProfile.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este email ya está registrado en otro perfil")
        return value
    
    def create(self, validated_data):
        """Crea un nuevo perfil de usuario"""
        user = self.context['request'].user
        profile = UserProfile.objects.create(user=user, **validated_data)
        return profile


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer para actualizar el perfil de usuario"""
    
    class Meta:
        model = UserProfile
        fields = [
            'first_name', 'paternal_lastname', 'maternal_lastname',
            'gender', 'email', 'is_public', 'show_email', 'show_phone',
            'receive_notifications'
        ]
    
    def validate_email(self, value):
        """Validación personalizada para el email"""
        user = self.context['request'].user
        # Verificar que el email no esté en uso por otro perfil (excluyendo el actual)
        if UserProfile.objects.filter(email=value).exclude(user=user).exists():
            raise serializers.ValidationError("Este email ya está registrado en otro perfil")
        return value
    
    def update(self, instance, validated_data):
        """Actualiza la instancia del perfil"""
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class PublicProfileSerializer(serializers.ModelSerializer):
    """Serializer para perfiles públicos (sin información sensible)"""
    
    user = serializers.SerializerMethodField()
    display_name = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'display_name', 'gender', 'country', 'city',
            'website', 'bio', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_user(self, obj):
        """Retorna información básica del usuario"""
        user_data = {
            'username': obj.user.username,
            'profile_photo_url': None
        }
        
        if obj.user.profile_photo:
            request = self.context.get('request')
            if request:
                user_data['profile_photo_url'] = request.build_absolute_uri(obj.user.profile_photo.url)
            else:
                user_data['profile_photo_url'] = obj.user.profile_photo.url
        
        return user_data
    
    def get_display_name(self, obj):
        """Retorna el nombre para mostrar"""
        return obj.get_display_name()
    
    def to_representation(self, instance):
        """Personaliza la representación del perfil público"""
        data = super().to_representation(instance)
        
        # Solo mostrar email si está configurado para ser visible
        if not instance.show_email:
            data.pop('email', None)
        
        # Solo mostrar teléfono si está configurado para ser visible
        if not instance.show_phone:
            data.pop('phone_number', None)
        
        return data


class ProfileSettingsSerializer(serializers.ModelSerializer):
    """Serializer para configuraciones del perfil"""
    
    class Meta:
        model = UserProfile
        fields = [
            'is_public', 'show_email', 'show_phone', 'receive_notifications'
        ]
    
    def update(self, instance, validated_data):
        """Actualiza solo las configuraciones del perfil"""
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
