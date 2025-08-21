from rest_framework import viewsets
from ..models import Schedule
from ..serializers import ScheduleSerializer

class ScheduleViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD de horarios.
    """
    serializer_class = ScheduleSerializer
    queryset = Schedule.objects.all()
