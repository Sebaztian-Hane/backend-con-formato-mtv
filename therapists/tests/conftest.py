import pytest
from rest_framework.test import APIClient
from therapists.models import Therapist

@pytest.fixture
def api_client():
    """Cliente de pruebas de la API"""
    return APIClient()

@pytest.fixture
def therapist_data():
    """Datos de un terapeuta de prueba"""
    return {
        "first_name": "Ana",
        "last_name_paternal": "Gómez",
        "last_name_maternal": "López",
        "document_number": "87654321",
        "document_type": "DNI",
        "birth_date": "1990-05-15",
        "gender": "Femenino",
        "email": "ana@example.com",
        "phone": "987654321",
        "country": "Perú",
        "address": "Av. Siempre Viva 123",
        "department": "Lima",
        "province": "Lima",
        "district": "Miraflores",
        "personal_reference": None,
        "profile_picture": None,
    }

@pytest.fixture
def therapist(db, therapist_data):
    """Crea y guarda un terapeuta en la base"""
    return Therapist.objects.create(**therapist_data)
