from rest_framework import viewsets
from .models import Region, Province, District
from .serializers import RegionSerializer, ProvinceSerializer, DistrictSerializer

class RegionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer

class ProvinceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Province.objects.all()
    serializer_class = ProvinceSerializer

    def get_queryset(self):
        region_id = self.request.query_params.get('region_id')
        qs = super().get_queryset()
        if region_id:
            qs = qs.filter(region_id=region_id)
        return qs

class DistrictViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer

    def get_queryset(self):
        province_id = self.request.query_params.get('province_id')
        qs = super().get_queryset()
        if province_id:
            qs = qs.filter(province_id=province_id)
        return qs
