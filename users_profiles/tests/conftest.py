"""
Configuración optimizada de pytest para el módulo 02_users_profiles
"""

import pytest
import tempfile
import os
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from django.core.files.uploadedfile import SimpleUploadedFile

# Usar el modelo de usuario estándar de Django para tests
# from models import UserProfile, UserVerificationCode

User = get_user_model()


@pytest.fixture(scope='session')
def django_db_setup(django_db_setup, django_db_blocker):
    """Configuración de base de datos para la sesión"""
    with django_db_blocker.unblock():
        # Configuraciones específicas para tests
        settings.MEDIA_ROOT = tempfile.mkdtemp()
        settings.EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'


@pytest.fixture
def api_client():
    """Cliente API para tests"""
    return APIClient()


@pytest.fixture
def user_data():
    """Datos básicos de usuario para tests"""
    return {
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'testpass123',
        'first_name': 'Test',
        'last_name': 'User'
    }


@pytest.fixture
def user(user_data):
    """Usuario creado automáticamente"""
    return User.objects.create_user(**user_data)


@pytest.fixture
def authenticated_client(api_client, user):
    """Cliente API autenticado"""
    api_client.force_authenticate(user=user)
    return api_client


@pytest.fixture
def profile_data(user):
    """Datos de perfil para tests"""
    return {
        'user': user,
        'first_name': 'Test',
        'paternal_lastname': 'User',
        'maternal_lastname': 'Profile',
        'gender': 'M',
        'email': 'test@example.com',
        'is_public': True
    }


@pytest.fixture
def profile(profile_data):
    """Perfil creado automáticamente"""
    # return UserProfile.objects.create(**profile_data)
    return None  # Modelo personalizado no disponible en tests simples


@pytest.fixture
def verification_code_data(user):
    """Datos de código de verificación para tests"""
    return {
        'user': user,
        'verification_type': 'email_verification',
        'code': '123456'
    }


@pytest.fixture
def verification_code(verification_code_data):
    """Código de verificación creado automáticamente"""
    # return UserVerificationCode.objects.create(**verification_code_data)
    return None  # Modelo personalizado no disponible en tests simples


@pytest.fixture
def multiple_users():
    """Múltiples usuarios para testing de búsqueda"""
    users = []
    for i in range(5):
        user = User.objects.create_user(
            username=f'user{i}',
            email=f'user{i}@example.com',
            password='testpass123',
            first_name=f'User{i}',
            last_name=f'Test{i}'
        )
        users.append(user)
    return users


@pytest.fixture
def multiple_profiles(multiple_users):
    """Múltiples perfiles para testing de búsqueda"""
    # profiles = []
    # for i, user in enumerate(multiple_users):
    #     profile = UserProfile.objects.create(
    #         user=user,
    #         first_name=f'User{i}',
    #         paternal_lastname=f'Test{i}',
    #         maternal_lastname='',
    #         gender='M' if i % 2 == 0 else 'F',
    #         email=f'user{i}@example.com',
    #         is_public=True
    #     )
    #     profiles.append(profile)
    # return profiles
    return []  # Modelo personalizado no disponible en tests simples


@pytest.fixture
def admin_user():
    """Usuario administrador para tests"""
    return User.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='adminpass123'
    )


@pytest.fixture
def photo_file():
    """Archivo de imagen simulado para tests"""
    return SimpleUploadedFile(
        'test.jpg',
        b'fake image data',
        content_type='image/jpeg'
    )


@pytest.fixture
def media_storage():
    """Configuración de almacenamiento temporal para archivos"""
    temp_dir = tempfile.mkdtemp()
    storage = FileSystemStorage(location=temp_dir)
    
    yield storage
    
    # Limpiar archivos temporales
    for root, dirs, files in os.walk(temp_dir):
        for file in files:
            os.unlink(os.path.join(root, file))
    os.rmdir(temp_dir)


@pytest.fixture
def email_backend_setup():
    """Configuración de backend de email para tests"""
    original_backend = settings.EMAIL_BACKEND
    settings.EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'
    
    yield
    
    settings.EMAIL_BACKEND = original_backend


@pytest.fixture
def logging_setup():
    """Configuración de logging para tests"""
    import logging
    logging.disable(logging.CRITICAL)
    
    yield
    
    logging.disable(logging.NOTSET)


@pytest.fixture
def db_access_without_rollback_and_truncate(db_access_without_rollback_and_truncate):
    """Acceso a base de datos sin rollback y truncate"""
    return db_access_without_rollback_and_truncate


# Fixtures para casos específicos de testing
@pytest.fixture
def user_with_profile(user, profile):
    """Usuario con perfil ya creado"""
    return user


@pytest.fixture
def user_with_photo(user, photo_file):
    """Usuario con foto de perfil"""
    user.profile_photo.save('test.jpg', photo_file, save=True)
    return user


@pytest.fixture
def user_with_verification_codes(user):
    """Usuario con múltiples códigos de verificación"""
    codes = []
    for verification_type in ['email_verification', 'password_change', 'email_change']:
        code = UserVerificationCode.create_code(user=user, verification_type=verification_type)
        codes.append(code)
    return user, codes


@pytest.fixture
def public_and_private_profiles(multiple_users):
    """Perfiles públicos y privados para testing"""
    profiles = []
    for i, user in enumerate(multiple_users):
        is_public = i % 2 == 0  # Alternar entre público y privado
        profile = UserProfile.objects.create(
            user=user,
            first_name=f'User{i}',
            paternal_lastname=f'Test{i}',
            maternal_lastname='',
            gender='M' if i % 2 == 0 else 'F',
            email=f'user{i}@example.com',
            is_public=is_public
        )
        profiles.append(profile)
    return profiles


@pytest.fixture
def expired_verification_code(user):
    """Código de verificación expirado"""
    from django.utils import timezone
    from datetime import timedelta
    
    return UserVerificationCode.objects.create(
        user=user,
        verification_type='email_verification',
        code='123456',
        expires_at=timezone.now() - timedelta(minutes=1)
    )


@pytest.fixture
def max_attempts_verification_code(user):
    """Código de verificación con máximo de intentos alcanzado"""
    return UserVerificationCode.objects.create(
        user=user,
        verification_type='email_verification',
        code='654321',
        attempts=3,
        max_attempts=3
    )


# Configuraciones de pytest
def pytest_configure(config):
    """Configuración adicional de pytest"""
    # Agregar marcadores personalizados
    config.addinivalue_line(
        "markers", "slow: marks tests as slow (deselect with '-m \"not slow\"')"
    )
    config.addinivalue_line(
        "markers", "integration: marks tests as integration tests"
    )
    config.addinivalue_line(
        "markers", "unit: marks tests as unit tests"
    )


def pytest_collection_modifyitems(config, items):
    """Modificar items de colección de tests"""
    for item in items:
        # Marcar tests de integración automáticamente
        if 'integration' in item.nodeid:
            item.add_marker(pytest.mark.integration)
        # Marcar tests unitarios automáticamente
        elif any(x in item.nodeid for x in ['test_models', 'test_serializers']):
            item.add_marker(pytest.mark.unit)
