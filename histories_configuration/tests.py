from django.test import TestCase
from django.urls import reverse
from .models import (
    DocumentType,
    Patient,
    History,
    PaymentType,
    PredeterminedPrice,
    Appointment
)
from .forms import (
    DocumentTypeForm,
    PatientForm,
    HistoryForm,
    PaymentTypeForm,
    PredeterminedPriceForm,
    AppointmentForm
)

# -------------------------
# TESTS DE MODELOS
# -------------------------
class DocumentTypeModelTest(TestCase):
    def test_create_document_type(self):
        doc_type = DocumentType.objects.create(name="DNI", description="Documento nacional")
        self.assertEqual(doc_type.name, "DNI")
        self.assertEqual(doc_type.description, "Documento nacional")
        self.assertIsNotNone(doc_type.id)

class PatientModelTest(TestCase):
    def setUp(self):
        self.doc_type = DocumentType.objects.create(name="DNI")

    def test_create_patient(self):
        patient = Patient.objects.create(
            name="Juan Perez",
            document_type=self.doc_type,
            document_number="12345678",
            birth_date="1990-01-01"
        )
        self.assertEqual(patient.name, "Juan Perez")
        self.assertEqual(patient.document_type, self.doc_type)
        self.assertIsNotNone(patient.id)

class HistoryModelTest(TestCase):
    def setUp(self):
        self.doc_type = DocumentType.objects.create(name="DNI")
        self.patient = Patient.objects.create(name="Ana Lopez", document_type=self.doc_type)

    def test_create_history(self):
        history = History.objects.create(
            testimony="Testimonio",
            patient=self.patient
        )
        self.assertEqual(history.patient, self.patient)
        self.assertIsNotNone(history.id)

# -------------------------
# TESTS DE FORMULARIOS
# -------------------------
class DocumentTypeFormTest(TestCase):
    def test_valid_data(self):
        form = DocumentTypeForm(data={
            'name': 'DNI',
            'description': 'Documento Nacional de Identidad'
        })
        self.assertTrue(form.is_valid())

    def test_duplicate_name(self):
        DocumentType.objects.create(name='DNI')
        form = DocumentTypeForm(data={'name': 'DNI', 'description': 'Otro'})
        self.assertFalse(form.is_valid())
        self.assertIn('El tipo de documento ya está registrado.', form.errors['name'])
 
    #MODIFICACION
    def test_name_length_limit(self):
        form = DocumentTypeForm(data={'name': 'a' * 256})
        self.assertFalse(form.is_valid())
        self.assertIn('El nombre no debe superar los 255 caracteres.', form.errors['name'])

class PatientFormTest(TestCase):
    def setUp(self):
        self.doc_type = DocumentType.objects.create(name='DNI')

    def test_valid_data(self):
        form = PatientForm(data={
            'name': 'Juan Perez',
            'document_type': self.doc_type.id,
            'document_number': '12345678',
            'birth_date': '1990-01-01'
        })
        self.assertTrue(form.is_valid())

    def test_name_length_limit(self):             
        form = PatientForm(data={
            'name': 'x' * 256,
            'document_type': self.doc_type.id,
            'document_number': '123',
            'birth_date': '1990-01-01'
        })
        self.assertFalse(form.is_valid())
        self.assertIn('El nombre no debe superar los 255 caracteres.', form.errors['name'])

class HistoryFormTest(TestCase):
    def setUp(self):
        self.patient = Patient.objects.create(name='Ana Lopez')

    def test_valid_data(self):
        form = HistoryForm(data={
            'testimony': 'Testimonio',
            'patient': self.patient.id
        })
        self.assertTrue(form.is_valid())

    def test_diu_type_length_limit(self):
        form = HistoryForm(data={
            'diu_type': 'x' * 256,
            'patient': self.patient.id
        })
        self.assertFalse(form.is_valid())
        self.assertIn('El tipo de DIU no debe superar los 255 caracteres.', form.errors['diu_type'])

class PaymentTypeFormTest(TestCase):
    def test_valid_data(self):
        form = PaymentTypeForm(data={
            'code': 'EF',
            'name': 'Efectivo'
        })
        self.assertTrue(form.is_valid())

    def test_duplicate_name(self):
        PaymentType.objects.create(code='EF', name='Efectivo')
        form = PaymentTypeForm(data={'code': 'EF2', 'name': 'Efectivo'})
        self.assertFalse(form.is_valid())
        self.assertIn('El tipo de pago ya está registrado.', form.errors['name'])

class PredeterminedPriceFormTest(TestCase):
    def test_valid_data(self):
        form = PredeterminedPriceForm(data={
            'name': 'Consulta General',
            'price': '50.00'
        })
        self.assertTrue(form.is_valid())

    def test_price_negative(self):
        form = PredeterminedPriceForm(data={
            'name': 'Consulta',
            'price': '-5.00'
        })
        self.assertFalse(form.is_valid())
        self.assertIn('El precio no puede ser negativo.', form.errors['price'])

class AppointmentFormTest(TestCase):
    def setUp(self):
        self.payment_type = PaymentType.objects.create(code='EF', name='Efectivo')
        self.price = PredeterminedPrice.objects.create(name='Consulta', price=50.00)

    def test_valid_data(self):
        form = AppointmentForm(data={
            'payment_type': self.payment_type.id,
            'predetermined_price': self.price.id,
            'date': '2025-12-31 10:00:00',
            'description': 'Consulta médica'
        })
        self.assertTrue(form.is_valid())

    def test_description_length_limit(self):
        form = AppointmentForm(data={
            'payment_type': self.payment_type.id,
            'predetermined_price': self.price.id,
            'date': '2025-12-31 10:00:00',
            'description': 'x' * 1001
        })
        self.assertFalse(form.is_valid())
        self.assertIn('La descripción no debe superar los 1000 caracteres.', form.errors['description'])

# -------------------------
# TESTS DE VISTAS
# -------------------------
class ViewsTest(TestCase):
    def setUp(self):
        self.doc_type = DocumentType.objects.create(name="DNI")
        self.patient = Patient.objects.create(name="Juan Perez", document_type=self.doc_type)
        self.payment_type = PaymentType.objects.create(code='EF', name='Efectivo')
        self.price = PredeterminedPrice.objects.create(name='Consulta', price=50.00)

        self.history = History.objects.create(patient=self.patient)
        self.appointment = Appointment.objects.create(
            payment_type=self.payment_type,
            predetermined_price=self.price,
            date="2025-12-31 10:00:00"
        )

    def test_document_types_list_view(self):            
        response = self.client.get(reverse('document_types_list'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'document_types/list.html')
        self.assertContains(response, self.doc_type.name)

    def test_document_type_create_view(self):
        response = self.client.post(reverse('document_type_create'), {
            'name': 'Carnet Ext',
            'description': 'Carnet de extranjería'
        })
        self.assertEqual(response.status_code, 302)
        self.assertTrue(DocumentType.objects.filter(name='Carnet Ext').exists())

    def test_patients_list_view(self):           
        response = self.client.get(reverse('patients_list'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'patients/list.html')
        self.assertContains(response, self.patient.name)

    def test_patient_create_view(self):
        response = self.client.post(reverse('patient_create'), {
            'name': 'Maria Lopez',
            'document_type': self.doc_type.id,
            'document_number': '87654321',
            'birth_date': '1985-05-05'
        })
        self.assertEqual(response.status_code, 302)
        self.assertTrue(Patient.objects.filter(name='Maria Lopez').exists())

    # Puedes agregar tests similares para history, payment type, predetermined price, appointment views

