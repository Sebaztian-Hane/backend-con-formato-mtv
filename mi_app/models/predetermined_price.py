from django.db import models
from django.utils import timezone

class PredeterminedPrice(models.Model):
    name = models.CharField(
        max_length=255,
        error_messages={'max_length': 'El nombre no debe superar los 255 caracteres.'}
    )
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)  # Nuevo campo

    def soft_delete(self):
        self.deleted_at = timezone.now()
        self.save(update_fields=["deleted_at"])

    def restore(self):
        self.deleted_at = None
        self.save(update_fields=["deleted_at"])

    def __str__(self):
        return f"{self.name} - {self.price}"

    class Meta:
        db_table = "predetermined_prices"
