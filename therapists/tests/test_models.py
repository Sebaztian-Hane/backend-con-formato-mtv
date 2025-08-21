from django.test import TestCase
from django.core.exceptions import ValidationError
from ..models import Therapist, Specialization, Certification, Schedule
from datetime import date, time

class TherapistModelTest(TestCase):
    def setUp(self):
        self.therapist_data = {
            'document_type': 'DNI',
            'document_number': '12345678',
            'last_name_paternal': 'García',
            'last_name_maternal': 'López',
            'first_name': 'Juan',
            'birth_date': date(1990, 1, 1),
            'gender': 'Masculino',
            'phone': '123456789',
            'email': 'juan@example.com'
        }

    def test_create_therapist(self):
        therapist = Therapist.objects.create(**self.therapist_data)
        self.assertEqual(therapist.first_name, 'Juan')
        self.assertEqual(therapist.last_name_paternal, 'García')
        self.assertTrue(therapist.is_active)

    def test_therapist_str_representation(self):
        therapist = Therapist.objects.create(**self.therapist_data)
        expected = "Juan García López"
        self.assertEqual(str(therapist), expected)

class SpecializationModelTest(TestCase):
    def test_create_specialization(self):
        specialization = Specialization.objects.create(
            name='Psicología Clínica',
            description='Especialidad en psicología clínica'
        )
        self.assertEqual(specialization.name, 'Psicología Clínica')
        self.assertTrue(specialization.is_active)

class CertificationModelTest(TestCase):
    def setUp(self):
        self.therapist = Therapist.objects.create(
            document_type='DNI',
            document_number='12345678',
            last_name_paternal='García',
            first_name='Juan',
            birth_date=date(1990, 1, 1),
            gender='Masculino',
            phone='123456789'
        )

    def test_create_certification(self):
        certification = Certification.objects.create(
            therapist=self.therapist,
            name='Certificación en Psicología',
            issuing_organization='Universidad XYZ',
            issue_date=date(2020, 1, 1)
        )
        self.assertEqual(certification.name, 'Certificación en Psicología')
        self.assertEqual(certification.therapist, self.therapist)

class ScheduleModelTest(TestCase):
    def setUp(self):
        self.therapist = Therapist.objects.create(
            document_type='DNI',
            document_number='12345678',
            last_name_paternal='García',
            first_name='Juan',
            birth_date=date(1990, 1, 1),
            gender='Masculino',
            phone='123456789'
        )

    def test_create_schedule(self):
        schedule = Schedule.objects.create(
            therapist=self.therapist,
            day_of_week='monday',
            start_time=time(9, 0),
            end_time=time(17, 0)
        )
        self.assertEqual(schedule.day_of_week, 'monday')
        self.assertEqual(schedule.therapist, self.therapist)
        self.assertTrue(schedule.is_available)
