from django.db import models
from .province import Province

class District(models.Model):
    ubigeo_code = models.CharField(max_length=5, unique=True, db_index=True)
    name = models.CharField(max_length=100)
    province = models.ForeignKey(Province, on_delete=models.PROTECT, related_name="districts")

    class Meta:
        ordering = ["name"]
        unique_together = [("province", "name")]
        indexes = [
            models.Index(fields=["province", "name"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.province.name})"
