from django.apps import AppConfig

class CustomModelsConfig(AppConfig):
    name = 'custom_models'  # este nombre debe coincidir con el app_label que usaste
    verbose_name = 'Custom Models'

    def ready(self):
        import Models.UserVerificationCode  # <-- esto se ejecuta cuando ya es seguro
