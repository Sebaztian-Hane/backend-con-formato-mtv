from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class TestRegisterView(APITestCase):
    def test_user_registration(self):
        url = reverse('authentication:register')
        data = {
            "email": "test@example.com",
            "username": "testuser",
            "password": "securepassword123",
            "password_confirm": "securepassword123",
            "first_name": "Juan",
            "last_name": "Pérez",
            "phone": "123456789"
        }
        response = self.client.post(url, data, format='json')
        print(response.status_code, response.data)  # Ayuda para debug
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['email'], data['email'])
        self.assertEqual(response.data['username'], data['username'])
