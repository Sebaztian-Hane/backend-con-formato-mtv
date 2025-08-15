from django import forms
from django.core.exceptions import ValidationError
import regex  # Usamos 'regex' para soportar \pL en la expresión regular

class SearchUsersForm(forms.Form):
    search = forms.CharField(
        required=True,
        error_messages={
            'required': 'No se especificó ningún término de búsqueda.',
        }
    )
    per_page = forms.IntegerField(
        required=True,
        min_value=1,
        max_value=100,
        error_messages={
            'required': 'Es necesario especificar el número de elementos por página.',
            'min_value': 'El número mínimo por página es 1.',
            'max_value': 'El número máximo por página es 100.',
            'invalid': 'El número de elementos por página debe ser un número entero.'
        }
    )
    page = forms.IntegerField(
        required=False,
        min_value=1,
        error_messages={
            'invalid': 'El número de página debe ser un número entero positivo.',
            'min_value': 'La página mínima permitida es 1.'
        }
    )
    email = forms.EmailField(required=False)
    documento = forms.CharField(required=False)
    rol = forms.CharField(required=False)

    def clean_search(self):
        value = self.cleaned_data.get('search', '')
        if not regex.match(r"^[\pL\s0-9'()]+$", value):
            raise ValidationError('El término debe incluir letras, números u otros caracteres válidos.')
        return value

    def validate_or_error_response(self):
        if not self.is_valid():
            return {
                'message': 'Errores de validación',
                'errors': self.errors
            }
        return None
