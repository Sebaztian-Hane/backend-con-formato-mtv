from django.test import TestCase
from ..services import (
    TherapistService, 
    SpecializationService, 
    CertificationService, 
    ScheduleService
)
from ..models import Therapist, Specialization, Certification, Schedule
from datetime import date, time

class TherapistServiceTest(TestCase):
    def setUp(self):
        self.therapist = Therapist.objects.create(
            document_type='DNI',
            document_number='12345678',
            last_name_paternal='García',
            last_name_maternal='López',
            first_name='Juan',
            birth_date=date(1990, 1, 1),
            gender='Masculino',
            phone='123456789',
            email='juan@example.com'
        )

    def test_get_active_therapists(self):
        active_therapists = TherapistService.get_active_therapists()
        self.assertEqual(active_therapists.count(), 1)
        self.assertIn(self.therapist, active_therapists)

    def test_get_inactive_therapists(self):
        self.therapist.is_active = False
        self.therapist.save()
        inactive_therapists = TherapistService.get_inactive_therapists()
        self.assertEqual(inactive_therapists.count(), 1)
        self.assertIn(self.therapist, inactive_therapists)

    def test_soft_delete_therapist(self):
        result = TherapistService.soft_delete_therapist(self.therapist.id)
        self.assertTrue(result)
        self.therapist.refresh_from_db()
        self.assertFalse(self.therapist.is_active)

    def test_restore_therapist(self):
        self.therapist.is_active = False
        self.therapist.save()
        result = TherapistService.restore_therapist(self.therapist.id)
        self.assertTrue(result)
        self.therapist.refresh_from_db()
        self.assertTrue(self.therapist.is_active)

class SpecializationServiceTest(TestCase):
    def test_get_active_specializations(self):
        specialization = Specialization.objects.create(
            name='Psicología Clínica',
            description='Especialidad en psicología clínica'
        )
        active_specializations = SpecializationService.get_active_specializations()
        self.assertEqual(active_specializations.count(), 1)
        self.assertIn(specialization, active_specializations)

    def test_get_specialization_by_name(self):
        specialization = Specialization.objects.create(
            name='Psicología Clínica',
            description='Especialidad en psicología clínica'
        )
        found = SpecializationService.get_specialization_by_name('Psicología Clínica')
        self.assertEqual(found, specialization)

class CertificationServiceTest(TestCase):
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

    def test_get_certifications_by_therapist(self):
        certification = Certification.objects.create(
            therapist=self.therapist,
            name='Certificación en Psicología',
            issuing_organization='Universidad XYZ',
            issue_date=date(2020, 1, 1)
        )
        therapist_certifications = CertificationService.get_certifications_by_therapist(self.therapist.id)
        self.assertEqual(therapist_certifications.count(), 1)
        self.assertIn(certification, therapist_certifications)

    def test_get_expired_certifications(self):
        certification = Certification.objects.create(
            therapist=self.therapist,
            name='Certificación Expirada',
            issuing_organization='Universidad XYZ',
            issue_date=date(2020, 1, 1),
            expiry_date=date(2021, 1, 1)
        )
        expired_certifications = CertificationService.get_expired_certifications()
        self.assertEqual(expired_certifications.count(), 1)
        self.assertIn(certification, expired_certifications)

class ScheduleServiceTest(TestCase):
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

    def test_get_therapist_schedule(self):
        schedule = Schedule.objects.create(
            therapist=self.therapist,
            day_of_week='monday',
            start_time=time(9, 0),
            end_time=time(17, 0)
        )
        therapist_schedule = ScheduleService.get_therapist_schedule(self.therapist.id)
        self.assertEqual(therapist_schedule.count(), 1)
        self.assertIn(schedule, therapist_schedule)

    def test_get_available_therapists_by_day(self):
        schedule = Schedule.objects.create(
            therapist=self.therapist,
            day_of_week='monday',
            start_time=time(9, 0),
            end_time=time(17, 0)
        )
        available_therapists = ScheduleService.get_available_therapists_by_day('monday')
        self.assertEqual(available_therapists.count(), 1)
        self.assertIn(self.therapist, available_therapists)
