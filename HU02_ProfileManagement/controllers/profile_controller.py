from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth import get_user_model
from HU02_ProfileManagement.requests.update_profile_form import UpdateProfileForm

User = get_user_model()

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):  
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "photo_url": getattr(user, 'photo_url', None),
        })

    def put(self, request):
        user = request.user
        form = UpdateProfileForm(request.data, request.FILES, user=user)


        if not form.is_valid():
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

        # Convertir 'name' → 'first_name'
        cleaned_data = form.cleaned_data.copy()
        if 'name' in cleaned_data:
            cleaned_data['first_name'] = cleaned_data.pop('name')

        # Actualiza los campos del usuario, excepto contraseña
        for field, value in cleaned_data.items():
            if value is not None and hasattr(user, field) and field not in ['password', 'current_password']:
                setattr(user, field, value)

        # Verificación de contraseña
        new_password = cleaned_data.get('password')
        if new_password:
            current_password = cleaned_data.get('current_password')
            if not current_password or not user.check_password(current_password):
                return Response(
                    {'current_password': 'La contraseña actual es incorrecta.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            user.set_password(new_password)

        user.save()

        return Response({
            "message": "Perfil actualizado correctamente",
            "data": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "photo_url": getattr(user, 'photo_url', None),
            }
        }, status=status.HTTP_200_OK)
