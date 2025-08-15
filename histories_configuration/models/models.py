from django.db import models
from django.utils import timezone

# ========================
# MODELOS
# ========================

class DocumentType(models.Model):
    name = models.CharField(
        max_length=255,
        error_messages={
            'max_length': 'El nombre no debe superar los 255 caracteres.'
        }
    )
    description = models.TextField(
        blank=True, null=True,
        error_messages={
            'max_length': 'La descripción no debe superar los 1000 caracteres.'
        }
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    def soft_delete(self):
        self.deleted_at = timezone.now()
        self.save()

    def restore(self):
        self.deleted_at = None
        self.save()

    def __str__(self):
        return self.name

    class Meta:
        db_table = "document_types"


# PACIENTE
class Patient(models.Model):
    name = models.CharField(
        max_length=255,
        error_messages={
            'max_length': 'El nombre no debe superar los 255 caracteres.'
        }
    )
    document_type = models.ForeignKey(DocumentType, on_delete=models.SET_NULL, null=True, blank=True)
    document_number = models.CharField(
        max_length=50,
        blank=True, null=True,
        error_messages={
            'max_length': 'El número de documento no debe superar los 50 caracteres.'
        }
    )
    birth_date = models.DateField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "patients"


# HISTORIA
class History(models.Model):
    testimony = models.TextField(blank=True, null=True)
    private_observation = models.TextField(blank=True, null=True)
    observation = models.TextField(blank=True, null=True)
    height = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    last_weight = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    menstruation = models.BooleanField(default=False)
    diu_type = models.CharField(
        max_length=255,
        blank=True, null=True,
        error_messages={
            'max_length': 'El tipo de DIU no debe superar los 255 caracteres.'
        }
    )
    gestation = models.BooleanField(default=False)

    patient = models.ForeignKey(Patient, related_name="histories", on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    def soft_delete(self):
        self.deleted_at = timezone.now()
        self.save()

    def restore(self):
        self.deleted_at = None
        self.save()

    def __str__(self):
        return f"History for patient {self.patient_id}"

    class Meta:
        db_table = "histories"


# PAYMENT
class PaymentType(models.Model):
    code = models.CharField(
        max_length=50,
        error_messages={
            'max_length': 'El código no debe superar los 50 caracteres.'
        }
    )
    name = models.CharField(
        max_length=255,
        error_messages={
            'max_length': 'El nombre no debe superar los 255 caracteres.'
        }
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    def soft_delete(self):
        self.deleted_at = timezone.now()
        self.save()

    def restore(self):
        self.deleted_at = None
        self.save()

    def __str__(self):
        return self.name

    class Meta:
        db_table = "payment_types"


# PREDETERMINED
class PredeterminedPrice(models.Model):
    name = models.CharField(
        max_length=255,
        error_messages={
            'max_length': 'El nombre no debe superar los 255 caracteres.'
        }
    )
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.price}"

    class Meta:
        db_table = "predetermined_prices"


# APPOINTMENT
class Appointment(models.Model):
    payment_type = models.ForeignKey(PaymentType, related_name="appointments", on_delete=models.CASCADE)
    predetermined_price = models.ForeignKey(PredeterminedPrice, related_name="appointments", on_delete=models.CASCADE, blank=True, null=True)

    date = models.DateTimeField()
    description = models.TextField(
        blank=True, null=True,
        error_messages={
            'max_length': 'La descripción no debe superar los 1000 caracteres.'
        }
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "appointments"
