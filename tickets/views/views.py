from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from services.services import TicketService
from serializers.serializers import TicketRequestSerializer, TicketSerializer
from models.models import Ticket

class AvailableTicketsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TicketRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        date = serializer.validated_data['date']
        available_rooms = TicketService.generate_next_room_number(str(date))
        available_tickets = TicketService.generate_next_ticket_number(str(date))
        return Response({
            'available_rooms': available_rooms,
            'available_tickets': available_tickets
        })

class NextRoomNumberView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TicketRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        date = serializer.validated_data['date']
        appointment_id = serializer.validated_data.get('appointment_id')
        room_number = TicketService.generate_next_room_number(str(date), appointment_id)
        return Response({'next_room_number': room_number})

class NextTicketNumberView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TicketRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        date = serializer.validated_data['date']
        appointment_id = serializer.validated_data.get('appointment_id')
        ticket_number = TicketService.generate_next_ticket_number(str(date), appointment_id)
        return Response({'next_ticket_number': ticket_number})



class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

