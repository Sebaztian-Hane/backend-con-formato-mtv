from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime, timedelta


class JWTUtils:
    @staticmethod
    def generate_tokens(user):
        """
        Genera tokens de acceso y refresh para un usuario
        """
        refresh = RefreshToken.for_user(user)
        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'access_expires': refresh.access_token.lifetime.total_seconds(),
            'refresh_expires': refresh.lifetime.total_seconds()
        }

    @staticmethod
    def validate_token(token):
        """
        Valida un token JWT
        """
        try:
            refresh = RefreshToken(token)
            return True, refresh
        except Exception as e:
            return False, str(e)

    @staticmethod
    def refresh_access_token(refresh_token):
        """
        Refresca un token de acceso usando un refresh token
        """
        try:
            refresh = RefreshToken(refresh_token)
            return {
                'access': str(refresh.access_token),
                'access_expires': refresh.access_token.lifetime.total_seconds()
            }
        except Exception as e:
            return None 