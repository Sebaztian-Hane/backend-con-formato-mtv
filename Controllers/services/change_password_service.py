from rest_framework.response import Response
from rest_framework import status

def change_user_password(user, new_password):
    user.set_password(new_password)
    user.save()

    return Response({
        'message': 'Contraseña actualizada correctamente.'
    }, status=status.HTTP_200_OK)
