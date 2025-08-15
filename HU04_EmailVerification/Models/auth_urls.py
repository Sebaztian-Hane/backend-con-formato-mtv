# Models/auth_urls.py
from django.urls import path
# Importa directamente desde Views.home (que según lo que compartiste sí existe)
from Views.home import send_verify_email, verify_email

app_name = "models_auth"

urlpatterns = [
    path("send-verify-email/", send_verify_email, name="send-verify-email"),
    path("verify-email/", verify_email, name="verify-email"),
]
