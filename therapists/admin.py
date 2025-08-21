from django.contrib import admin
from therapists.models import Region, Province, District, Therapist

@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ("id","ubigeo_code","name")
    search_fields = ("ubigeo_code","name")

@admin.register(Province)
class ProvinceAdmin(admin.ModelAdmin):
    list_display = ("id","ubigeo_code","name","region")
    list_filter = ("region",)
    search_fields = ("ubigeo_code","name","region__name")

@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    list_display = ("id","ubigeo_code","name","province")
    list_filter = ("province__region","province")
    search_fields = ("ubigeo_code","name","province__name","province__region__name")

@admin.register(Therapist)
class TherapistAdmin(admin.ModelAdmin):
    list_display = ("id","first_name","last_name_paternal","document_number","region_fk","province_fk","district_fk","is_active")
    list_filter = ("is_active","region_fk","province_fk","district_fk")
    search_fields = ("first_name","last_name_paternal","last_name_maternal","document_number")
