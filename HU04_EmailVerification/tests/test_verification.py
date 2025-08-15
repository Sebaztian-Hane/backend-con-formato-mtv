from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from Models.UserVerificationCode import UserVerificationCode
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

class EmailVerificationAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="apiuser",
            email="api@example.com",
            password="testpass"
        )
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

    def test_send_and_verify_code(self):
        # 1) send
        resp1 = self.client.post("/api/auth/send-verify-email/")
        self.assertEqual(resp1.status_code, 200)
        self.assertTrue(resp1.data["success"])

        # 2) fetch the code from DB
        code_obj = UserVerificationCode.objects.filter(user=self.user).latest("created_at")
        code = code_obj.code

        # 3) verify
        resp2 = self.client.post("/api/auth/verify-email/", {"code": code}, format="json")
        self.assertEqual(resp2.status_code, 200)
        self.assertTrue(resp2.data["success"])
        self.assertIn("token", resp2.data)
