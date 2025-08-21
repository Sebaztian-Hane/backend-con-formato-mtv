from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer para lectura del modelo User"""
    
    profile_photo_url = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'profile_photo_url', 'full_name', 'phone_number',
            'date_of_birth', 'country', 'city', 'website', 'bio',
            'email_verified', 'date_joined', 'last_login'
        ]
        read_only_fields = ['id', 'username', 'date_joined', 'last_login', 'email_verified']
    
    def get_profile_photo_url(self, obj):
        """Retorna la URL de la foto de perfil"""
        if obj.profile_photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_photo.url)
            return obj.profile_photo.url
        return None
    
    def get_full_name(self, obj):
        """Retorna el nombre completo del usuario"""
        return obj.get_full_name()


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer para actualización del modelo User"""
    
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'phone_number',
            'date_of_birth', 'country', 'city', 'website', 'bio'
        ]
    
    def validate_phone_number(self, value):
        """Validación personalizada para el número de teléfono"""
        if value:
            # La validación del regex ya está en el modelo
            return value
        return value
    
    def validate_website(self, value):
        """Validación para el sitio web"""
        if value and not value.startswith(('http://', 'https://')):
            value = 'https://' + value
        return value
    
    def update(self, instance, validated_data):
        """Actualiza la instancia del usuario"""
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer para registro de nuevos usuarios"""
    
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password],
        help_text='La contraseña debe cumplir con los requisitos de seguridad'
    )
    
    password_confirm = serializers.CharField(
        write_only=True,
        help_text='Confirma tu contraseña'
    )
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name'
        ]
    
    def validate(self, attrs):
        """Validación personalizada para el registro"""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Las contraseñas no coinciden")
        
        # Verificar que el email no esté en uso
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError("Este email ya está registrado")
        
        # Verificar que el username no esté en uso
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError("Este nombre de usuario ya está en uso")
        
        return attrs
    
    def create(self, validated_data):
        """Crea un nuevo usuario"""
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class UserProfilePhotoSerializer(serializers.ModelSerializer):
    """Serializer para actualización de la foto de perfil"""
    
    profile_photo = serializers.ImageField(
        max_length=None,
        allow_empty_file=False,
        use_url=True
    )
    
    class Meta:
        model = User
        fields = ['profile_photo']
    
    def update(self, instance, validated_data):
        """Actualiza la foto de perfil del usuario"""
        # Eliminar la foto anterior si existe
        if instance.profile_photo:
            instance.profile_photo.delete(save=False)
        
        instance.profile_photo = validated_data['profile_photo']
        instance.save()
        return instance
