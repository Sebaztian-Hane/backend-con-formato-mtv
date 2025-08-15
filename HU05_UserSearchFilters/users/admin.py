from django.contrib import admin

from models.profile import Profile  # Ajusta el import a tu modelo real

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'documento', 'rol']
