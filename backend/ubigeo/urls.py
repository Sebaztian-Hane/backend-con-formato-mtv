from rest_framework.routers import DefaultRouter
from .views import RegionViewSet, ProvinceViewSet, DistrictViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'regions', RegionViewSet, basename='region')
router.register(r'provinces', ProvinceViewSet, basename='province')
router.register(r'districts', DistrictViewSet, basename='district')

urlpatterns = [
    path('', include(router.urls)),
]
