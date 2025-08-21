from rest_framework import viewsets
from ..models import Certification
from ..serializers import CertificationSerializer

class CertificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD de certificaciones.
    """
    serializer_class = CertificationSerializer
    queryset = Certification.objects.all()
