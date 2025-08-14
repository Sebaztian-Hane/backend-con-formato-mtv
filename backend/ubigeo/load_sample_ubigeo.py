from ubigeo.models import Region, Province, District

def run():
    # Crear regiones
    lima = Region.objects.create(name="Lima")
    arequipa = Region.objects.create(name="Arequipa")

    # Crear provincias
    lima_prov = Province.objects.create(name="Lima", region=lima)
    callao_prov = Province.objects.create(name="Callao", region=lima)
    arequipa_prov = Province.objects.create(name="Arequipa", region=arequipa)

    # Crear distritos
    District.objects.create(name="Miraflores", province=lima_prov)
    District.objects.create(name="San Isidro", province=lima_prov)
    District.objects.create(name="Bellavista", province=callao_prov)
    District.objects.create(name="Cercado", province=arequipa_prov)
    print("Datos de ubigeo cargados correctamente.")
