from rest_framework import viewsets
from models.user import User
from resources.user_resource import UserSerializer
from requests.store_user_request import StoreUserRequest
from requests.update_user_request import UpdateUserRequest

class UserController(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return StoreUserRequest
        elif self.action in ['update', 'partial_update']:
            return UpdateUserRequest
        return UserSerializer