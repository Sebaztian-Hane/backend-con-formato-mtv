# your_app/serializers/email_serializer.py

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()

class EmailSerializer(serializers.Serializer):
    TYPE_CHOICES = (
        (0, 'Tipo 0'),
        (1, 'Tipo 1'),
        (2, 'Tipo 2'),
    )

    type_email = serializers.ChoiceField(
        choices=TYPE_CHOICES,
        error_messages={
            'required': 'El tipo de correo es obligatorio.',
            'invalid_choice': 'El tipo de correo debe ser 0, 1 o 2.',
        }
    )
    new_email = serializers.EmailField(
        required=False,
        error_messages={
            'invalid': 'El nuevo correo debe ser una dirección válida.',
        }
    )

    def validate_new_email(self, value):
        """
        Valida unicidad de email en el modelo User.
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Este correo ya está en uso por otro usuario.')
        return value

    def validate(self, attrs):
        """
        Hacer new_email obligatorio cuando type_email == 2.
        """
        type_email = int(attrs.get('type_email'))
        new_email = attrs.get('new_email')

        if type_email == 2 and not new_email:
            raise serializers.ValidationError({
                'new_email': 'El nuevo correo es obligatorio cuando el tipo es 2.'
            })
        return attrs
