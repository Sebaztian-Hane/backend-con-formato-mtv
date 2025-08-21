from ..models import Therapist
from django.db import models

class TherapistService:
    """
    Servicio para manejar la lógica de negocio de terapeutas
    """
    
    @staticmethod
    def get_active_therapists():
        """Obtiene todos los terapeutas activos"""
        return Therapist.objects.filter(is_active=True)
    
    @staticmethod
    def get_inactive_therapists():
        """Obtiene todos los terapeutas inactivos"""
        return Therapist.objects.filter(is_active=False)
    
    @staticmethod
    def search_therapists(query):
        """Busca terapeutas por diferentes criterios"""
        return Therapist.objects.filter(
            models.Q(first_name__icontains=query) |
            models.Q(last_name_paternal__icontains=query) |
            models.Q(last_name_maternal__icontains=query) |
            models.Q(document_number__icontains=query) |
            models.Q(email__icontains=query)
        )
    
    @staticmethod
    def soft_delete_therapist(therapist_id):
        """Marca un terapeuta como inactivo (soft delete)"""
        try:
            therapist = Therapist.objects.get(pk=therapist_id)
            therapist.is_active = False
            therapist.save(update_fields=['is_active'])
            return True
        except Therapist.DoesNotExist:
            return False
    
    @staticmethod
    def restore_therapist(therapist_id):
        """Restaura un terapeuta marcándolo como activo"""
        try:
            therapist = Therapist.objects.get(pk=therapist_id)
            therapist.is_active = True
            therapist.save(update_fields=['is_active'])
            return True
        except Therapist.DoesNotExist:
            return False
