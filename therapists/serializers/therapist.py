import re
from datetime import date
from rest_framework import serializers
from therapists.models import Therapist, Region, Province, District
from .location import RegionSerializer, ProvinceSerializer, DistrictSerializer

class TherapistSerializer(serializers.ModelSerializer):
    # Serializadores anidados para mostrar datos completos de ubicaciones
    region_fk = RegionSerializer(read_only=True)
    province_fk = ProvinceSerializer(read_only=True)
    district_fk = DistrictSerializer(read_only=True)
    
    # Campos para escritura (crear/actualizar)
    region_fk_id = serializers.PrimaryKeyRelatedField(
        queryset=Region.objects.all(), 
        source='region_fk', 
        allow_null=True, 
        required=False,
        write_only=True
    )
    province_fk_id = serializers.PrimaryKeyRelatedField(
        queryset=Province.objects.all(), 
        source='province_fk', 
        allow_null=True, 
        required=False,
        write_only=True
    )
    district_fk_id = serializers.PrimaryKeyRelatedField(
        queryset=District.objects.all(), 
        source='district_fk', 
        allow_null=True, 
        required=False,
        write_only=True
    )

    class Meta:
        model = Therapist
        fields = "__all__"
        extra_kwargs = {
            'email': {
                'required': False,
                'allow_null': True,
                'error_messages': {
                    'invalid': "El correo debe ser válido y terminar en @gmail.com"
                }
            }
        }
        
    def validate(self, attrs):
        """
        Asegura coherencia jerárquica:
        province_fk debe pertenecer a region_fk
        district_fk debe pertenecer a province_fk
        """
        region   = attrs.get("region_fk")   or getattr(self.instance, "region_fk", None)
        province = attrs.get("province_fk") or getattr(self.instance, "province_fk", None)
        district = attrs.get("district_fk") or getattr(self.instance, "district_fk", None)

        if province and region and province.region_id != region.id:
            raise serializers.ValidationError(
                "La provincia seleccionada no pertenece a la región."
            )
        if district and province and district.province_id != province.id:
            raise serializers.ValidationError(
                "El distrito seleccionado no pertenece a la provincia."
            )
        return attrs

    def validate_document_number(self, value):
        doc_type = self.initial_data.get("document_type")

        if doc_type == "DNI":
            if not value.isdigit():
                raise serializers.ValidationError("El DNI debe contener solo números.")
            if not (8 <= len(value) <= 9):
                raise serializers.ValidationError(
                    "El DNI debe tener entre 8 y 9 dígitos."
                )

        elif doc_type == "CE":
            if not value.isdigit():
                raise serializers.ValidationError(
                    "El Carné de Extranjería debe contener solo números."
                )
            if len(value) > 12:
                raise serializers.ValidationError(
                    "El Carné de Extranjería debe tener máximo 12 dígitos."
                )

        elif doc_type == "PTP":
            if not value.isdigit():
                raise serializers.ValidationError("El PTP debe contener solo números.")
            if len(value) != 9:
                raise serializers.ValidationError(
                    "El PTP debe tener exactamente 9 dígitos."
                )

        elif doc_type == "CR":
            if not re.match(r"^[A-Za-z0-9]+$", value):
                raise serializers.ValidationError(
                    "El Carné de Refugiado debe contener solo letras y números."
                )

        elif doc_type == "PAS":
            if not re.match(r"^[A-Za-z0-9]+$", value):
                raise serializers.ValidationError(
                    "El Pasaporte debe contener solo letras y números."
                )

        return value

    def validate_first_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("El nombre no puede estar vacío.")
        return value

    def validate_last_name_paternal(self, value):
        if not value.strip():
            raise serializers.ValidationError("El apellido paterno no puede estar vacío.")
        return value

    def validate_last_name_maternal(self, value):
        if not value.strip():
            raise serializers.ValidationError("El apellido materno no puede estar vacío.")
        return value

    def validate_personal_reference(self, value):
        if value and not re.match(r"^[A-Za-z0-9\s]+$", value):
            raise serializers.ValidationError(
                "La referencia personal solo puede contener letras y números."
            )
        return value

    def validate_phone(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("El teléfono debe contener solo dígitos.")
        if len(value) > 15:
            raise serializers.ValidationError(
                "El teléfono debe tener máximo 15 dígitos."
            )
        return value

    def validate_email(self, value):
        if value:
            pattern = r'^[A-Za-z0-9._%+-]+@gmail\.com$'
            if not re.match(pattern, value):
                raise serializers.ValidationError("El correo debe ser válido y terminar en @gmail.com (ejemplo: usuario@gmail.com).")
        return value

    def validate_country(self, value):
        if value and not re.match(r"^[A-Za-z0-9\s]+$", value):
            raise serializers.ValidationError(
                "El país solo puede contener letras y números."
            )
        return value

    def validate_department(self, value):
        if value and not re.match(r"^[A-Za-z0-9\s]+$", value):
            raise serializers.ValidationError(
                "El departamento solo puede contener letras y números."
            )
        return value

    def validate_province(self, value):
        if value and not re.match(r"^[A-Za-z0-9\s]+$", value):
            raise serializers.ValidationError(
                "La provincia solo puede contener letras y números."
            )
        return value

    def validate_district(self, value):
        if value and not re.match(r"^[A-Za-z0-9\s]+$", value):
            raise serializers.ValidationError(
                "El distrito solo puede contener letras y números."
            )
        return value

    def validate_address(self, value):
        if value and not re.match(r"^[A-Za-z0-9\s,.-]+$", value):
            raise serializers.ValidationError(
                "La dirección solo puede contener letras, números y símbolos básicos (,.-)."
            )
        return value

    def validate_profile_picture(self, value):
        if not value:
            return value
        valid_extensions = ["png", "jpg", "jpeg"]
        ext = str(value).split(".")[-1].lower()
        if ext not in valid_extensions:
            raise serializers.ValidationError(
                "La imagen debe estar en formato PNG, JPG o JPEG."
            )
        return value

    def validate_birth_date(self, value):
        today = date.today()

        # No permitir fechas futuras
        if value > today:
            raise serializers.ValidationError("La fecha de nacimiento no puede ser futura.")

        # Calcular edad
        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
        if age < 18:
            raise serializers.ValidationError("El terapeuta debe tener al menos 18 años.")

        return value