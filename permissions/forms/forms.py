from django import forms
from models.models import Permission

class PermissionForm(forms.ModelForm):
    class Meta:
        model = Permission
        fields = ['name', 'content_type', 'codename', 'detail']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'content_type': forms.Select(attrs={'class': 'form-control'}),
            'codename': forms.TextInput(attrs={'class': 'form-control'}),
            'detail': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
        } 