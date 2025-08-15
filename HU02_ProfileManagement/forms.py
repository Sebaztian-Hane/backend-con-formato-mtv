from django import forms
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import get_user_model

User = get_user_model()

class EmailAuthenticationForm(AuthenticationForm):
    username = forms.EmailField(label='Correo electrónico', max_length=255)
