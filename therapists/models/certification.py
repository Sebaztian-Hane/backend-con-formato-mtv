from django.db import models

class Certification(models.Model):
    """
    Modelo para las certificaciones de los terapeutas
    """
    therapist = models.ForeignKey('Therapist', on_delete=models.CASCADE, related_name='certifications')
    name = models.CharField(max_length=200)
    issuing_organization = models.CharField(max_length=200)
    issue_date = models.DateField()
    expiry_date = models.DateField(blank=True, null=True)
    certificate_number = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.therapist}"

    class Meta:
        verbose_name = "Certificación"
        verbose_name_plural = "Certificaciones"
