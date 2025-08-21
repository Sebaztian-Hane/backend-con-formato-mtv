from ..models import Certification
from datetime import date

class CertificationService:
    """
    Servicio para manejar la lógica de negocio de certificaciones
    """
    
    @staticmethod
    def get_active_certifications():
        """Obtiene todas las certificaciones activas"""
        return Certification.objects.filter(is_active=True)
    
    @staticmethod
    def get_certifications_by_therapist(therapist_id):
        """Obtiene todas las certificaciones de un terapeuta"""
        return Certification.objects.filter(therapist_id=therapist_id, is_active=True)
    
    @staticmethod
    def get_expired_certifications():
        """Obtiene certificaciones expiradas"""
        today = date.today()
        return Certification.objects.filter(
            expiry_date__lt=today,
            is_active=True
        )
    
    @staticmethod
    def get_expiring_soon_certifications(days=30):
        """Obtiene certificaciones que expiran pronto"""
        from datetime import timedelta
        today = date.today()
        future_date = today + timedelta(days=days)
        return Certification.objects.filter(
            expiry_date__gte=today,
            expiry_date__lte=future_date,
            is_active=True
        )
