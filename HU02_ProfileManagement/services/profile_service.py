# HU02_ProfileManagement/services/profile_service.py

from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ObjectDoesNotExist

from users.serializers import UserProfileSerializer

UserModel = get_user_model()


class ProfileService:
    """
    Servicio para gestionar el perfil del usuario autenticado.
    Equivalente a ProfileService de Laravel.
    """

    def get_authenticated_user(self, user: AbstractBaseUser) -> JsonResponse:
        """
        Devuelve el perfil del usuario autenticado con sus relaciones.
        """
        try:
            user = UserModel.objects.select_related(
                'region', 'province', 'district', 'document_type', 'country'
            ).get(pk=user.id)

            data = UserProfileSerializer(user).data
            return JsonResponse(data, status=200)

        except ObjectDoesNotExist:
            return JsonResponse({'message': 'Usuario no encontrado.'}, status=404)

    def update_authenticated_user(self, user: AbstractBaseUser, data: dict) -> JsonResponse:
        """
        Actualiza los datos del usuario autenticado.
        """
        if 'password' in data and data['password']:
            data['password'] = make_password(data['password'])

        for field, value in data.items():
            setattr(user, field, value)

        user.save()

        user.refresh_from_db()
        user = UserModel.objects.select_related(
            'region', 'province', 'district', 'document_type', 'country'
        ).get(pk=user.id)

        data = UserProfileSerializer(user).data
        return JsonResponse(data, status=200)
