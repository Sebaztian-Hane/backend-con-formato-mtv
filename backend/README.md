# DjangoEntorno - Sistema de Citas, Estados, Tickets y Habitaciones

## 📋 Descripción

DjangoEntorno es un proyecto Django que maneja la gestión de citas médicas, sus estados, tickets y habitaciones/consultorios. Este proyecto fue migrado desde PHP/Laravel, manteniendo y ampliando la funcionalidad original para aprovechar la arquitectura modular y escalable de Django.

## 🏗️ Estructura del Proyecto

```
DjangoEntorno/
├── appointments/              # Aplicación de citas
│   ├── models.py             # Modelo de citas (relacionado con estados, tickets y habitaciones)
│   ├── serializers.py        # Serializers para la API
│   ├── views.py              # Vistas de la API
│   ├── services.py           # Lógica de negocio
│   ├── urls.py               # URLs de la aplicación
│   ├── admin.py              # Configuración del admin
│   ├── apps.py               # Configuración de la app
│   └── __init__.py           # Archivo de inicialización
├── appointment_statuses/      # Aplicación de estados de cita
│   ├── models.py             # Modelo de estados
│   ├── serializers.py        # Serializers para la API
│   ├── views.py              # Vistas de la API
│   ├── services.py           # Lógica de negocio
│   ├── urls.py               # URLs de la aplicación
│   ├── admin.py              # Configuración del admin
│   ├── apps.py               # Configuración de la app
│   └── __init__.py           # Archivo de inicialización
├── tickets/                   # Gestión de tickets para citas
│   ├── models.py             # Modelo de tickets (relacionado con citas)
│   ├── serializers.py        # Serializers para la API
│   ├── views.py              # Vistas de la API y utilidades
│   ├── services.py           # Lógica de negocio para asignación de tickets y habitaciones
│   ├── urls.py               # URLs de la aplicación
│   ├── admin.py              # Configuración del admin
│   └── __init__.py           # Archivo de inicialización
├── rooms/                     # Gestión de habitaciones/consultorios
│   ├── models.py             # Modelo de habitaciones
│   ├── serializers.py        # Serializers para la API
│   ├── views.py              # Vistas de la API
│   ├── urls.py               # URLs de la aplicación
│   ├── admin.py              # Configuración del admin
│   └── __init__.py           # Archivo de inicialización
├── config/                   # Configuración del proyecto
│   ├── settings.py           # Configuración principal
│   ├── urls.py               # URLs principales
│   └── __init__.py           # Archivo de inicialización
├── requirements.txt          # Dependencias del proyecto
├── manage.py                 # Script de gestión Django
└── README.md                 # Documentación
```

## 🚀 Instalación y Uso

1. **Crear entorno virtual**
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```
2. **Instalar dependencias**
   ```bash
   pip install -r requirements.txt
   ```
3. **Configurar variables de entorno**
   Crear archivo `.env` en la raíz del proyecto:
   ```env
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   ```
4. **Ejecutar migraciones**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
5. **Crear superusuario**
   ```bash
   python manage.py createsuperuser
   ```
6. **Ejecutar el servidor**
   ```bash
   python manage.py runserver
   ```

## 📡 Endpoints de la API

- `/api/appointments/` — CRUD de citas, búsqueda avanzada, paginación y calendario.
- `/api/appointment_statuses/` — CRUD de estados de cita.
- `/api/tickets/` — CRUD de tickets, utilidades para obtener el siguiente ticket y habitación disponible.
- `/api/rooms/` — CRUD de habitaciones/consultorios.

## 🛠️ Tecnologías Utilizadas

- **Django 4.2+**
- **Django REST Framework**
- **Django Filter**
- **Django CORS Headers**
- **Python Decouple**

## 🎯 Características y Funcionamiento

- Arquitectura modular y escalable.
- CRUD completo para citas, estados, tickets y habitaciones.
- Relación entre citas, estados, tickets y habitaciones (cada cita puede tener un estado, un ticket y una habitación asignada).
- Asignación automática de tickets y habitaciones según disponibilidad.
- Gestión y trazabilidad administrativa de tickets y habitaciones desde el admin y la API.
- Soft delete implementado en todos los modelos principales.
- Validaciones robustas y control de transiciones de estado.
- Panel de administración personalizado para todas las entidades.
- API RESTful completa, autenticación y permisos.

## 📚 Documentación Adicional

- [README_DJANGO.md](../README_DJANGO.md) — Documentación detallada del proyecto
- [README_MTV_ARCHITECTURE.md](../README_MTV_ARCHITECTURE.md) — Arquitectura MTV implementada

## 🎉 Estado del Proyecto

✅ **Completamente funcional y listo para producción**

El proyecto mantiene el 100% de la funcionalidad original de Laravel y ahora incluye gestión integral de tickets y habitaciones, con trazabilidad y administración desde Django.

---

**¡El sistema está listo para gestionar citas, estados, tickets y habitaciones de forma integral y escalable!**