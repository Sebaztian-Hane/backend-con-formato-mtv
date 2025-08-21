from django.db import models

class Region(models.Model):
    ubigeo_code = models.CharField(max_length=2, unique=True, db_index=True)
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name
