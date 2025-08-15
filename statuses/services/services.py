from rest_framework.response import Response
from rest_framework import status as http_status  # Renombrado para evitar conflicto
from models.models import Status
from serializers.serializers import (
    StatusListSerializer, 
    StatusCreateSerializer, 
    StatusUpdateSerializer
)


class StatusService:
    def get_all(self):
        """Get all appointment statuses"""
        queryset = Status.objects.filter(deleted_at__isnull=True)
        serializer = StatusListSerializer(queryset, many=True)
        return Response({'data': serializer.data}, status=http_status.HTTP_200_OK)

    def store_or_restore(self, validated_data):
        """Create new appointment status or restore deleted one"""
        name = validated_data['name']
        
        # Check if status exists (deleted or active)
        existing_status = Status.objects.filter(name=name).first()
        
        if existing_status:
            if existing_status.deleted_at:
                # Restore the status
                existing_status.deleted_at = None
                existing_status.description = validated_data.get('description', existing_status.description)
                existing_status.save()
                
                serializer = StatusListSerializer(existing_status)
                return Response({
                    'message': 'Estado de cita restaurado exitosamente',
                    'data': serializer.data
                }, status=http_status.HTTP_200_OK)
            else:
                return Response(
                    {'error': 'Ya existe un estado activo con este nombre'},
                    status=http_status.HTTP_400_BAD_REQUEST
                )
        else:
            # Create new status
            serializer = StatusCreateSerializer(data=validated_data)
            if serializer.is_valid():
                new_status = serializer.save()
                response_serializer = StatusListSerializer(new_status)
                return Response({
                    'message': 'Estado de cita creado exitosamente',
                    'data': response_serializer.data
                }, status=http_status.HTTP_201_CREATED)
            return Response(serializer.errors, status=http_status.HTTP_400_BAD_REQUEST)

    def update(self, status_instance, validated_data):
        """Update appointment status"""
        serializer = StatusUpdateSerializer(
            status_instance, 
            data=validated_data, 
            partial=True
        )
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=http_status.HTTP_400_BAD_REQUEST)
            
        updated_status = serializer.save()
        response_serializer = StatusListSerializer(updated_status)
        return Response({
            'message': 'Estado de cita actualizado exitosamente',
            'data': response_serializer.data
        }, status=http_status.HTTP_200_OK)

    def destroy(self, status_instance):
        """Soft delete appointment status"""
        if status_instance.deleted_at:
            return Response(
                {'error': 'Este estado ya fue eliminado'},
                status=http_status.HTTP_400_BAD_REQUEST
            )
            
        status_instance.delete()
        return Response({
            'message': 'Estado de cita eliminado exitosamente'
        }, status=http_status.HTTP_200_OK)