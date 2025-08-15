from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.http import FileResponse, Http404
from django.conf import settings
from django.contrib.auth import get_user_model
import os

from HU02_ProfileManagement.serializers import UploadImageSerializer

User = get_user_model()

MAX_IMAGE_SIZE_MB = 2


class UploadUserPhotoView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, user_id):
        serializer = UploadImageSerializer(data=request.data)

        if serializer.is_valid():
            try:
                user = User.objects.get(pk=user_id)

                uploaded_file = serializer.validated_data['photo']
                if uploaded_file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024:
                    return Response(
                        {"error": f"La imagen excede el tamaño máximo de {MAX_IMAGE_SIZE_MB} MB."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Eliminar foto anterior si existe
                if user.photo:
                    old_path = user.photo.path
                    if os.path.exists(old_path):
                        os.remove(old_path)

                # Asignar y guardar nueva foto
                user.photo = uploaded_file
                user.save()

                return Response({
                    'message': 'Foto actualizada correctamente',
                    'photo_url': user.photo.url,
                    'full_url': request.build_absolute_uri(user.photo.url),
                    'file_name': os.path.basename(user.photo.name)
                }, status=status.HTTP_200_OK)

            except User.DoesNotExist:
                return Response({'message': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ShowUserPhotoView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id):
        try:
            user = User.objects.get(pk=user_id)

            if not user.photo:
                raise Http404('Imagen no encontrada')

            path = user.photo.path
            if not os.path.exists(path):
                raise Http404('Imagen no encontrada')

            return FileResponse(open(path, 'rb'), content_type='image/jpeg')

        except User.DoesNotExist:
            raise Http404('Usuario no encontrado')


class DeleteUserPhotoView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, user_id):
        try:
            user = User.objects.get(pk=user_id)

            if user.photo:
                path = user.photo.path
                if os.path.exists(path):
                    os.remove(path)

                user.photo = None
                user.save()
                return Response({'message': 'Foto eliminada correctamente'}, status=status.HTTP_200_OK)

            return Response({'message': 'No hay foto para eliminar'}, status=status.HTTP_404_NOT_FOUND)

        except User.DoesNotExist:
            return Response({'message': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
