from django import forms
from django.contrib.auth import get_user_model

User = get_user_model()

class UpdateProfileForm(forms.Form):
    first_name = forms.CharField(max_length=150, required=False)
    last_name = forms.CharField(max_length=150, required=False)
    email = forms.EmailField(max_length=255, required=False)
    phone = forms.CharField(max_length=100, required=False)
    photo = forms.ImageField(required=False)  # <- AGREGADO
    username = forms.CharField(max_length=150, required=False)
    current_password = forms.CharField(required=False)
    password = forms.CharField(min_length=8, required=False)

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user')
        super().__init__(*args, **kwargs)

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if email:
            exists = User.objects.filter(email=email).exclude(id=self.user.id).exists()
            if exists:
                raise forms.ValidationError('El correo electrónico ya está registrado.')
        return email

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if username:
            exists = User.objects.filter(username=username).exclude(id=self.user.id).exists()
            if exists:
                raise forms.ValidationError('El nombre de usuario ya está en uso.')
        return username

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        current_password = cleaned_data.get('current_password')

        if password:
            if not current_password:
                self.add_error('current_password', 'La contraseña actual es obligatoria para cambiar la nueva.')
            elif not self.user.check_password(current_password):
                self.add_error('current_password', 'La contraseña actual es incorrecta.')
