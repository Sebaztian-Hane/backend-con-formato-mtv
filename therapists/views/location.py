from rest_framework.viewsets import ReadOnlyModelViewSet
from therapists.models import Region, Province, District
from therapists.serializers.location import RegionSerializer, ProvinceSerializer, DistrictSerializer

class RegionViewSet(ReadOnlyModelViewSet):
    queryset = Region.objects.all().order_by("name")
    serializer_class = RegionSerializer

class ProvinceViewSet(ReadOnlyModelViewSet):
    serializer_class = ProvinceSerializer

    def get_queryset(self):
        qs = Province.objects.select_related("region").order_by("name")
        region_id = self.request.query_params.get("region")
        region_code = self.request.query_params.get("region_ubigeo")
        if region_id:
            qs = qs.filter(region_id=region_id)
        elif region_code:
            qs = qs.filter(region__ubigeo_code=region_code)
        return qs

class DistrictViewSet(ReadOnlyModelViewSet):
    serializer_class = DistrictSerializer

    def get_queryset(self):
        qs = District.objects.select_related("province", "province__region").order_by("name")
        province_id = self.request.query_params.get("province")
        province_code = self.request.query_params.get("province_ubigeo")
        if province_id:
            qs = qs.filter(province_id=province_id)
        elif province_code:
            qs = qs.filter(province__ubigeo_code=province_code)
        return qs
