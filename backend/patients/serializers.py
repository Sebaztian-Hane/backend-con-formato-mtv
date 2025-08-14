
from rest_framework import serializers
from .models import Patient
from ubigeo.models import Region, Province, District


class PatientSerializer(serializers.ModelSerializer):
    region_name = serializers.SerializerMethodField()
    province_name = serializers.SerializerMethodField()
    district_name = serializers.SerializerMethodField()
    document_type_id = serializers.CharField(source='document_type')
    paternal_lastname = serializers.CharField(source='last_name')
    maternal_lastname = serializers.CharField(source='mother_last_name')
    name = serializers.CharField(source='first_name')
    primary_phone = serializers.CharField(source='phone')

    region_id = serializers.PrimaryKeyRelatedField(
        queryset=Region.objects.all(), source='region', write_only=True, required=False, allow_null=True
    )
    province_id = serializers.PrimaryKeyRelatedField(
        queryset=Province.objects.all(), source='province', write_only=True, required=False, allow_null=True
    )
    district_id = serializers.PrimaryKeyRelatedField(
        queryset=District.objects.all(), source='district', write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Patient
        fields = [
            'id',
            'document_type_id',
            'document_number',
            'paternal_lastname',
            'maternal_lastname',
            'name',
            'birth_date',
            'sex',
            'occupation',
            'primary_phone',
            'email',
            'country_id',
            'region_id',
            'region_name',
            'province_id',
            'province_name',
            'district_id',
            'district_name',
            'created_at',
            'updated_at',
            'deleted_at',
        ]
        read_only_fields = ('id', 'created_at', 'updated_at', 'deleted_at')

    def get_region_name(self, obj):
        return obj.region.name if obj.region else None

    def get_province_name(self, obj):
        return obj.province.name if obj.province else None

    def get_district_name(self, obj):
        return obj.district.name if obj.district else None

