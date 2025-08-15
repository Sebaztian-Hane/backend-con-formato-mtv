from rest_framework import serializers
from models.models import Therapist

class TherapistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Therapist
        fields = '__all__'