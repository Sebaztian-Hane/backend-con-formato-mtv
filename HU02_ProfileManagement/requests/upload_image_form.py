# HU02_ProfileManagement/forms/upload_image_form.py

from django import forms
from PIL import Image

class UploadImageForm(forms.Form):
    """
    Equivalente a UploadImageRequest de Laravel.
    Valida un campo 'logo' con reglas de tipo, tamaño, mime y dimensiones.
    """

    logo = forms.ImageField(
        required=False,  # 'nullable' en Laravel
        error_messages={
            'invalid_image': 'El archivo debe ser una imagen jpeg, png, jpg, gif o webp.',
        }
    )

    def clean_logo(self):
        logo = self.cleaned_data.get('logo')

        if not logo:
            return None  # Permitir sin logo

        # Validar MIME type
        valid_mime_types = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp']
        if logo.content_type not in valid_mime_types:
            raise forms.ValidationError('La imagen debe ser de tipo: jpeg, png, jpg, gif o webp.')

        # Validar tamaño (5MB máximo)
        if logo.size > 5 * 1024 * 1024:
            raise forms.ValidationError('La imagen no debe superar los 5MB.')

        # Validar dimensiones
        try:
            img = Image.open(logo)
            width, height = img.size
        except Exception:
            raise forms.ValidationError('No se pudo procesar la imagen.')

        if width < 100 or height < 100 or width > 2000 or height > 2000:
            raise forms.ValidationError(
                'La imagen debe tener un mínimo de 100x100px y máximo de 2000x2000px.'
            )

        return logo
