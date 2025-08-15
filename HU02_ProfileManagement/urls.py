from django.urls import path
from django.contrib.auth import views as auth_views
from HU02_ProfileManagement.forms import EmailAuthenticationForm  # ← agregado

from .controllers import frontend_views
from HU02_ProfileManagement.controllers.profile_controller import ProfileView
from HU02_ProfileManagement.controllers.image_controller import (
    UploadUserPhotoView,
    ShowUserPhotoView,
    DeleteUserPhotoView
)
from HU02_ProfileManagement.controllers.compatibility_controller import CompatibilityController

urlpatterns = [
    path('me/', ProfileView.as_view(), name='user_profile'),
    path('photo/<int:user_id>/upload/', UploadUserPhotoView.as_view(), name='upload_user_photo'),
    path('photo/<int:user_id>/', ShowUserPhotoView.as_view(), name='show_user_photo'),
    path('photo/<int:user_id>/delete/', DeleteUserPhotoView.as_view(), name='delete_user_photo'),
    path('perfil/', frontend_views.hu02_view, name='profile_view'),
    path('hu02/', frontend_views.hu02_view, name='hu02'),

    # Login con email
    path(
        'login/',
        auth_views.LoginView.as_view(
            template_name='login.html',
            authentication_form=EmailAuthenticationForm
        ),
        name='login'
    ),
    
    # 🔄 Rutas de compatibilidad para el frontend React
    path('', CompatibilityController.as_view(), name='compatibility_profile'),  # GET/PUT/PATCH /api/profile
    path('sendVerifyCode', CompatibilityController.as_view(), name='send_verify_code'),  # POST /api/sendVerifyCode
    path('verification', CompatibilityController.as_view(), name='verification'),  # POST /api/verification
    path('validate-password', CompatibilityController.as_view(), name='validate_password'),  # POST /api/validate-password
    path('change-password', CompatibilityController.as_view(), name='change_password'),  # PUT /api/change-password
]
