from django.shortcuts import render, get_object_or_404, redirect
from models.models import (
    DocumentType, Patient, History,
    PaymentType, PredeterminedPrice, Appointment
)
from forms.forms import (
    DocumentTypeForm, PatientForm, HistoryForm,
    PaymentTypeForm, PredeterminedPriceForm, AppointmentForm
)

# ============ DOCUMENT TYPE ============
def document_types_list(request):
    document_types = DocumentType.objects.filter(deleted_at__isnull=True)
    return render(request, 'document_types/list.html', {'document_types': document_types})

def document_type_create(request):
    if request.method == 'POST':
        form = DocumentTypeForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('document_types_list')
    else:
        form = DocumentTypeForm()
    return render(request, 'document_types/form.html', {'form': form})

def document_type_update(request, pk):
    document_type = get_object_or_404(DocumentType, pk=pk)
    if request.method == 'POST':
        form = DocumentTypeForm(request.POST, instance=document_type)
        if form.is_valid():
            form.save()
            return redirect('document_types_list')
    else:
        form = DocumentTypeForm(instance=document_type)
    return render(request, 'document_types/form.html', {'form': form})

def document_type_delete(request, pk):
    document_type = get_object_or_404(DocumentType, pk=pk)
    document_type.soft_delete()
    return redirect('document_types_list')


# ============ PATIENT ============
def patients_list(request):
    patients = Patient.objects.all()
    return render(request, 'patients/list.html', {'patients': patients})

def patient_create(request):
    if request.method == 'POST':
        form = PatientForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('patients_list')
    else:
        form = PatientForm()
    return render(request, 'patients/form.html', {'form': form})

def patient_update(request, pk):
    patient = get_object_or_404(Patient, pk=pk)
    if request.method == 'POST':
        form = PatientForm(request.POST, instance=patient)
        if form.is_valid():
            form.save()
            return redirect('patients_list')
    else:
        form = PatientForm(instance=patient)
    return render(request, 'patients/form.html', {'form': form})

def patient_delete(request, pk):
    patient = get_object_or_404(Patient, pk=pk)
    patient.delete()
    return redirect('patients_list')


# ============ HISTORY ============
def histories_list(request):
    histories = History.objects.filter(deleted_at__isnull=True)
    return render(request, 'histories/list.html', {'histories': histories})

def history_create(request):
    if request.method == 'POST':
        form = HistoryForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('histories_list')
    else:
        form = HistoryForm()
    return render(request, 'histories/form.html', {'form': form})

def history_update(request, pk):
    history = get_object_or_404(History, pk=pk)
    if request.method == 'POST':
        form = HistoryForm(request.POST, instance=history)
        if form.is_valid():
            form.save()
            return redirect('histories_list')
    else:
        form = HistoryForm(instance=history)
    return render(request, 'histories/form.html', {'form': form})

def history_delete(request, pk):
    history = get_object_or_404(History, pk=pk)
    history.soft_delete()
    return redirect('histories_list')


# ============ PAYMENT TYPE ============
def payment_types_list(request):
    payment_types = PaymentType.objects.filter(deleted_at__isnull=True)
    return render(request, 'payment_types/list.html', {'payment_types': payment_types})

def payment_type_create(request):
    if request.method == 'POST':
        form = PaymentTypeForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('payment_types_list')
    else:
        form = PaymentTypeForm()
    return render(request, 'payment_types/form.html', {'form': form})

def payment_type_update(request, pk):
    payment_type = get_object_or_404(PaymentType, pk=pk)
    if request.method == 'POST':
        form = PaymentTypeForm(request.POST, instance=payment_type)
        if form.is_valid():
            form.save()
            return redirect('payment_types_list')
    else:
        form = PaymentTypeForm(instance=payment_type)
    return render(request, 'payment_types/form.html', {'form': form})

def payment_type_delete(request, pk):
    payment_type = get_object_or_404(PaymentType, pk=pk)
    payment_type.soft_delete()
    return redirect('payment_types_list')


# ============ PREDETERMINED PRICE ============
def predetermined_prices_list(request):
    prices = PredeterminedPrice.objects.all()
    return render(request, 'predetermined_prices/list.html', {'prices': prices})

def predetermined_price_create(request):
    if request.method == 'POST':
        form = PredeterminedPriceForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('predetermined_prices_list')
    else:
        form = PredeterminedPriceForm()
    return render(request, 'predetermined_prices/form.html', {'form': form})

def predetermined_price_update(request, pk):
    price = get_object_or_404(PredeterminedPrice, pk=pk)
    if request.method == 'POST':
        form = PredeterminedPriceForm(request.POST, instance=price)
        if form.is_valid():
            form.save()
            return redirect('predetermined_prices_list')
    else:
        form = PredeterminedPriceForm(instance=price)
    return render(request, 'predetermined_prices/form.html', {'form': form})

def predetermined_price_delete(request, pk):
    price = get_object_or_404(PredeterminedPrice, pk=pk)
    price.delete()
    return redirect('predetermined_prices_list')


# ============ APPOINTMENT ============
def appointments_list(request):
    appointments = Appointment.objects.all()
    return render(request, 'appointments/list.html', {'appointments': appointments})

def appointment_create(request):
    if request.method == 'POST':
        form = AppointmentForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('appointments_list')
    else:
        form = AppointmentForm()
    return render(request, 'appointments/form.html', {'form': form})

def appointment_update(request, pk):
    appointment = get_object_or_404(Appointment, pk=pk)
    if request.method == 'POST':
        form = AppointmentForm(request.POST, instance=appointment)
        if form.is_valid():
            form.save()
            return redirect('appointments_list')
    else:
        form = AppointmentForm(instance=appointment)
    return render(request, 'appointments/form.html', {'form': form})

def appointment_delete(request, pk):
    appointment = get_object_or_404(Appointment, pk=pk)
    appointment.delete()
    return redirect('appointments_list')
