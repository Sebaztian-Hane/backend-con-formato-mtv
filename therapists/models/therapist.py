from django.db import models
from .region import Region
from .province import Province
from .district import District


class Therapist(models.Model):
    # Opciones de documentos
    DOCUMENT_TYPES = [
        ('DNI', 'DNI'),
        ('CE', 'Carné de Extranjería'),
        ('PTP', 'PTP'),
        ('CR', 'Carné de Refugiado'),
        ('PAS', 'Pasaporte'),
    ]

    GENDERS = [
        ('M', 'Masculino'),
        ('F', 'Femenino'),
        ('O', 'Otro'),
    ]

    STATUS = [
        (True, 'Activo'),
        (False, 'Inactivo'),
    ]

    # Datos personales
    document_type = models.CharField(max_length=10, choices=DOCUMENT_TYPES)
    document_number = models.CharField(max_length=20, unique=True)
    last_name_paternal = models.CharField(max_length=100)
    last_name_maternal = models.CharField(max_length=100, blank=True, null=True)
    first_name = models.CharField(max_length=100)
    birth_date = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDERS)
    personal_reference = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.BooleanField(choices=STATUS, default=True)

    # Información de contacto
    phone = models.CharField(max_length=15)
    email = models.EmailField(blank=True, null=True)

    # Ubicación con FK
    region_fk = models.ForeignKey(Region, on_delete=models.PROTECT, null=True, blank=True, related_name="+")
    province_fk = models.ForeignKey(Province, on_delete=models.PROTECT, null=True, blank=True, related_name="+")
    district_fk = models.ForeignKey(District, on_delete=models.PROTECT, null=True, blank=True, related_name="+")

    address = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to="profile_pictures/",
        blank=True, null=True
    )

    def __str__(self):
        return f"{self.first_name} {self.last_name_paternal} {self.last_name_maternal or ''}"
