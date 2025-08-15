from django.contrib.auth import get_user_model, logout
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
from django.http import JsonResponse
from django.core.exceptions import PermissionDenied
from django.contrib.auth.hashers import check_password
from services.first_login.ChangePasswordService import ChangePasswordService
from requests.auth.ChangePasswordRequest import ChangePasswordRequest
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

class ChangePasswordController(View):
    """
    Vista para manejar el cambio de contraseña de usuarios.
    Equivalente al ChangePasswordController.php en Laravel.
    """
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.change_password_service = ChangePasswordService()
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        """
        Middleware equivalente a 'auth:sanctum' en Laravel.
        Verifica que el usuario esté autenticado.
        """
        # Verificación adicional de permisos (equivalente a 'can:change-password.update')
        if not request.user.has_perm('auth.change_password'):
            raise PermissionDenied("No tienes permiso para cambiar la contraseña")
            
        return super().dispatch(request, *args, **kwargs)
    
    def post(self, request):
        """
        Maneja la solicitud de cambio de contraseña.
        Equivalente al método 'update' en el controlador Laravel.
        """
        serializer = ChangePasswordRequest(data=request.POST)
        if not serializer.is_valid():
            return JsonResponse(serializer.errors, status=400)
            
        current_password = serializer.validated_data['current_password']
        new_password = serializer.validated_data['new_password']
        
        # Verificar contraseña actual
        if not check_password(current_password, request.user.password):
            return JsonResponse({
                'status': False,
                'message': 'La contraseña actual es incorrecta.'
            }, status=422)
        
        # Cambiar la contraseña usando el servicio
        result = self.change_password_service.change_password(
            user=request.user,
            new_password=new_password
        )
        
        if result['password_change']:
            # Cerrar todas las sesiones del usuario
            logout(request)
            return JsonResponse({
                'status': True,
                'message': result['message']
            })
        
        return JsonResponse({
            'status': False,
            'message': result['message']
        }, status=500)
    
    @method_decorator(login_required)
    def validate_password(self, request):
        """
        Valida que la contraseña actual sea correcta.
        Equivalente al método validatePassword en el controlador Laravel.
        """
        current_password = request.POST.get('current_password')
        
        if not current_password:
            return JsonResponse({
                'status': False,
                'message': 'La contraseña actual es requerida.'
            }, status=400)
        
        is_valid = check_password(current_password, request.user.password)
        
        if is_valid:
            return JsonResponse({
                'message': 'La contraseña actual es válida.',
                'status': True,
            })
        
        return JsonResponse({
            'message': 'La contraseña actual es incorrecta.',
            'status': False,
        }, status=422)