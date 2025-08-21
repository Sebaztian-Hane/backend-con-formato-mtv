from rest_framework import viewsets
from ..models import Specialization
from ..serializers import SpecializationSerializer

class SpecializationViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD de especialidades.
    """
    serializer_class = SpecializationSerializer
    queryset = Specialization.objects.all()
