from rest_framework import serializers
from models.models import Ticket

class TicketRequestSerializer(serializers.Serializer):
    date = serializers.DateField(required=True)
    appointment_id = serializers.IntegerField(required=False, allow_null=True)

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'