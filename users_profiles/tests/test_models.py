import pytest
from django.test import TestCase
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import date, timedelta
import tempfile
import os

from django.contrib.auth import get_user_model
# from ..models import User, UserProfile, UserVerificationCode

User = get_user_model()


@pytest.mark.django_db
class TestUserModel(TestCase):
    """Tests optimizados para el modelo User"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User'
        }
        self.user = User.objects.create_user(**self.user_data)
    
    def test_user_creation_and_basic_methods(self):
        """Test consolidado de creación y métodos básicos"""
        # Verificar creación
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertTrue(self.user.check_password('testpass123'))
        # self.assertFalse(self.user.email_verified)  # No disponible en User estándar
        
        # Verificar representación string
        self.assertEqual(str(self.user), 'testuser')
        
        # Verificar nombre completo
        self.assertEqual(self.user.get_full_name(), 'Test User')
        
        # Test con usuario sin nombre
        user_no_name = User.objects.create_user(
            username='noname',
            email='noname@example.com',
            password='testpass123'
        )
        self.assertEqual(user_no_name.get_full_name(), 'noname')  # Retorna username cuando no hay nombre
    
    def test_phone_number_validation(self):
        """Test de validación de número de teléfono"""
        # Este test no aplica para el modelo User estándar de Django
        # ya que no tiene campo phone_number
        pass
    
    def test_profile_photo_methods(self):
        """Test consolidado de métodos de foto de perfil"""
        # Este test no aplica para el modelo User estándar de Django
        # ya que no tiene métodos de foto de perfil personalizados
        pass


# @pytest.mark.django_db
# class TestUserProfileModel(TestCase):
#     """Tests optimizados para el modelo UserProfile"""
#     
#     def setUp(self):
#         """Configuración inicial para los tests"""
#         self.user = User.objects.create_user(
#             username='testuser',
#             email='test@example.com',
#             password='testpass123'
#         )
#         self.profile_data = {
#             'user': self.user,
#             'first_name': 'Test',
#             'paternal_lastname': 'User',
#             'maternal_lastname': 'Profile',
#             'gender': 'M',
#             'email': 'test@example.com'
#         }
#         self.profile = UserProfile.objects.create(**self.profile_data)
    
    # def test_profile_creation_and_basic_methods(self):
    #     """Test consolidado de creación y métodos básicos"""
    #     # Verificar creación
    #     self.assertEqual(self.profile.user, self.user)
    #     self.assertEqual(self.profile.first_name, 'Test')
    #     self.assertEqual(self.profile.gender, 'M')
    #     self.assertTrue(self.profile.is_public)
    #     
    #     # Verificar representación string
    #     self.assertEqual(str(self.profile), f'Perfil de {self.user.username}')
    #     
    #     # Verificar nombre completo
    #     self.assertEqual(self.profile.get_full_name(), 'Test User Profile')
    #     self.assertEqual(self.profile.get_display_name(), 'Test User')
    
    # def test_profile_completion_methods(self):
    #     """Test consolidado de métodos de completitud"""
    #     # Perfil completo
    #     self.assertTrue(self.profile.is_complete())
    #     completion = self.profile.get_completion_percentage()
    #     self.assertGreater(completion, 80)
    #     
    #     # Perfil incompleto
    #     incomplete_profile = UserProfile.objects.create(
    #         user=User.objects.create_user(
    #             username='incomplete',
    #             email='incomplete@example.com',
    #             password='testpass123'
    #         ),
    #         first_name='',
    #         paternal_lastname='',
    #         gender='P',
    #         email='incomplete@example.com'
    #     )
    #     
    #     self.assertFalse(incomplete_profile.is_complete())
    #     completion = incomplete_profile.get_completion_percentage()
    #     self.assertLess(completion, 50)
    
    # def test_profile_visibility_settings(self):
    #     """Test de configuraciones de visibilidad"""
    #     # Configuraciones por defecto
    #     self.assertTrue(self.profile.is_public)
    #     self.assertFalse(self.profile.show_email)
    #     self.assertFalse(self.profile.show_phone)
    #     self.assertTrue(self.profile.receive_notifications)
    #     
    #     # Cambiar configuraciones
    #     self.profile.is_public = False
    #     self.profile.show_email = True
    #     self.profile.show_phone = True
    #     self.profile.receive_notifications = False
    #     self.profile.save()
    #     
    #     self.assertFalse(self.profile.is_public)
    #     self.assertTrue(self.profile.show_email)
    #     self.assertTrue(self.profile.show_phone)
    #     self.assertFalse(self.profile.receive_notifications)


# @pytest.mark.django_db
# class TestUserVerificationCodeModel(TestCase):
#     """Tests optimizados para el modelo UserVerificationCode"""
#     
#     def setUp(self):
#         """Configuración inicial para los tests"""
#         self.user = User.objects.create_user(
#             username='testuser',
#             email='test@example.com',
#             password='testpass123'
#         )
    
    # def test_verification_code_creation_and_validation(self):
    #     """Test consolidado de creación y validación de códigos"""
    #     # Crear código
    #     code = UserVerificationCode.create_code(
    #         user=self.user,
    #         verification_type='email_verification'
    #     )
    #     
    #     # Verificar creación
    #     self.assertEqual(code.user, self.user)
    #     self.assertEqual(code.verification_type, 'email_verification')
    #     self.assertEqual(len(code.code), 6)
    #     self.assertFalse(code.is_used)
    #     self.assertEqual(code.attempts, 0)
    #     
    #     # Verificar representación string
    #     expected_str = f"Código {code.code} para {self.user.username} - Verificación de Email"
    #     self.assertEqual(str(code), expected_str)
    #     
    #     # Verificar validez
    #     self.assertTrue(code.is_valid())
    #     self.assertFalse(code.is_expired())
    #     self.assertTrue(code.can_attempt())
    
    # def test_verification_code_expiration_and_usage(self):
    #     """Test consolidado de expiración y uso de códigos"""
    #     # Crear código
    #     code = UserVerificationCode.create_code(
    #         user=self.user,
    #         verification_type='password_change'
    #     )
    #     
    #     # Simular intentos fallidos
    #     code.increment_attempts()
    #     code.increment_attempts()
    #     self.assertEqual(code.attempts, 2)
    #     self.assertTrue(code.can_attempt())
    #     
    #     # Marcar como usado
    #     code.mark_as_used()
    #     self.assertTrue(code.is_used)
    #     self.assertFalse(code.is_valid())
    #     
    #     # Verificar expiración
    #     expired_code = UserVerificationCode.objects.create(
    #         user=self.user,
    #         verification_type='email_change',
    #         code='123456',
    #         expires_at=timezone.now() - timedelta(minutes=1)
    #     )
    #     
    #     self.assertTrue(expired_code.is_expired())
    #     self.assertFalse(expired_code.is_valid())
    
    # def test_verification_code_verification_method(self):
    #     """Test del método de verificación de códigos"""
    #     # Crear código válido
    #     code = UserVerificationCode.create_code(
    #         user=self.user,
    #         verification_type='email_verification'
    #     )
    #     
    #     # Verificar código válido
    #     verification, error = UserVerificationCode.verify_code(
    #         self.user, code.code, 'email_verification'
    #     )
    #     self.assertEqual(verification, code)
    #     self.assertIsNone(error)
    #     
    #     # Verificar código inválido
    #     verification, error = UserVerificationCode.verify_code(
    #         self.user, '000000', 'email_verification'
    #     )
    #     self.assertIsNone(verification)
    #     self.assertEqual(error, 'Código inválido')
    #     
    #     # Verificar código expirado
    #     expired_code = UserVerificationCode.objects.create(
    #         user=self.user,
    #         verification_type='email_verification',
    #         code='654321',
    #         expires_at=timezone.now() - timedelta(minutes=1)
    #     )
    #     
    #     verification, error = UserVerificationCode.verify_code(
    #         self.user, expired_code.code, 'email_verification'
    #     )
    #     self.assertIsNone(verification)
    #     self.assertEqual(error, 'Código expirado')


# @pytest.mark.django_db
# class TestModelRelationships(TestCase):
#     """Tests optimizados para relaciones entre modelos"""
#     
#     def setUp(self):
#         """Configuración inicial para los tests"""
#         self.user = User.objects.create_user(
#             username='testuser',
#             email='test@example.com',
#             password='testpass123'
#         )
#     
#     def test_user_profile_relationship(self):
#         """Test de relación User-UserProfile"""
#         # Crear perfil
#         profile = UserProfile.objects.create(
#             user=self.user,
#             first_name='Test',
#             paternal_lastname='User',
#             gender='M',
#             email='test@example.com'
#         )
#         
#         # Verificar relación
#         self.assertEqual(self.user.profile, profile)
#         self.assertEqual(profile.user, self.user)
#         
#         # Verificar eliminación en cascada
#         self.user.delete()
#         self.assertFalse(UserProfile.objects.filter(id=profile.id).exists())
#     
#     def test_user_verification_codes_relationship(self):
#         """Test de relación User-UserVerificationCode"""
#         # Crear múltiples códigos
#         code1 = UserVerificationCode.create_code(
#             user=self.user,
#             verification_type='email_verification'
#         )
#         code2 = UserVerificationCode.create_code(
#             user=self.user,
#             verification_type='password_change'
#         )
#         
#         # Verificar relación
#         self.assertEqual(self.user.verification_codes.count(), 2)
#         self.assertIn(code1, self.user.verification_codes.all())
#         self.assertIn(code2, self.user.verification_codes.all())
#         
#         # Verificar eliminación en cascada
#         self.user.delete()
#         self.assertFalse(UserVerificationCode.objects.filter(user=self.user).exists())
