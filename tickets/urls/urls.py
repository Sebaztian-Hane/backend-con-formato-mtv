from django.urls import path
from rest_framework.routers import DefaultRouter
from views.views import AvailableTicketsView, NextRoomNumberView, NextTicketNumberView, TicketViewSet

router = DefaultRouter()
router.register(r'', TicketViewSet, basename='ticket')

urlpatterns = [
    path('available/', AvailableTicketsView.as_view(), name='available-tickets'),
    path('next-room/', NextRoomNumberView.as_view(), name='next-room-number'),
    path('next-ticket/', NextTicketNumberView.as_view(), name='next-ticket-number'),
]

urlpatterns += router.urls