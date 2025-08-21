from ..models import Schedule
from django.db import models

class ScheduleService:
    """
    Servicio para manejar la lógica de negocio de horarios
    """
    
    @staticmethod
    def get_therapist_schedule(therapist_id):
        """Obtiene el horario completo de un terapeuta"""
        return Schedule.objects.filter(
            therapist_id=therapist_id,
            is_available=True
        ).order_by('day_of_week', 'start_time')
    
    @staticmethod
    def get_available_therapists_by_day(day_of_week):
        """Obtiene terapeutas disponibles en un día específico"""
        from ..models import Therapist
        therapist_ids = Schedule.objects.filter(
            day_of_week=day_of_week,
            is_available=True
        ).values_list('therapist_id', flat=True)
        return Therapist.objects.filter(id__in=therapist_ids, is_active=True)
    
    @staticmethod
    def check_therapist_availability(therapist_id, day_of_week, start_time, end_time):
        """Verifica si un terapeuta está disponible en un horario específico"""
        conflicting_schedules = Schedule.objects.filter(
            therapist_id=therapist_id,
            day_of_week=day_of_week,
            is_available=True
        ).filter(
            models.Q(start_time__lt=end_time) & models.Q(end_time__gt=start_time)
        )
        return not conflicting_schedules.exists()
