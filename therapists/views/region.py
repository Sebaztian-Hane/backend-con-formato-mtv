# -*- coding: utf-8 -*-
from rest_framework.viewsets import ReadOnlyModelViewSet
from therapists.models import Region
from therapists.serializers.location import RegionSerializer


class RegionViewSet(ReadOnlyModelViewSet):
    """
    GET /api/regions/           -> lista todas las regiones
    GET /api/regions/{id}/      -> detalle de una región
    """
    queryset = Region.objects.all().order_by("name")
    serializer_class = RegionSerializer
