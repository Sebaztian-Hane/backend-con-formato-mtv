# -*- coding: utf-8 -*-
from rest_framework.viewsets import ReadOnlyModelViewSet
from therapists.models import Province
from therapists.serializers.location import ProvinceSerializer


class ProvinceViewSet(ReadOnlyModelViewSet):
    """
    GET /api/provinces/                 -> lista (se puede filtrar)
    GET /api/provinces/{id}/            -> detalle

    Filtros por querystring:
      - ?region=<id>            -> provincias de esa región
      - ?region_ubigeo=<code>   -> provincias cuyo region.ubigeo_code = code
    """
    serializer_class = ProvinceSerializer

    def get_queryset(self):
        qs = Province.objects.select_related("region").order_by("name")
        region_id = self.request.query_params.get("region")
        region_code = self.request.query_params.get("region_ubigeo")
        if region_id:
            qs = qs.filter(region_id=region_id)
        if region_code:
            qs = qs.filter(region__ubigeo_code=region_code)
        return qs
