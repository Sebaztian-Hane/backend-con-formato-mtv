"""
Vistas para la aplicación de terapeutas.
Maneja las operaciones CRUD y renderizado de templates.
"""

from django.shortcuts import render
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from models.models import Therapist
from serializers.serializers import TherapistSerializer


class TherapistViewSet(viewsets.ModelViewSet):
    queryset = Therapist.objects.all()
    serializer_class = TherapistSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['first_name', 'last_name', 'license_number', 'email', 'document']

def index(request):
    """
    Vista para renderizar la página principal de terapeutas.
    """
    return render(request, 'therapists_ui.html')