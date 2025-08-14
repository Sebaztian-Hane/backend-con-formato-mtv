from django.db import models

class Region(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Province(models.Model):
    name = models.CharField(max_length=100)
    region = models.ForeignKey(Region, related_name='provinces', on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class District(models.Model):
    name = models.CharField(max_length=100)
    province = models.ForeignKey(Province, related_name='districts', on_delete=models.CASCADE)

    def __str__(self):
        return self.name
