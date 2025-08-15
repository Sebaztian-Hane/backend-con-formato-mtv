from django.db import models

class Therapist(models.Model):
    document = models.CharField(max_length=9, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    license_number = models.CharField(max_length=20)
    years_experience = models.IntegerField()
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    address = models.TextField()
    rate = models.DecimalField(max_digits=8, decimal_places=2)
    is_active = models.BooleanField(default=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"