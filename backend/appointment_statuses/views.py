from rest_framework import viewsets, status
from rest_framework.response import Response

from .models import AppointmentStatus
from .serializers import (
    AppointmentStatusSerializer,
    AppointmentStatusListSerializer,
    AppointmentStatusCreateSerializer,
    AppointmentStatusUpdateSerializer
)
from .services import AppointmentStatusService


class AppointmentStatusViewSet(viewsets.ModelViewSet):
    queryset = AppointmentStatus.objects.filter(deleted_at__isnull=True)
    serializer_class = AppointmentStatusListSerializer



    def get_serializer_class(self):
        if self.action == 'create':
            return AppointmentStatusCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return AppointmentStatusUpdateSerializer
        elif self.action == 'retrieve':
            return AppointmentStatusSerializer
        return AppointmentStatusListSerializer

    def get_queryset(self):
        return AppointmentStatus.objects.filter(deleted_at__isnull=True)

    def list(self, request, *args, **kwargs):
        """Get all appointment statuses"""
        service = AppointmentStatusService()
        return service.get_all()

    def create(self, request, *args, **kwargs):
        """Create new appointment status or restore deleted one"""
        service = AppointmentStatusService()
        return service.store_or_restore(request.data)

    def update(self, request, *args, **kwargs):
        """Update appointment status"""
        appointment_status = self.get_object()
        service = AppointmentStatusService()
        return service.update(appointment_status, request.data)

    def destroy(self, request, *args, **kwargs):
        """Soft delete appointment status"""
        appointment_status = self.get_object()
        service = AppointmentStatusService()
        return service.destroy(appointment_status)