from rest_framework.response import Response
from rest_framework import status
from models.models import Status
from serializers.serializers import StatusListSerializer, StatusCreateSerializer, StatusUpdateSerializer


class StatusService:
    def get_all(self):
        """Get all appointment statuses"""
        queryset = Status.objects.filter(deleted_at__isnull=True)
        serializer = StatusListSerializer(queryset, many=True)
        return Response({'data': serializer.data}, status=status.HTTP_200_OK)

    def store_or_restore(self, validated_data):
        """Create new appointment status or restore deleted one"""
        # Check if status was previously deleted
        existing_status = Status.objects.filter(
            name=validated_data['name'],
            deleted_at__isnull=False
        ).first()
        
        if existing_status:
            # Restore the status
            existing_status.deleted_at = None
            existing_status.description = validated_data.get('description', existing_status.description)
            existing_status.save()
            
            serializer = StatusListSerializer(existing_status)
            return Response({
                'message': 'Estado de cita restaurado exitosamente',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        else:
            # Create new status
            serializer = StatusCreateSerializer(data=validated_data)
            if serializer.is_valid():
                status = serializer.save()
                response_serializer = StatusListSerializer(status)
                return Response({
                    'message': 'Estado de cita creado exitosamente',
                    'data': response_serializer.data
                }, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, status, validated_data):
        """Update appointment status"""
        serializer = StatusUpdateSerializer(status, data=validated_data, partial=True)
        if serializer.is_valid():
            updated_status = serializer.save()
            response_serializer = StatusListSerializer(updated_status)
            return Response({
                'message': 'Estado de cita actualizado exitosamente',
                'data': response_serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, status):
        """Soft delete appointment status"""
        status.delete()  # This calls the custom delete method
        return Response({
            'message': 'Estado de cita eliminado exitosamente'
        }, status=status.HTTP_200_OK) 