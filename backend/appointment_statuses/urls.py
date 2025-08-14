from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AppointmentStatusViewSet


router = DefaultRouter()
router.register(r'', AppointmentStatusViewSet, basename='appointment-status')

urlpatterns = [
    path('', include(router.urls)),
] 