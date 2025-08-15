from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from io import BytesIO
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase

User = get_user_model()

def generate_image(width=300, height=300):
    image = Image.new('RGB', (width, height), 'blue')
    byte_io = BytesIO()
    image.save(byte_io, 'JPEG')
    byte_io.name = 'test.jpg'
    byte_io.seek(0)
    return byte_io

class DummyTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='StrongPass123'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_get_profile(self):
        url = reverse('user_profile')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['email'], self.user.email)

    def test_update_profile_fields(self):
        url = reverse('user_profile')
        response = self.client.put(url, {
            'name': 'Nuevo Nombre',
            'phone': '999888777'
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['data']['first_name'], 'Nuevo Nombre')

        # Verifica que el teléfono realmente se guardó
        self.user.refresh_from_db()
        self.assertEqual(self.user.phone, '999888777')

    def test_update_password_with_correct_current(self):
        url = reverse('user_profile')
        response = self.client.put(url, {
            'current_password': 'StrongPass123',
            'password': 'NuevaClave456'
        })
        self.assertEqual(response.status_code, 200)

    def test_update_password_without_current(self):
        url = reverse('user_profile')
        response = self.client.put(url, {
            'password': 'NuevaClave456'
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn('current_password', response.data)

    def test_update_password_with_wrong_current(self):
        url = reverse('user_profile')
        response = self.client.put(url, {
            'current_password': 'incorrecta',
            'password': 'NuevaClave456'
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn('current_password', response.data)

    def test_upload_valid_photo(self):
        img = generate_image()
        url = reverse('upload_user_photo', args=[self.user.id])
        response = self.client.put(url, {'photo': img}, format='multipart')
        self.assertEqual(response.status_code, 200)
        self.assertIn('photo_url', response.data)

    def test_upload_large_photo_fails(self):
        # Genera una imagen simulada de más de 2MB (no importa si no es válida como imagen)
        big_content = b'a' * (2 * 1024 * 1024 + 1)  # 2MB + 1 byte
        big_file = SimpleUploadedFile("big.jpg", big_content, content_type="image/jpeg")

        url = reverse('upload_user_photo', args=[self.user.id])
        response = self.client.put(url, {'photo': big_file}, format='multipart')
        self.assertEqual(response.status_code, 400)
        self.assertIn('photo', response.data)

    def test_show_photo(self):
        img = generate_image()
        upload_url = reverse('upload_user_photo', args=[self.user.id])
        self.client.put(upload_url, {'photo': img}, format='multipart')

        show_url = reverse('show_user_photo', args=[self.user.id])
        response = self.client.get(show_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'image/jpeg')

    def test_delete_photo(self):
        img = generate_image()
        upload_url = reverse('upload_user_photo', args=[self.user.id])
        self.client.put(upload_url, {'photo': img}, format='multipart')

        delete_url = reverse('delete_user_photo', args=[self.user.id])
        response = self.client.delete(delete_url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('Foto eliminada correctamente', response.data['message'])
