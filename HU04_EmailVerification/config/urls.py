from django.contrib import admin
from django.urls import path, include
from Views.home import home, send_verify_email, verify_email  # vista que devuelve la plantilla home.html

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", home, name="home"),  # página principal con el formulario
    path("api/auth/", include("Models.auth_urls")),
    path("api/auth/send-verify-email/", send_verify_email, name="send-verify-email"),
    path("api/auth/verify-email/", verify_email, name="verify-email"),  # incluye send/verify endpoints
]
