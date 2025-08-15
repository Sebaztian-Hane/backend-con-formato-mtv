from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from Models.UserVerificationCode import UserVerificationCode
from datetime import timedelta

User = get_user_model()

class EmailVerificationAPITest(APITestCase):
    def setUp(self):
        # 1) Crea un usuario y un token
        self.user = User.objects.create_user(
            username="apiuser",
            email="api@example.com",
            password="testpass"
        )
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

    def test_send_and_verify_code_flow(self):
        # 2) Invoca el endpoint de envío de código
        resp_send = self.client.post("/api/auth/send-verify-email/")
        self.assertEqual(resp_send.status_code, 200)
        self.assertTrue(resp_send.data["success"])

        # 3) Lee el código generado en DB
        code_obj = UserVerificationCode.objects.filter(user=self.user).latest("created_at")
        code = code_obj.code
        self.assertFalse(code_obj.is_expired())

        # 4) Invoca el endpoint de verificación con el código correcto
        resp_verify = self.client.post("/api/auth/verify-email/", {"code": code}, format="json")
        self.assertEqual(resp_verify.status_code, 200)
        self.assertTrue(resp_verify.data["success"])
        self.assertIn("token", resp_verify.data)

    def test_verify_with_invalid_code(self):
        # Primero envía un código (para que exista uno en DB)
        self.client.post("/api/auth/send-verify-email/")
        # Luego intenta verificar con código incorrecto
        resp = self.client.post("/api/auth/verify-email/", {"code": "000000"}, format="json")
        self.assertEqual(resp.status_code, 400)
        self.assertFalse(resp.data.get("success", True))
