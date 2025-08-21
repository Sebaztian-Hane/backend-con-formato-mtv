from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from guardian.shortcuts import get_perms

User = get_user_model()


class AuthService:
    @staticmethod
    def change_user_password(user, new_password):
        user.set_password(new_password)
        user.save()
        return Response({
            'message': 'Contraseña actualizada correctamente.'
        }, status=status.HTTP_200_OK)

    @staticmethod
    def verify_first_login(user):
        # Aquí iría tu lógica específica si es primer login
        token = Token.objects.create(user=user)
        return Response({
            'token': token.key,
            'message': 'Inicio de sesión exitoso.'
        }, status=status.HTTP_200_OK)

    @staticmethod
    def get_user_roles_and_perms(user):
        roles = []
        perms = set()
        if user.is_superuser:
            roles.append('superuser')
        if user.is_staff:
            roles.append('staff')
        # Puedes agregar lógica para roles personalizados aquí
        # Ejemplo: roles de grupos
        for group in user.groups.all():
            roles.append(group.name)
        # Permisos a nivel de objeto y global
        perms.update(user.get_all_permissions())
        # Guardian object permissions (ejemplo para Company)
        # from yourapp.models import Company
        # for company in Company.objects.all():
        #     perms.update(get_perms(user, company))
        return {
            'roles': roles,
            'permissions': list(perms)
        } 