"""
Servicio para gestión de perfiles de usuario
"""

from django.db import transaction
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from ..models.profile import UserProfile

User = get_user_model()


class ProfileService:
    """Servicio para gestión de perfiles de usuario"""
    
    @staticmethod
    def create_profile(user, profile_data):
        """
        Crear un perfil para un usuario
        
        Args:
            user: Usuario al que se le creará el perfil
            profile_data: Datos del perfil
            
        Returns:
            UserProfile: Perfil creado
        """
        try:
            with transaction.atomic():
                # Verificar si ya existe un perfil
                if hasattr(user, 'profile'):
                    raise ValidationError("El usuario ya tiene un perfil")
                
                # Crear el perfil
                profile = UserProfile.objects.create(
                    user=user,
                    **profile_data
                )
                
                return profile
                
        except Exception as e:
            raise ValidationError(f"Error al crear el perfil: {str(e)}")
    
    @staticmethod
    def update_profile(user, profile_data):
        """
        Actualizar el perfil de un usuario
        
        Args:
            user: Usuario cuyo perfil se actualizará
            profile_data: Datos a actualizar
            
        Returns:
            UserProfile: Perfil actualizado
        """
        try:
            with transaction.atomic():
                profile = user.profile
                
                # Actualizar campos
                for field, value in profile_data.items():
                    if hasattr(profile, field):
                        setattr(profile, field, value)
                
                profile.save()
                return profile
                
        except Exception as e:
            raise ValidationError(f"Error al actualizar el perfil: {str(e)}")
    
    @staticmethod
    def get_profile_by_user(user):
        """
        Obtener el perfil de un usuario
        
        Args:
            user: Usuario del cual obtener el perfil
            
        Returns:
            UserProfile: Perfil del usuario o None si no existe
        """
        try:
            return user.profile
        except UserProfile.DoesNotExist:
            return None
    
    @staticmethod
    def get_public_profiles():
        """
        Obtener todos los perfiles públicos
        
        Returns:
            QuerySet: Perfiles públicos
        """
        return UserProfile.objects.filter(is_public=True)
    
    @staticmethod
    def get_profile_by_username(username):
        """
        Obtener perfil por username
        
        Args:
            username: Username del usuario
            
        Returns:
            UserProfile: Perfil del usuario o None si no existe
        """
        try:
            user = User.objects.get(username=username)
            return user.profile
        except (User.DoesNotExist, UserProfile.DoesNotExist):
            return None
    
    @staticmethod
    def calculate_profile_completion(profile):
        """
        Calcular el porcentaje de completitud del perfil
        
        Args:
            profile: Perfil a evaluar
            
        Returns:
            int: Porcentaje de completitud (0-100)
        """
        required_fields = [
            'first_name', 'paternal_lastname', 'gender', 'email'
        ]
        
        optional_fields = [
            'maternal_lastname', 'bio', 'website'
        ]
        
        total_fields = len(required_fields) + len(optional_fields)
        completed_fields = 0
        
        # Verificar campos requeridos
        for field in required_fields:
            if getattr(profile, field):
                completed_fields += 1
        
        # Verificar campos opcionales (valen menos)
        for field in optional_fields:
            if getattr(profile, field):
                completed_fields += 0.5
        
        return min(100, int((completed_fields / total_fields) * 100))
    
    @staticmethod
    def get_profile_stats(profile):
        """
        Obtener estadísticas del perfil
        
        Args:
            profile: Perfil a analizar
            
        Returns:
            dict: Estadísticas del perfil
        """
        return {
            'completion_percentage': ProfileService.calculate_profile_completion(profile),
            'is_complete': profile.is_complete(),
            'is_public': profile.is_public,
            'show_email': profile.show_email,
            'show_phone': profile.show_phone,
            'receive_notifications': profile.receive_notifications
        }
    
    @staticmethod
    def toggle_profile_visibility(profile):
        """
        Cambiar la visibilidad del perfil
        
        Args:
            profile: Perfil a modificar
            
        Returns:
            UserProfile: Perfil actualizado
        """
        profile.is_public = not profile.is_public
        profile.save()
        return profile
    
    @staticmethod
    def update_privacy_settings(profile, privacy_data):
        """
        Actualizar configuraciones de privacidad
        
        Args:
            profile: Perfil a modificar
            privacy_data: Datos de privacidad
            
        Returns:
            UserProfile: Perfil actualizado
        """
        privacy_fields = ['show_email', 'show_phone', 'receive_notifications']
        
        for field in privacy_fields:
            if field in privacy_data:
                setattr(profile, field, privacy_data[field])
        
        profile.save()
        return profile
