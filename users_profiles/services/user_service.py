from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import transaction
from ..models import UserProfile

User = get_user_model()


class UserService:
    """Servicio para lógica de negocio relacionada con usuarios"""
    
    @staticmethod
    def create_user(user_data):
        """Crea un nuevo usuario con validaciones"""
        try:
            with transaction.atomic():
                # Crear el usuario
                user = User.objects.create_user(
                    username=user_data['username'],
                    email=user_data['email'],
                    password=user_data['password'],
                    first_name=user_data.get('first_name', ''),
                    last_name=user_data.get('last_name', '')
                )
                
                # Crear perfil básico
                UserProfile.objects.create(
                    user=user,
                    first_name=user_data.get('first_name', ''),
                    paternal_lastname=user_data.get('last_name', ''),
                    maternal_lastname='',
                    email=user_data['email'],
                    gender='P'
                )
                
                return user
                
        except Exception as e:
            raise ValidationError(f"Error al crear usuario: {str(e)}")
    
    @staticmethod
    def update_user(user, user_data):
        """Actualiza la información del usuario"""
        try:
            with transaction.atomic():
                # Actualizar campos del usuario
                for field, value in user_data.items():
                    if hasattr(user, field):
                        setattr(user, field, value)
                
                user.save()
                return user
                
        except Exception as e:
            raise ValidationError(f"Error al actualizar usuario: {str(e)}")
    
    @staticmethod
    def update_profile_photo(user, photo_file):
        """Actualiza la foto de perfil del usuario"""
        try:
            # Eliminar foto anterior si existe
            if user.profile_photo:
                user.profile_photo.delete(save=False)
            
            # Asignar nueva foto
            user.profile_photo = photo_file
            user.save()
            
            return user
            
        except Exception as e:
            raise ValidationError(f"Error al actualizar foto de perfil: {str(e)}")
    
    @staticmethod
    def delete_profile_photo(user):
        """Elimina la foto de perfil del usuario"""
        try:
            if user.profile_photo:
                user.profile_photo.delete(save=False)
                user.save()
                return True
            return False
            
        except Exception as e:
            raise ValidationError(f"Error al eliminar foto de perfil: {str(e)}")
    
    @staticmethod
    def search_users(query, limit=20):
        """Busca usuarios por nombre o username"""
        try:
            from django.db.models import Q
            
            queryset = User.objects.filter(is_active=True)
            
            if query:
                queryset = queryset.filter(
                    Q(username__icontains=query) |
                    Q(first_name__icontains=query) |
                    Q(last_name__icontains=query)
                )
            
            return queryset[:limit]
            
        except Exception as e:
            raise ValidationError(f"Error en búsqueda de usuarios: {str(e)}")
    
    @staticmethod
    def get_user_by_username(username):
        """Obtiene un usuario por username"""
        try:
            return User.objects.get(username=username, is_active=True)
        except User.DoesNotExist:
            return None
    
    @staticmethod
    def get_user_by_email(email):
        """Obtiene un usuario por email"""
        try:
            return User.objects.get(email=email, is_active=True)
        except User.DoesNotExist:
            return None
    
    @staticmethod
    def deactivate_user(user):
        """Desactiva un usuario"""
        try:
            user.is_active = False
            user.save()
            return True
        except Exception as e:
            raise ValidationError(f"Error al desactivar usuario: {str(e)}")
    
    @staticmethod
    def activate_user(user):
        """Activa un usuario"""
        try:
            user.is_active = True
            user.save()
            return True
        except Exception as e:
            raise ValidationError(f"Error al activar usuario: {str(e)}")
    
    @staticmethod
    def get_user_stats(user):
        """Obtiene estadísticas del usuario"""
        try:
            stats = {
                'username': user.username,
                'email': user.email,
                'is_active': user.is_active,
                'email_verified': user.email_verified,
                'date_joined': user.date_joined,
                'last_login': user.last_login,
                'has_profile_photo': bool(user.profile_photo),
                'profile_completion': 0
            }
            
            # Calcular completitud del perfil si existe
            try:
                profile = user.profile
                stats['profile_completion'] = profile.get_completion_percentage()
            except UserProfile.DoesNotExist:
                pass
            
            return stats
            
        except Exception as e:
            raise ValidationError(f"Error al obtener estadísticas: {str(e)}")
