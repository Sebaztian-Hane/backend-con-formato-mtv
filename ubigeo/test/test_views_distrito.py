from django.test import TestCase
from Reflexo.models import District, Province, Region

class DistrictModelTest(TestCase):
    def setUp(self):
        self.region = Region.objects.create(name="Costa")
        self.province = Province.objects.create(name="Lima", region=self.region)
        self.district = District.objects.create(name="Miraflores", province=self.province)

    def test_district_creation(self):
        self.assertEqual(self.district.name, "Miraflores")
        self.assertEqual(self.district.province.name, "Lima")

    def test_str_method(self):
        self.assertEqual(str(self.district), "Miraflores")
