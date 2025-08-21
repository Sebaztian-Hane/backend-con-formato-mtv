from django.contrib.auth import get_user_model
from ..models import User

UserModel = get_user_model()


class UserService:
    @staticmethod
    def get_user_by_id(user_id):
        try:
            return UserModel.objects.get(id=user_id)
        except UserModel.DoesNotExist:
            return None

    @staticmethod
    def get_user_by_email(email):
        try:
            return UserModel.objects.get(email=email)
        except UserModel.DoesNotExist:
            return None

    @staticmethod
    def create_user(user_data):
        return UserModel.objects.create_user(**user_data)

    @staticmethod
    def update_user(user, user_data):
        for field, value in user_data.items():
            if field != 'password':
                setattr(user, field, value)
        user.save()
        return user

    @staticmethod
    def delete_user(user):
        user.delete()
        return True 