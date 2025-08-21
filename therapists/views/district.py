# -*- coding: utf-8 -*-
from rest_framework.viewsets import ReadOnlyModelViewSet
from therapists.models import District
from therapists.serializers.location import DistrictSerializer


class DistrictViewSet(ReadOnlyModelViewSet):
    """
    GET /api/districts/                  -> lista (se puede filtrar)
    GET /api/districts/{id}/             -> detalle

    Filtros por querystring:
      - ?province=<id>           -> distritos de esa provincia
      - ?province_ubigeo=<code>  -> distritos cuyo province.ubigeo_code = code
    """
    serializer_class = DistrictSerializer

    def get_queryset(self):
        qs = (
            District.objects
            .select_related("province", "province__region")
            .order_by("name")
        )
        province_id = self.request.query_params.get("province")
        province_code = self.request.query_params.get("province_ubigeo")
        if province_id:
            qs = qs.filter(province_id=province_id)
        if province_code:
            qs = qs.filter(province__ubigeo_code=province_code)
        return qs
