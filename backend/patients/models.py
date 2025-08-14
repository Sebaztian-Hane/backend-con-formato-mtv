
from django.db import models
from ubigeo.models import Region, Province, District

class Patient(models.Model):
    country_id = models.IntegerField(null=True, blank=True, default=1)
    region = models.ForeignKey(Region, null=True, blank=True, on_delete=models.SET_NULL)
    province = models.ForeignKey(Province, null=True, blank=True, on_delete=models.SET_NULL)
    district = models.ForeignKey(District, null=True, blank=True, on_delete=models.SET_NULL)
    DOCUMENT_TYPE_CHOICES = [
        ('DNI', 'DNI'),
        ('CE', 'Carnet de Extranjería'),
        ('PAS', 'Pasaporte'),
        ('OTRO', 'Otro'),
    ]
    SEX_CHOICES = [
        ('M', 'Masculino'),
        ('F', 'Femenino'),
        ('O', 'Otro'),
    ]

    document_type = models.CharField(max_length=10, choices=DOCUMENT_TYPE_CHOICES,default='DNI')
    document_number = models.CharField(max_length=50, unique=True)
    last_name = models.CharField(max_length=100, null=True, blank=True) 
    mother_last_name = models.CharField(max_length=100, null=True, blank=True)  
    first_name = models.CharField(max_length=100, null=True, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    sex = models.CharField(max_length=1, choices=SEX_CHOICES, null=True, blank=True)
    occupation = models.CharField(max_length=100, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'patients'
        ordering = ['last_name', 'mother_last_name', 'first_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name} {self.mother_last_name} ({self.document_type}-{self.document_number})"
