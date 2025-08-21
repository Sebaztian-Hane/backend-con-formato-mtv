# 📦 therapists

Carpeta principal de la aplicación Django para la gestión de terapeutas y sus especialidades.

---

## 📁 Estructura y Archivos

```
therapists/
├── __init__.py
├── admin.py
├── apps.py
├── migrations/
│   ├── __init__.py
│   └── [archivos de migración]
├── models.py
├── serializers.py
├── tests.py
├── urls.py
├── views.py
├── templates/
│   └── therapists_ui.html
└── [otros archivos auxiliares]
```

- **`__init__.py`**  
  Inicializa el paquete Python de la app.

- **`admin.py`**  
  Configura la administración de modelos en el panel de Django.

- **`apps.py`**  
  Configuración de la app para Django.

- **`migrations/`**  
  Archivos de migración para la base de datos.

- **`models.py`**  
  Define los modelos principales: `Therapist` y `Specialty`, incluyendo sus campos y relaciones.

- **`serializers.py`**  
  Serializadores para transformar los modelos en JSON y validar datos recibidos por la API.

- **`tests.py`**  
  Pruebas unitarias para asegurar la calidad y funcionamiento de la app.

- **`urls.py`**  
  Rutas específicas de la app, conectando los endpoints API y vistas web.

- **`views.py`**  
  Lógica de las vistas: CRUD, búsqueda, gestión de especialidades y manejo de imágenes.

- **`templates/therapists_ui.html`**  
  Interfaz HTML opcional para visualización y pruebas manuales.

---

## 🔗 Rutas Principales (urls.py)

**Archivo:**  
- `therapists/urls.py`

**Responsabilidad:**  
Define las rutas de la app, conectando los endpoints RESTful y vistas web.

### Ejemplo de rutas definidas

```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.TherapistListView.as_view(), name='therapist-list'),
    path('<int:pk>/', views.TherapistDetailView.as_view(), name='therapist-detail'),
    path('specialties/', views.SpecialtyListView.as_view(), name='specialty-list'),
    # Otros endpoints y vistas
]
```

---

## 🗂️ Documentación de Endpoints API

**Archivo:**  
- `therapists/urls.py` (o `api_urls.py` si está separado)

### Endpoints disponibles

| Método | Ruta                          | Descripción                                 | Parámetros         |
|--------|-------------------------------|---------------------------------------------|--------------------|
| GET    | `/api/therapists/`            | Lista todos los terapeutas                  | `search` (query)   |
| POST   | `/api/therapists/`            | Crea un nuevo terapeuta                     | JSON body          |
| GET    | `/api/therapists/<id>/`       | Obtiene un terapeuta específico             | `id` (path)        |
| PUT    | `/api/therapists/<id>/`       | Actualiza un terapeuta                      | `id` (path), body  |
| DELETE | `/api/therapists/<id>/`       | Elimina un terapeuta                        | `id` (path)        |

#### Ejemplo de respuesta (GET `/api/therapists/`):

```json
[
  {
    "id": 1,
    "document_type": "DNI",
    "document_number": "12345678",
    "first_name": "Ana",
    "last_name_paternal": "García",
    "last_name_maternal": "López",
    "birth_date": "1990-01-01",
    "gender": "Femenino",
    "phone": "999999999",
    "email": "ana@example.com",
    "location": "Lima",
    "address": "Av. Siempre Viva 123",
    "personal_reference": "Referencia",
    "is_active": true,
    "profile_picture": "url/imagen.jpg",
  }
]
```

---

## 🛠️ Tecnologías y Dependencias

- **Django**: Framework principal del backend.
- **Django REST Framework**: Para la creación de la API REST.
- **SQLite**: Base de datos por defecto (puede cambiarse en producción).
- **Pillow**: Manejo de imágenes (para fotos de perfil).

**Dependencias en `requirements.txt`:**
```
Django>=3.2
djangorestframework
Pillow
```

---

## ✅ Checklist de Documentación

- [x] Estructura de archivos explicada
- [x] Rutas principales documentadas
- [x] Ejemplo de endpoints y respuestas
- [x] Tecnologías y dependencias listadas

---