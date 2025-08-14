from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from models.models import Appointment
from serializers.serializers import (
    AppointmentSerializer, 
    AppointmentListSerializer,
    AppointmentCreateSerializer,
    AppointmentUpdateSerializer,
    AppointmentSearchSerializer,
    AppointmentDateFilterSerializer
)
from services.services import AppointmentService




class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.filter(deleted_at__isnull=True)
    serializer_class = AppointmentListSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['appointment_status', 'room']
    search_fields = ['patient__first_name', 'patient__last_name', 'patient__document_number', 'ailments', 'diagnosis']
    ordering_fields = ['appointment_date', 'appointment_hour', 'created_at']
    ordering = ['-appointment_date', '-appointment_hour']



    def get_serializer_class(self):
        if self.action == 'create':
            return AppointmentCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return AppointmentUpdateSerializer
        elif self.action == 'retrieve':
            return AppointmentSerializer
        return AppointmentListSerializer

    def get_queryset(self):
        return Appointment.objects.filter(deleted_at__isnull=True).select_related(
            'room', 'appointment_status'
        )

    @action(detail=False, methods=['post'], url_path='search')
    def search_appointments(self, request):
        """Search appointments with filters"""
        serializer = AppointmentSearchSerializer(data=request.data)
        if serializer.is_valid():
            service = AppointmentService()
            return service.search_appointments(serializer.validated_data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='search-completed')
    def search_completed_appointments(self, request):
        """Search completed appointments"""
        serializer = AppointmentSearchSerializer(data=request.data)
        if serializer.is_valid():
            service = AppointmentService()
            return service.search_completed_appointments(serializer.validated_data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='paginated-by-date')
    def get_paginated_appointments_by_date(self, request):
        """Get paginated appointments by date"""
        serializer = AppointmentDateFilterSerializer(data=request.data)
        if serializer.is_valid():
            service = AppointmentService()
            return service.get_paginated_appointments_by_date(serializer.validated_data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='completed-paginated-by-date')
    def get_completed_appointments_paginated_by_date(self, request):
        """Get completed appointments paginated by date"""
        serializer = AppointmentDateFilterSerializer(data=request.data)
        if serializer.is_valid():
            service = AppointmentService()
            return service.get_completed_appointments_paginated_by_date(serializer.validated_data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='pending-calendar-by-date')
    def get_pending_appointments_for_calendar_by_date(self, request):
        """Get pending appointments for calendar"""
        service = AppointmentService()
        return service.get_pending_appointments_for_calendar_by_date()

    @action(detail=False, methods=['post'], url_path='completed-calendar-by-date')
    def get_completed_appointments_for_calendar_by_date(self, request):
        """Get completed appointments for calendar by date"""
        serializer = AppointmentDateFilterSerializer(data=request.data)
        if serializer.is_valid():
            service = AppointmentService()
            return service.get_completed_appointments_for_calendar_by_date(serializer.validated_data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        """Create new appointment or restore deleted one"""
        service = AppointmentService()
        return service.store_or_restore(request.data)

    def update(self, request, *args, **kwargs):
        """Update appointment"""
        appointment = self.get_object()
        service = AppointmentService()
        return service.update(appointment, request.data)

    def destroy(self, request, *args, **kwargs):
        """Soft delete appointment"""
        appointment = self.get_object()
        service = AppointmentService()
        return service.destroy(appointment) 