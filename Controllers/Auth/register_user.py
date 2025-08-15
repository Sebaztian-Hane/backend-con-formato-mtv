from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterView(APIView):  # <-- Este nombre ahora sí coincide con tu importación
    def post(self, request):
        data = request.data

        try:
            user = User.objects.create(
                document_number=data.get('document_number'),
                name=data.get('name'),
                paternal_lastname=data.get('paternal_lastname'),
                maternal_lastname=data.get('maternal_lastname'),
                email=data.get('email'),
                phone=data.get('phone'),
                user_name=data.get('user_name'),
                password=make_password(data.get('password')),
                last_session=data.get('last_session'),
                account_statement=1,
                document_type_id=data.get('document_type_id'),
                country_id=data.get('country_id')
            )

            # Asignar rol
            try:
                admin_group = Group.objects.get(name='Admin')
                user.groups.add(admin_group)
            except Group.DoesNotExist:
                pass  # Silenciar si no existe el grupo

            return Response({
                'id': user.id,
                'email': user.email,
                'message': 'Usuario creado exitosamente.'
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

