from rest_framework.routers import DefaultRouter
from views.views import RoomViewSet

router = DefaultRouter()
router.register(r'', RoomViewSet, basename='room')

urlpatterns = router.urls