from rest_framework import serializers
from therapists.models import Region, Province, District

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ("id", "ubigeo_code", "name")

class ProvinceSerializer(serializers.ModelSerializer):
    region = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Province
        fields = ("id", "ubigeo_code", "name", "region")

class DistrictSerializer(serializers.ModelSerializer):
    province = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = District
        fields = ("id", "ubigeo_code", "name", "province")
