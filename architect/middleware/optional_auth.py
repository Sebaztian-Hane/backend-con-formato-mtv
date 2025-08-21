from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import AnonymousUser


class OptionalAuthenticate(MiddlewareMixin):
    def process_request(self, request):
        try:
            user_auth_tuple = JWTAuthentication().authenticate(request)
            if user_auth_tuple:
                request.user = user_auth_tuple[0]
            else:
                request.user = AnonymousUser()
        except Exception:
            request.user = AnonymousUser()
        return None 