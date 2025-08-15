"""
URL configuration for appointments project.
"""
from django.contrib import admin
from django.urls import path, include
from document_types import DocumentTypeList
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('api/document-types', DocumentTypeList.as_view()),
    path('admin/', admin.site.urls),
    path('api/appointments/', include('appointments.urls')),
    path('api/appointment-statuses/', include('appointment_statuses.urls')),
    path('api/tickets/', include('tickets.urls')),
    path('api/rooms/', include('rooms.urls')),
    path('api/patients/', include('patients.urls')),
    path('api/ubigeo/', include('ubigeo.urls')),
]

# Serve static and media files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 
