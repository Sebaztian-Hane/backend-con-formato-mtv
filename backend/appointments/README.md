# Django Appointments App

Este es el módulo de citas convertido de PHP/Laravel a Python/Django.

## Estructura del Proyecto

```
django_appointments/
├── __init__.py
├── admin.py          # Configuración del admin de Django
├── apps.py           # Configuración de la aplicación
├── models.py         # Modelo de datos para citas
├── serializers.py    # Serializers para la API REST
├── services.py       # Lógica de negocio
├── urls.py           # Configuración de URLs
├── views.py          # Vistas de la API REST
└── README.md         # Este archivo
```

## Modelo de Datos

### Appointment
El modelo `Appointment` incluye todos los campos del modelo PHP original:

- **Campos básicos**: `appointment_date`, `appointment_hour`, `appointment_type`, `room`
- **Información médica**: `ailments`, `diagnosis`, `surgeries`, `reflexology_diagnostics`, `medications`
- **Observaciones**: `observation`, `initial_date`, `final_date`
- **Pagos**: `payment`, `payment_detail`, `ticket_number`, `social_benefit`
- **Relaciones**: `patient`, `therapist`, `appointment_status`, `payment_type`
- **Auditoría**: `created_at`, `updated_at`, `deleted_at`

## API Endpoints

### Endpoints Básicos (CRUD)
- `GET /api/appointments/` - Listar citas
- `POST /api/appointments/` - Crear cita
- `GET /api/appointments/{id}/` - Obtener cita específica
- `PUT /api/appointments/{id}/` - Actualizar cita
- `DELETE /api/appointments/{id}/` - Eliminar cita (soft delete)

### Endpoints de Búsqueda
- `POST /api/appointments/search/` - Búsqueda con filtros
- `POST /api/appointments/search-completed/` - Búsqueda de citas completadas
- `POST /api/appointments/paginated-by-date/` - Citas paginadas por fecha
- `POST /api/appointments/completed-paginated-by-date/` - Citas completadas paginadas por fecha

### Endpoints de Calendario
- `GET /api/appointments/pending-calendar-by-date/` - Citas pendientes para calendario
- `POST /api/appointments/completed-calendar-by-date/` - Citas completadas para calendario por fecha

## Características Principales

### Soft Delete
Las citas se eliminan de forma suave (soft delete), manteniendo el registro en la base de datos con `deleted_at` marcado.

### Restauración Automática
Al crear una cita, si existe una cita eliminada con los mismos datos (paciente, fecha, hora), se restaura automáticamente.

### Validaciones
- Validación de unicidad: No puede existir más de una cita para el mismo paciente en la misma fecha y hora
- Validación de fechas: `final_date` debe ser posterior o igual a `initial_date`
- Validación de campos requeridos según el modelo original

### Paginación
Todos los endpoints de listado incluyen paginación configurable con parámetros `page` y `per_page`.

### Filtros
Soporte para filtros por:
- Paciente
- Terapeuta
- Estado de cita
- Tipo de pago
- Fechas (desde/hasta)
- Tipo de cita
- Habitación
- Beneficio social

## Serializers

### AppointmentSerializer
Serializer completo para operaciones de lectura detallada.

### AppointmentListSerializer
Serializer optimizado para listados con información relacionada (nombres de paciente, terapeuta, etc.).

### AppointmentCreateSerializer
Serializer para creación con validaciones específicas.

### AppointmentUpdateSerializer
Serializer para actualización con validaciones específicas.

### AppointmentSearchSerializer
Serializer para parámetros de búsqueda.

### AppointmentDateFilterSerializer
Serializer para filtros por fecha.

## Servicios

### AppointmentService
Contiene toda la lógica de negocio:

- **search_appointments()**: Búsqueda con múltiples filtros
- **search_completed_appointments()**: Búsqueda de citas completadas
- **get_paginated_appointments_by_date()**: Citas paginadas por fecha
- **get_completed_appointments_paginated_by_date()**: Citas completadas paginadas por fecha
- **get_pending_appointments_for_calendar_by_date()**: Citas pendientes para calendario
- **get_completed_appointments_for_calendar_by_date()**: Citas completadas para calendario
- **store_or_restore()**: Crear o restaurar cita
- **update()**: Actualizar cita
- **destroy()**: Eliminar cita (soft delete)

## Permisos

Todos los endpoints requieren autenticación (`IsAuthenticated`). Para implementar permisos más específicos, se pueden agregar permisos personalizados.

## Configuración del Admin

El modelo está configurado en el admin de Django con:
- Lista de visualización optimizada
- Filtros por fecha, estado, tipo, terapeuta, etc.
- Búsqueda por nombre de paciente, diagnóstico, etc.
- Campos organizados en secciones lógicas

## Migraciones

Para crear las migraciones:
```bash
python manage.py makemigrations django_appointments
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

## Dependencias Relacionadas

Este módulo depende de otros módulos que deben estar implementados:
- `patients_diagnoses.Patient` - Modelo de pacientes
- `therapists.Therapist` - Modelo de terapeutas
- `histories_configurations.PaymentType` - Modelo de tipos de pago
- `django_appointment_statuses.AppointmentStatus` - Modelo de estados de cita 