from django.urls import path, include
from rest_framework.routers import DefaultRouter
from views.views import TherapistViewSet

router = DefaultRouter()
router.register(r'therapists', TherapistViewSet, basename='therapist')

urlpatterns = [ path('', include(router.urls)), ]