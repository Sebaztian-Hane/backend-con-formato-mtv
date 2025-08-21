from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from pathlib import Path
import csv

from therapists.models import Region, Province, District


class Command(BaseCommand):
    help = "Importa regiones, provincias y distritos desde CSV delimitados por ';'."

    def add_arguments(self, parser):
        parser.add_argument(
            "--path",
            type=str,
            default="db",
            help="Carpeta con regions.csv, provinces.csv y districts.csv (por defecto: db).",
        )
        parser.add_argument(
            "--truncate",
            action="store_true",
            help="Borra los registros existentes antes de importar.",
        )

    def handle(self, *args, **options):
        base = Path(options["path"]).resolve()
        regions_csv = base / "regions.csv"
        provinces_csv = base / "provinces.csv"
        districts_csv = base / "districts.csv"

        for p in (regions_csv, provinces_csv, districts_csv):
            if not p.exists():
                raise CommandError(f"No se encontró el archivo: {p}")

        if options["truncate"]:
            self.stdout.write(self.style.WARNING("Borrando datos existentes…"))
            District.objects.all().delete()
            Province.objects.all().delete()
            Region.objects.all().delete()

        with transaction.atomic():
            # ======================
            # REGIONS
            # ======================
            self.stdout.write("Importando regiones…")
            with regions_csv.open(encoding="utf-8", newline="") as f:
                reader = csv.DictReader(f, delimiter=";")
                for row in reader:
                    code = str(row["ubigeo_code"]).strip()
                    name = row["name"].strip()
                    if not code or not name:
                        continue
                    Region.objects.update_or_create(
                        ubigeo_code=code,
                        defaults={"name": name},
                    )

            region_by_code = {r.ubigeo_code: r for r in Region.objects.all()}

            # ======================
            # PROVINCES
            # ======================
            self.stdout.write("Importando provincias…")
            with provinces_csv.open(encoding="utf-8", newline="") as f:
                reader = csv.DictReader(f, delimiter=";")
                for row in reader:
                    code = str(row["ubigeo_code"]).strip()
                    name = row["name"].strip()
                    region_code = str(row["region_id"]).strip()
                    region = region_by_code.get(region_code)
                    if not (code and name and region):
                        continue
                    Province.objects.update_or_create(
                        ubigeo_code=code,
                        defaults={
                            "name": name,
                            "region": region,
                        },
                    )

            province_by_code = {p.ubigeo_code: p for p in Province.objects.all()}

            # ======================
            # DISTRICTS
            # ======================
            self.stdout.write("Importando distritos…")
            with districts_csv.open(encoding="utf-8", newline="") as f:
                reader = csv.DictReader(f, delimiter=";")
                for row in reader:
                    code = str(row["ubigeo_code"]).strip()
                    name = row["name"].strip()
                    prov_code = str(row["province_id"]).strip()
                    province = province_by_code.get(prov_code)
                    if not (code and name and province):
                        continue
                    District.objects.update_or_create(
                        ubigeo_code=code,
                        defaults={
                            "name": name,
                            "province": province,
                        },
                    )

        self.stdout.write(self.style.SUCCESS("Importación completada ✔"))
