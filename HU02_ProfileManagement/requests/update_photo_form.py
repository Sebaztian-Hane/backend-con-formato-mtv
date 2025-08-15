# HU02_ProfileManagement/forms/update_photo_form.py

from django import forms
from PIL import Image

class UpdatePhotoForm(forms.Form):
    """
    Formulario para actualizar la foto de perfil.
    Equivalente a UpdatePhotoRequest de Laravel.
    """

    photo = forms.ImageField(
        required=False,  # Permitir eliminar foto (nullable)
        error_messages={
            'invalid_image': 'El archivo debe ser una imagen válida.',
        }
    )

    def clean_photo(self):
        """
        Reglas de validación aplicadas al campo photo.
        Equivalente a rules() + messages() en Laravel.
        """
        photo = self.cleaned_data.get('photo')

        # Permitir que la foto sea null (equivale a 'nullable')
        if not photo:
            return None

        # Validar tipo MIME (equivalente a mimes:jpeg,png,...)
        valid_mime_types = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp']
        if photo.content_type not in valid_mime_types:
            raise forms.ValidationError(
                'La imagen debe ser de tipo: jpeg, png, jpg, gif o webp.'
            )

        # Validar tamaño (max:5120 KB = 5MB)
        max_size_bytes = 5 * 1024 * 1024
        if photo.size > max_size_bytes:
            raise forms.ValidationError('La imagen no debe superar los 5MB.')

        # Validar dimensiones (100x100 min, 2000x2000 max)
        try:
            image = Image.open(photo)
            width, height = image.size
        except Exception:
            raise forms.ValidationError('El archivo debe ser una imagen válida.')

        if width < 100 or height < 100 or width > 2000 or height > 2000:
            raise forms.ValidationError(
                'La imagen debe tener un mínimo de 100x100px y máximo de 2000x2000px.'
            )

        return photo
