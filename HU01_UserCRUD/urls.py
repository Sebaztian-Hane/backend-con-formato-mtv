from rest_framework.routers import DefaultRouter
from controllers.user_controller import UserController
from django.urls import path, include

router = DefaultRouter()
router.register(r'users', UserController, basename='user')

urlpatterns = [
    path('', include(router.urls)),
]