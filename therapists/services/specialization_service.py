from ..models import Specialization

class SpecializationService:
    """
    Servicio para manejar la lógica de negocio de especialidades
    """
    
    @staticmethod
    def get_active_specializations():
        """Obtiene todas las especialidades activas"""
        return Specialization.objects.filter(is_active=True)
    
    @staticmethod
    def get_specialization_by_name(name):
        """Obtiene una especialidad por nombre"""
        try:
            return Specialization.objects.get(name__iexact=name, is_active=True)
        except Specialization.DoesNotExist:
            return None
