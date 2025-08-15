import pytest
from django.urls import reverse
from Reflexo.models import Region

@pytest.mark.django_db
def test_list_regions(client):
    Region.objects.create(name="Sierra")
    url = reverse("list_regions")
    response = client.get(url)
    assert response.status_code == 200

    data = response.json()
    # La API devuelve {success, data, count}, necesitamos acceder a data.data
    if isinstance(data, dict) and 'data' in data:
        regions_data = data['data']
    else:
        regions_data = data
    
    names = [reg["name"] for reg in regions_data]
    assert "Sierra" in names
