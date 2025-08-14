from rest_framework.response import Response
from rest_framework import status
from .models import AppointmentStatus
from .serializers import AppointmentStatusListSerializer, AppointmentStatusCreateSerializer, AppointmentStatusUpdateSerializer


class AppointmentStatusService:
    def get_all(self):
        """Get all appointment statuses"""
        queryset = AppointmentStatus.objects.filter(deleted_at__isnull=True)
        serializer = AppointmentStatusListSerializer(queryset, many=True)
        return Response({'data': serializer.data}, status=status.HTTP_200_OK)

    def store_or_restore(self, validated_data):
        """Create new appointment status or restore deleted one"""
        # Check if status was previously deleted
        existing_status = AppointmentStatus.objects.filter(
            name=validated_data['name'],
            deleted_at__isnull=False
        ).first()
        
        if existing_status:
            # Restore the status
            existing_status.deleted_at = None
            existing_status.description = validated_data.get('description', existing_status.description)
            existing_status.save()
            
            serializer = AppointmentStatusListSerializer(existing_status)
            return Response({
                'message': 'Estado de cita restaurado exitosamente',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        else:
            # Create new status
            serializer = AppointmentStatusCreateSerializer(data=validated_data)
            if serializer.is_valid():
                appointment_status = serializer.save()
                response_serializer = AppointmentStatusListSerializer(appointment_status)
                return Response({
                    'message': 'Estado de cita creado exitosamente',
                    'data': response_serializer.data
                }, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, appointment_status, validated_data):
        """Update appointment status"""
        serializer = AppointmentStatusUpdateSerializer(appointment_status, data=validated_data, partial=True)
        if serializer.is_valid():
            updated_status = serializer.save()
            response_serializer = AppointmentStatusListSerializer(updated_status)
            return Response({
                'message': 'Estado de cita actualizado exitosamente',
                'data': response_serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, appointment_status):
        """Soft delete appointment status"""
        appointment_status.delete()  # This calls the custom delete method
        return Response({
            'message': 'Estado de cita eliminado exitosamente'
        }, status=status.HTTP_200_OK) 