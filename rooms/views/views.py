from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from models.models import Room
from serializers.serializers import RoomSerializer



class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


