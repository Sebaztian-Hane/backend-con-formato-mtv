from django.contrib import admin
from django.urls import path, include
from Controllers.Auth.authenticated import LoginView, LogoutView
from Controllers.Auth.register_user import RegisterView
from Controllers.Auth.reset_password import VerifyEmailView
from Controllers.Auth.change_password import ChangePasswordView, ValidatePasswordView
from Controllers.Auth.verification import VerifyCodeView

urlpatterns = [
    path('admin/', admin.site.urls),

    # Autenticación API
    path('api/auth/login/', LoginView.as_view(), name='login'),
    path('api/auth/logout/', LogoutView.as_view(), name='logout'),
    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/reset-password-email/', VerifyEmailView.as_view(), name='reset_password_email'),
    path('api/auth/change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('api/auth/validate-password/', ValidatePasswordView.as_view(), name='validate_password'),
    path('api/auth/verify-code/', VerifyCodeView.as_view(), name='verify_code'),
]
