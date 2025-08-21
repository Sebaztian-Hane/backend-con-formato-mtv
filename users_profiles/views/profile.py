from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from ..models import UserProfile
from ..serializers.profile import (
    ProfileSerializer, ProfileUpdateSerializer, ProfileCreateSerializer,
    PublicProfileSerializer, ProfileSettingsSerializer
)
from django.db import models


class ProfileDetailView(generics.RetrieveUpdateAPIView):
    """Vista para obtener y actualizar el perfil del usuario autenticado"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        """Retorna el serializer apropiado según el método HTTP"""
        if self.request.method == 'GET':
            return ProfileSerializer
        return ProfileUpdateSerializer
    
    def get_object(self):
        """Obtiene o crea el perfil del usuario"""
        profile, created = UserProfile.objects.get_or_create(
            user=self.request.user,
            defaults={
                'first_name': self.request.user.first_name or '',
                'paternal_lastname': self.request.user.last_name or '',
                'maternal_lastname': '',
                'email': self.request.user.email,
                'gender': 'P'
            }
        )
        return profile
    
    def update(self, request, *args, **kwargs):
        """Actualiza el perfil del usuario"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response({
            'message': 'Perfil actualizado exitosamente',
            'profile': ProfileSerializer(instance, context={'request': request}).data
        })


class ProfileCreateView(generics.CreateAPIView):
    """Vista para crear un perfil de usuario"""
    
    serializer_class = ProfileCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        """Crea el perfil asociado al usuario autenticado"""
        serializer.save(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        """Crea el perfil y retorna la respuesta"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response({
            'message': 'Perfil creado exitosamente',
            'profile': ProfileSerializer(serializer.instance, context={'request': request}).data
        }, status=status.HTTP_201_CREATED)


class PublicProfileView(generics.RetrieveAPIView):
    """Vista para obtener perfiles públicos de usuarios"""
    
    serializer_class = PublicProfileSerializer
    permission_classes = [permissions.AllowAny]
    queryset = UserProfile.objects.filter(is_public=True)
    
    def get_object(self):
        """Retorna el perfil por username"""
        username = self.kwargs.get('username')
        return get_object_or_404(
            UserProfile,
            user__username=username,
            is_public=True
        )


class ProfileSettingsView(generics.UpdateAPIView):
    """Vista para actualizar configuraciones del perfil"""
    
    serializer_class = ProfileSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        """Obtiene el perfil del usuario"""
        profile, created = UserProfile.objects.get_or_create(
            user=self.request.user,
            defaults={
                'first_name': self.request.user.first_name or '',
                'paternal_lastname': self.request.user.last_name or '',
                'maternal_lastname': '',
                'email': self.request.user.email,
                'gender': 'P'
            }
        )
        return profile
    
    def update(self, request, *args, **kwargs):
        """Actualiza las configuraciones del perfil"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response({
            'message': 'Configuraciones del perfil actualizadas exitosamente',
            'settings': ProfileSettingsSerializer(instance).data
        })


class ProfileCompletionView(APIView):
    """Vista para obtener el porcentaje de completitud del perfil"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Retorna el porcentaje de completitud del perfil"""
        profile, created = UserProfile.objects.get_or_create(
            user=request.user,
            defaults={
                'first_name': request.user.first_name or '',
                'paternal_lastname': request.user.last_name or '',
                'maternal_lastname': '',
                'email': request.user.email,
                'gender': 'P'
            }
        )
        
        completion_percentage = profile.get_completion_percentage()
        
        return Response({
            'completion_percentage': completion_percentage,
            'is_complete': profile.is_complete(),
            'missing_fields': self._get_missing_fields(profile)
        })
    
    def _get_missing_fields(self, profile):
        """Retorna los campos que faltan para completar el perfil"""
        missing = []
        
        if not profile.first_name:
            missing.append('first_name')
        if not profile.paternal_lastname:
            missing.append('paternal_lastname')
        if not profile.gender or profile.gender == 'P':
            missing.append('gender')
        if not profile.user.profile_photo:
            missing.append('profile_photo')
        
        return missing


class ProfileSearchView(generics.ListAPIView):
    """Vista para buscar perfiles públicos"""
    
    serializer_class = PublicProfileSerializer
    permission_classes = [permissions.AllowAny]
    queryset = UserProfile.objects.filter(is_public=True)
    
    def get_queryset(self):
        """Filtra perfiles según parámetros de búsqueda"""
        queryset = super().get_queryset()
        
        # Búsqueda por nombre
        name_query = self.request.query_params.get('name', None)
        if name_query:
            queryset = queryset.filter(
                models.Q(first_name__icontains=name_query) |
                models.Q(paternal_lastname__icontains=name_query) |
                models.Q(maternal_lastname__icontains=name_query)
            )
        
        # Filtro por género
        gender = self.request.query_params.get('gender', None)
        if gender:
            queryset = queryset.filter(gender=gender)
        
        # Filtro por país
        country = self.request.query_params.get('country', None)
        if country:
            queryset = queryset.filter(user__country__icontains=country)
        
        # Filtro por ciudad
        city = self.request.query_params.get('city', None)
        if city:
            queryset = queryset.filter(user__city__icontains=city)
        
        return queryset[:50]  # Limitar a 50 resultados
