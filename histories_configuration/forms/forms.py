from django import forms
from models.models import (
    DocumentType,
    Patient,
    History,
    PaymentType,
    PredeterminedPrice,
    Appointment,
)

# FORMULARIOS PARA LOS MODELOS

# Formulario para crear/editar tipos de documento
class DocumentTypeForm(forms.ModelForm):
    name = forms.CharField(
        max_length=255,
        error_messages={'max_length': 'El nombre no debe superar los 255 caracteres.'}
    )
    description = forms.CharField(
        required=False,
        widget=forms.Textarea,
        max_length=1000,
        error_messages={'max_length': 'La descripción no debe superar los 1000 caracteres.'}
    )

    class Meta:
        model = DocumentType
        fields = ['name', 'description']

    # Validación personalizada para el campo 'name'
    def clean_name(self):
        name = self.cleaned_data.get('name')
        qs = DocumentType.objects.filter(name=name)
        if self.instance.pk:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise forms.ValidationError('El tipo de documento ya está registrado.')
        return name

# Formulario para tipos de pago
class PaymentTypeForm(forms.ModelForm):
    name = forms.CharField(
        max_length=255,
        error_messages={'max_length': 'El nombre no debe superar los 255 caracteres.'}
    )
    code = forms.CharField(
        max_length=50,
        error_messages={'max_length': 'El código no debe superar los 50 caracteres.'}
    )

    class Meta:
        model = PaymentType
        fields = ['code', 'name']

    def clean_name(self):
        name = self.cleaned_data.get('name')
        qs = PaymentType.objects.filter(name=name)
        if self.instance.pk:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise forms.ValidationError('El tipo de pago ya está registrado.')
        return name

# Formulario para precios predeterminados
class PredeterminedPriceForm(forms.ModelForm):
    name = forms.CharField(
        max_length=255,
        error_messages={'max_length': 'El nombre no debe superar los 255 caracteres.'}
    )

    class Meta:
        model = PredeterminedPrice
        fields = ['name', 'price']

    def clean_name(self):
        name = self.cleaned_data.get('name')
        qs = PredeterminedPrice.objects.filter(name=name)
        if self.instance.pk:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise forms.ValidationError('El precio predeterminado ya está registrado.')
        return name

    def clean_price(self):
        price = self.cleaned_data.get('price')
        if price is not None and price < 0:
            raise forms.ValidationError('El precio no puede ser negativo.')
        return price

# Formulario para pacientes
class PatientForm(forms.ModelForm):
    name = forms.CharField(
        max_length=255,
        error_messages={'max_length': 'El nombre no debe superar los 255 caracteres.'}
    )
    document_number = forms.CharField(
        required=False,
        max_length=50,
        error_messages={'max_length': 'El número de documento no debe superar los 50 caracteres.'}
    )

    class Meta:
        model = Patient
        fields = ['name', 'document_type', 'document_number', 'birth_date']

# Formulario para historias clínicas
class HistoryForm(forms.ModelForm):
    diu_type = forms.CharField(
        required=False,
        max_length=255,
        error_messages={'max_length': 'El tipo de DIU no debe superar los 255 caracteres.'}
    )

    class Meta:
        model = History
        fields = [
            'testimony', 'private_observation', 'observation',
            'height', 'weight', 'last_weight',
            'menstruation', 'diu_type', 'gestation', 'patient'
        ]

# Formulario para citas
class AppointmentForm(forms.ModelForm):
    description = forms.CharField(
        required=False,
        widget=forms.Textarea,
        max_length=1000,
        error_messages={'max_length': 'La descripción no debe superar los 1000 caracteres.'}
    )

    class Meta:
        model = Appointment
        fields = [
            'payment_type',
            'predetermined_price',
            'date',
            'description'
        ]

    def clean_date(self):
        date = self.cleaned_data.get('date')
        # Si quieres evitar fechas pasadas, descomenta:
        # from django.utils import timezone
        # if date and date < timezone.now():
        #     raise forms.ValidationError('La fecha no puede estar en el pasado.')
        return date
