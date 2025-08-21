from django.db import models
from .region import Region

class Province(models.Model):
    ubigeo_code = models.CharField(max_length=3, unique=True, db_index=True)
    name = models.CharField(max_length=100)
    region = models.ForeignKey(Region, on_delete=models.PROTECT, related_name="provinces")

    class Meta:
        ordering = ["name"]
        unique_together = [("region", "name")]
        indexes = [
            models.Index(fields=["region", "name"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.region.name})"
