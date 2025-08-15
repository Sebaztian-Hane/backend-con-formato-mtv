from django.urls import path
from controllers.auth.ChangePasswordController import ChangePasswordController

urlpatterns = [
    path('change-password/', ChangePasswordController.as_view()),
    path('validate-password/', ChangePasswordController.as_view(), {'http_method': 'validate_password'}),
]