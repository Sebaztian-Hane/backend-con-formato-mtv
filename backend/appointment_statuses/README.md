# Django Appointment Statuses App

Este es el módulo de estados de citas convertido de PHP/Laravel a Python/Django.

## Estructura del Proyecto

```
django_appointment_statuses/
├── __init__.py
├── admin.py          # Configuración del admin de Django
├── apps.py           # Configuración de la aplicación
├── models.py         # Modelo de datos para estados de citas
├── serializers.py    # Serializers para la API REST
├── services.py       # Lógica de negocio
├── urls.py           # Configuración de URLs
├── views.py          # Vistas de la API REST
└── README.md         # Este archivo
```

## Modelo de Datos

### AppointmentStatus
El modelo `AppointmentStatus` incluye todos los campos del modelo PHP original:

- **Campos básicos**: `name`, `description`
- **Auditoría**: `created_at`, `updated_at`, `deleted_at`

## API Endpoints

### Endpoints Básicos (CRUD)
- `GET /api/appointment-statuses/` - Listar estados de citas
- `POST /api/appointment-statuses/` - Crear estado de cita
- `GET /api/appointment-statuses/{id}/` - Obtener estado específico
- `PUT /api/appointment-statuses/{id}/` - Actualizar estado de cita
- `DELETE /api/appointment-statuses/{id}/` - Eliminar estado de cita (soft delete)

## Características Principales

### Soft Delete
Los estados de citas se eliminan de forma suave (soft delete), manteniendo el registro en la base de datos con `deleted_at` marcado.

### Restauración Automática
Al crear un estado de cita, si existe un estado eliminado con el mismo nombre, se restaura automáticamente.

### Validaciones
- Validación de unicidad: No puede existir más de un estado con el mismo nombre
- Validación de campos requeridos según el modelo original

## Serializers

### AppointmentStatusSerializer
Serializer completo para operaciones de lectura detallada.

### AppointmentStatusListSerializer
Serializer optimizado para listados.

### AppointmentStatusCreateSerializer
Serializer para creación con validaciones específicas.

### AppointmentStatusUpdateSerializer
Serializer para actualización con validaciones específicas.

## Servicios

### AppointmentStatusService
Contiene toda la lógica de negocio:

- **get_all()**: Obtener todos los estados de citas
- **store_or_restore()**: Crear o restaurar estado de cita
- **update()**: Actualizar estado de cita
- **destroy()**: Eliminar estado de cita (soft delete)

## Permisos

Todos los endpoints requieren autenticación (`IsAuthenticated`). Para implementar permisos más específicos, se pueden agregar permisos personalizados.

## Configuración del Admin

El modelo está configurado en el admin de Django con:
- Lista de visualización optimizada
- Filtros por fecha de creación y actualización
- Búsqueda por nombre y descripción
- Campos organizados en secciones lógicas

## Migraciones

Para crear las migraciones:
```bash
python manage.py makemigrations django_appointment_statuses
python manage.py migrate
```

## Uso

1. Instalar dependencias:
```bash
pip install -r requirements.txt
```

2. Ejecutar migraciones:
```bash
python manage.py migrate
```

3. Crear superusuario (opcional):
```bash
python manage.py createsuperuser
```

4. Ejecutar el servidor:
```bash
python manage.py runserver
```

## Ejemplos de Uso

### Crear un nuevo estado de cita
```bash
curl -X POST http://localhost:8000/api/appointment-statuses/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token YOUR_TOKEN" \
  -d '{
    "name": "Pendiente",
    "description": "Cita programada pero no confirmada"
  }'
```

### Obtener todos los estados
```bash
curl -X GET http://localhost:8000/api/appointment-statuses/ \
  -H "Authorization: Token YOUR_TOKEN"
```

### Actualizar un estado
```bash
curl -X PUT http://localhost:8000/api/appointment-statuses/1/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token YOUR_TOKEN" \
  -d '{
    "name": "Confirmado",
    "description": "Cita confirmada por el paciente"
  }'
```

## Estados Predefinidos

Se recomienda crear los siguientes estados básicos:

1. **Pendiente** - Cita programada pero no confirmada
2. **Confirmado** - Cita confirmada por el paciente
3. **En Proceso** - Cita en curso
4. **Completado** - Cita finalizada exitosamente
5. **Cancelado** - Cita cancelada
6. **No Asistió** - Paciente no asistió a la cita

## Dependencias Relacionadas

Este módulo es utilizado por:
- `django_appointments.Appointment` - Modelo de citas que referencia este modelo 