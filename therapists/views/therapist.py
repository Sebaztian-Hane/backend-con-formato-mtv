# -*- coding: utf-8 -*-
"""
Vistas para la aplicación de terapeutas.
Maneja las operaciones CRUD y renderizado de templates.
"""

from django.shortcuts import render
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response

from therapists.models import Therapist
from therapists.serializers.therapist import TherapistSerializer


class TherapistViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD de terapeutas.
    Incluye:
      - Filtros por estado y por región/provincia/distrito (IDs).
      - Búsqueda por campos.
      - Soft delete y restauración.
    """
    serializer_class = TherapistSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "first_name",
        "last_name_paternal",
        "last_name_maternal",
        "document_number",
        "document_type",
        "email",
        "phone",
        "address",
        # búsqueda por nombres de ubicaciones (FK)
        "region_fk__name",
        "province_fk__name",
        "district_fk__name",
    ]

    def get_queryset(self):
        """
        - Usa select_related para evitar N+1 en las FKs de ubicación.
        - Filtra por activo/inactivo (param 'active').
        - Filtra opcionalmente por IDs de region/province/district.
        """
        qs = (
            Therapist.objects.select_related("region_fk", "province_fk", "district_fk")
            .all()
        )

        # filtro por estado (activo por defecto)
        active = self.request.query_params.get("active", "true").lower()
        if active in ("true", "1", "yes"):
            qs = qs.filter(is_active=True)
        elif active in ("false", "0", "no"):
            qs = qs.filter(is_active=False)

        # filtros por ubicación (IDs)
        region = self.request.query_params.get("region")
        province = self.request.query_params.get("province")
        district = self.request.query_params.get("district")
        if region:
            qs = qs.filter(region_fk_id=region)
        if province:
            qs = qs.filter(province_fk_id=province)
        if district:
            qs = qs.filter(district_fk_id=district)

        return qs

    def destroy(self, request, *args, **kwargs):
        """
        Soft delete - marca como inactivo en lugar de eliminar.
        """
        instance = self.get_object()
        instance.is_active = False
        instance.save(update_fields=["is_active"])
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=["get"])
    def inactive(self, request):
        """
        Endpoint para obtener terapeutas inactivos.
        Respeta paginación y serializer.
        """
        queryset = self.get_queryset().filter(is_active=False)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response(self.get_serializer(queryset, many=True).data)

    @action(detail=True, methods=["post", "patch"])
    def restore(self, request, pk=None):
        """
        Restaura un terapeuta marcándolo como activo.
        """
        try:
            therapist = Therapist.objects.get(pk=pk)
        except Therapist.DoesNotExist:
            return Response({"detail": "No encontrado."}, status=status.HTTP_404_NOT_FOUND)
        therapist.is_active = True
        therapist.save(update_fields=["is_active"])
        return Response(self.get_serializer(therapist).data)


def index(request):
    """
    Vista para renderizar la página principal de terapeutas.
    """
    return render(request, "therapists_ui.html")
