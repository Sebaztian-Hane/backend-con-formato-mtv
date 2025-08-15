import pytest
from django.urls import reverse
from Reflexo.models import Province, Region

@pytest.mark.django_db
def test_list_provinces(client):
    region = Region.objects.create(name="Costa")
    Province.objects.create(name="Lima", region=region)

    url = reverse("list_provinces")
    response = client.get(url)
    assert response.status_code == 200

    data = response.json()
    # La API devuelve {success, data, count}, necesitamos acceder a data.data
    if isinstance(data, dict) and 'data' in data:
        provinces_data = data['data']
    else:
        provinces_data = data
    
    names = [prov["name"] for prov in provinces_data]
    assert "Lima" in names
