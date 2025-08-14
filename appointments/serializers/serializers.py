from rest_framework import serializers
from models.models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    def validate_appointment_date(self, value):
        from django.utils import timezone
        if value < timezone.now().date():
            raise serializers.ValidationError("La fecha no puede ser en el pasado.")
        return value

    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'deleted_at')



class AppointmentListSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient_name', read_only=True)
    therapist_name = serializers.CharField(source='therapist_name', read_only=True)
    appointment_status_name = serializers.SerializerMethodField()
    payment_type_name = serializers.SerializerMethodField()

    def get_appointment_status_name(self, obj):
        # Si appointment_status es None, devuelve None
        return obj.appointment_status.name if obj.appointment_status else None

    def get_payment_type_name(self, obj):
        # Si payment_type_name existe como campo, devuélvelo
        return getattr(obj, 'payment_type_name', None)

    class Meta:
        model = Appointment
        fields = [
            'id', 'appointment_date', 'appointment_hour', 'ailments', 'diagnosis',
            'surgeries', 'reflexology_diagnostics', 'medications', 'observation',
            'initial_date', 'final_date', 'appointment_type', 'room', 'social_benefit',
            'payment_detail', 'payment', 'ticket_number', 'appointment_status',
            'appointment_status_name', 'payment_type', 'payment_type_name',
            'patient', 'patient_name', 'therapist', 'therapist_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'created_at', 'updated_at')


class AppointmentCreateSerializer(serializers.ModelSerializer):
    def validate_appointment_date(self, value):
        from django.utils import timezone
        if value < timezone.now().date():
            raise serializers.ValidationError("La fecha no puede ser en el pasado.")
        return value

    def validate(self, data):
        # Check if appointment already exists for this patient, date and time
        if Appointment.objects.filter(
            patient_id=data.get('patient_id'),
            appointment_date=data.get('appointment_date'),
            appointment_hour=data.get('appointment_hour'),
            deleted_at__isnull=True
        ).exists():
            raise serializers.ValidationError(
                "Ya existe una cita para este paciente en la fecha y hora seleccionadas."
            )
        # Validate final_date is after or equal to initial_date
        initial_date = data.get('initial_date')
        final_date = data.get('final_date')
        if initial_date and final_date and final_date < initial_date:
            raise serializers.ValidationError(
                "La fecha final debe ser posterior o igual a la fecha inicial."
            )
        return data

    class Meta:
        model = Appointment
        fields = [
            'appointment_date', 'appointment_hour', 'ailments', 'diagnosis',
            'surgeries', 'reflexology_diagnostics', 'medications', 'observation',
            'initial_date', 'final_date', 'appointment_type', 'room', 'social_benefit',
            'payment_detail', 'payment', 'ticket_number', 'appointment_status_id',
            'payment_type_id', 'patient_id', 'therapist_id'
        ]


class AppointmentUpdateSerializer(serializers.ModelSerializer):
    def validate_appointment_date(self, value):
        from django.utils import timezone
        if value < timezone.now().date():
            raise serializers.ValidationError("La fecha no puede ser en el pasado.")
        return value

    def validate(self, data):
        # Validate final_date is after or equal to initial_date
        initial_date = data.get('initial_date')
        final_date = data.get('final_date')
        if initial_date and final_date and final_date < initial_date:
            raise serializers.ValidationError(
                "La fecha final debe ser posterior o igual a la fecha inicial."
            )
        return data

    class Meta:
        model = Appointment
        fields = [
            'appointment_date', 'appointment_hour', 'ailments', 'diagnosis',
            'surgeries', 'reflexology_diagnostics', 'medications', 'observation',
            'initial_date', 'final_date', 'appointment_type', 'room', 'social_benefit',
            'payment_detail', 'payment', 'ticket_number', 'appointment_status_id',
            'payment_type_id', 'therapist_id'
        ]


class AppointmentSearchSerializer(serializers.Serializer):
    search = serializers.CharField(required=False, allow_blank=True)
    patient_id = serializers.IntegerField(required=False)
    therapist_id = serializers.IntegerField(required=False)
    appointment_status_id = serializers.IntegerField(required=False)
    appointment_date_from = serializers.DateField(required=False)
    appointment_date_to = serializers.DateField(required=False)
    appointment_type = serializers.CharField(required=False, allow_blank=True)
    room = serializers.IntegerField(required=False)
    social_benefit = serializers.BooleanField(required=False)
    payment_type_id = serializers.IntegerField(required=False)
    page = serializers.IntegerField(required=False, min_value=1, default=1)
    per_page = serializers.IntegerField(required=False, min_value=1, max_value=100, default=15)


class AppointmentDateFilterSerializer(serializers.Serializer):
    date = serializers.DateField(required=True)
    page = serializers.IntegerField(required=False, min_value=1, default=1)
    per_page = serializers.IntegerField(required=False, min_value=1, max_value=100, default=15) 