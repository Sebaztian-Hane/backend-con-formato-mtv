from django.db.models import Q
from django.utils import timezone
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from datetime import datetime, timedelta
from models.models import Appointment
from serializers.serializers import AppointmentListSerializer, AppointmentCreateSerializer, AppointmentUpdateSerializer


class AppointmentService:
    def __init__(self):
        self.pagination = PageNumberPagination()
        self.pagination.page_size = 15

    def search_appointments(self, validated_data):
        """Search appointments with filters"""
        queryset = Appointment.objects.filter(deleted_at__isnull=True)
        
        # Apply filters
        if validated_data.get('search'):
            search_term = validated_data['search']
            queryset = queryset.filter(
                Q(patient__first_name__icontains=search_term) |
                Q(patient__last_name__icontains=search_term) |
                Q(patient__document_number__icontains=search_term) |
                Q(ailments__icontains=search_term) |
                Q(diagnosis__icontains=search_term) |
                Q(observation__icontains=search_term)
            )
        
        if validated_data.get('patient_id'):
            queryset = queryset.filter(patient_id=validated_data['patient_id'])
        
        if validated_data.get('therapist_id'):
            queryset = queryset.filter(therapist_id=validated_data['therapist_id'])
        
        if validated_data.get('appointment_status_id'):
            queryset = queryset.filter(appointment_status_id=validated_data['appointment_status_id'])
        
        if validated_data.get('appointment_date_from'):
            queryset = queryset.filter(appointment_date__gte=validated_data['appointment_date_from'])
        
        if validated_data.get('appointment_date_to'):
            queryset = queryset.filter(appointment_date__lte=validated_data['appointment_date_to'])
        
        if validated_data.get('appointment_type'):
            queryset = queryset.filter(appointment_type__icontains=validated_data['appointment_type'])
        
        if validated_data.get('room'):
            queryset = queryset.filter(room=validated_data['room'])
        
        if validated_data.get('social_benefit') is not None:
            queryset = queryset.filter(social_benefit=validated_data['social_benefit'])
        
        if validated_data.get('payment_type_id'):
            queryset = queryset.filter(payment_type_id=validated_data['payment_type_id'])
        
        # Pagination
        page = validated_data.get('page', 1)
        per_page = validated_data.get('per_page', 15)
        
        self.pagination.page_size = per_page
        paginated_queryset = self.pagination.paginate_queryset(queryset, None)
        
        serializer = AppointmentListSerializer(paginated_queryset, many=True)
        
        return Response({
            'data': serializer.data,
            'pagination': {
                'current_page': page,
                'per_page': per_page,
                'total': queryset.count(),
                'last_page': (queryset.count() + per_page - 1) // per_page
            }
        }, status=status.HTTP_200_OK)

    def search_completed_appointments(self, validated_data):
        """Search completed appointments"""
        queryset = Appointment.objects.filter(
            deleted_at__isnull=True,
            appointment_status__name__icontains='completado'
        )
        
        # Apply same filters as search_appointments
        return self.search_appointments(validated_data)

    def get_paginated_appointments_by_date(self, validated_data):
        """Get paginated appointments by date"""
        date = validated_data['date']
        queryset = Appointment.objects.filter(
            deleted_at__isnull=True,
            appointment_date=date
        )
        
        page = validated_data.get('page', 1)
        per_page = validated_data.get('per_page', 15)
        
        self.pagination.page_size = per_page
        paginated_queryset = self.pagination.paginate_queryset(queryset, None)
        
        serializer = AppointmentListSerializer(paginated_queryset, many=True)
        
        return Response({
            'data': serializer.data,
            'pagination': {
                'current_page': page,
                'per_page': per_page,
                'total': queryset.count(),
                'last_page': (queryset.count() + per_page - 1) // per_page
            }
        }, status=status.HTTP_200_OK)

    def get_completed_appointments_paginated_by_date(self, validated_data):
        """Get completed appointments paginated by date"""
        date = validated_data['date']
        queryset = Appointment.objects.filter(
            deleted_at__isnull=True,
            appointment_date=date,
            appointment_status__name__icontains='completado'
        )
        
        page = validated_data.get('page', 1)
        per_page = validated_data.get('per_page', 15)
        
        self.pagination.page_size = per_page
        paginated_queryset = self.pagination.paginate_queryset(queryset, None)
        
        serializer = AppointmentListSerializer(paginated_queryset, many=True)
        
        return Response({
            'data': serializer.data,
            'pagination': {
                'current_page': page,
                'per_page': per_page,
                'total': queryset.count(),
                'last_page': (queryset.count() + per_page - 1) // per_page
            }
        }, status=status.HTTP_200_OK)

    def get_pending_appointments_for_calendar_by_date(self):
        """Get pending appointments for calendar"""
        today = timezone.now().date()
        queryset = Appointment.objects.filter(
            deleted_at__isnull=True,
            appointment_date__gte=today,
            appointment_status__name__icontains='pendiente'
        ).select_related('patient', 'therapist', 'appointment_status')
        
        appointments_data = []
        for appointment in queryset:
            appointments_data.append({
                'id': appointment.id,
                'title': f"{appointment.patient.full_name} - {appointment.appointment_type or 'Cita'}",
                'start': f"{appointment.appointment_date}T{appointment.appointment_hour or '00:00'}",
                'end': f"{appointment.appointment_date}T{appointment.appointment_hour or '00:00'}",
                'patient_name': appointment.patient.full_name,
                'therapist_name': appointment.therapist.full_name if appointment.therapist else None,
                'appointment_type': appointment.appointment_type,
                'room': appointment.room,
                'status': appointment.appointment_status.name if appointment.appointment_status else None
            })
        
        return Response({'data': appointments_data}, status=status.HTTP_200_OK)

    def get_completed_appointments_for_calendar_by_date(self, validated_data):
        """Get completed appointments for calendar by date"""
        date = validated_data['date']
        queryset = Appointment.objects.filter(
            deleted_at__isnull=True,
            appointment_date=date,
            appointment_status__name__icontains='completado'
        ).select_related('patient', 'therapist', 'appointment_status')
        
        appointments_data = []
        for appointment in queryset:
            appointments_data.append({
                'id': appointment.id,
                'title': f"{appointment.patient.full_name} - {appointment.appointment_type or 'Cita'}",
                'start': f"{appointment.appointment_date}T{appointment.appointment_hour or '00:00'}",
                'end': f"{appointment.appointment_date}T{appointment.appointment_hour or '00:00'}",
                'patient_name': appointment.patient.full_name,
                'therapist_name': appointment.therapist.full_name if appointment.therapist else None,
                'appointment_type': appointment.appointment_type,
                'room': appointment.room,
                'status': appointment.appointment_status.name if appointment.appointment_status else None
            })
        
        return Response({'data': appointments_data}, status=status.HTTP_200_OK)

    def store_or_restore(self, validated_data):
        """Create new appointment or restore deleted one"""
        # Check if appointment was previously deleted
        existing_appointment = Appointment.objects.filter(
            patient_id=validated_data['patient_id'],
            appointment_date=validated_data['appointment_date'],
            appointment_hour=validated_data.get('appointment_hour'),
            deleted_at__isnull=False
        ).first()
        
        if existing_appointment:
            # Restore the appointment
            existing_appointment.deleted_at = None
            for key, value in validated_data.items():
                setattr(existing_appointment, key, value)
            existing_appointment.save()
            
            serializer = AppointmentListSerializer(existing_appointment)
            return Response({
                'message': 'Cita restaurada exitosamente',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        else:
            # Create new appointment
            serializer = AppointmentCreateSerializer(data=validated_data)
            if serializer.is_valid():
                appointment = serializer.save()
                response_serializer = AppointmentListSerializer(appointment)
                return Response({
                    'message': 'Cita creada exitosamente',
                    'data': response_serializer.data
                }, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, appointment, validated_data):
        """Update appointment"""
        serializer = AppointmentUpdateSerializer(appointment, data=validated_data, partial=True)
        if serializer.is_valid():
            updated_appointment = serializer.save()
            response_serializer = AppointmentListSerializer(updated_appointment)
            return Response({
                'message': 'Cita actualizada exitosamente',
                'data': response_serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, appointment):
        """Soft delete appointment"""
        appointment.delete()  # This calls the custom delete method
        return Response({
            'message': 'Cita eliminada exitosamente'
        }, status=status.HTTP_200_OK) 