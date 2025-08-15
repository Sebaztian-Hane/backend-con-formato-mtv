from rest_framework import viewsets
from models.models import Status
from serializers.serializers import (
    StatusSerializer,
    StatusListSerializer,
    StatusCreateSerializer,
    StatusUpdateSerializer
)
from services.services import StatusService


class StatusViewSet(viewsets.ModelViewSet):
    queryset = Status.objects.filter(deleted_at__isnull=True)
    serializer_class = StatusListSerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return StatusCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return StatusUpdateSerializer
        elif self.action == 'retrieve':
            return StatusSerializer
        return StatusListSerializer

    def get_queryset(self):
        return Status.objects.filter(deleted_at__isnull=True)

    def list(self, request, *args, **kwargs):
        """Get all appointment statuses"""
        service = StatusService()
        return service.get_all()

    def create(self, request, *args, **kwargs):
        """Create new appointment status or restore deleted one"""
        service = StatusService()
        return service.store_or_restore(request.data)

    def update(self, request, *args, **kwargs):
        """Update appointment status"""
        status = self.get_object()
        service = StatusService()
        return service.update(status, request.data)

    def destroy(self, request, *args, **kwargs):
        """Soft delete appointment status"""
        status = self.get_object()
        service = StatusService()
        return service.destroy(status)
