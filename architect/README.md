# 01_architect - Módulo de Arquitectura del Sistema

Este módulo contiene toda la funcionalidad de autenticación, usuarios, permisos y roles del sistema, reorganizada en una estructura modular y mantenible.

## Estructura del Módulo

```
01_architect/
├── __init__.py
├── apps.py
├── models/
│   ├── __init__.py
│   ├── user.py           # User, UserVerificationCode
│   ├── permission.py     # Permission, Role
│   └── base.py           # Modelos base abstractos
├── serializers/
│   ├── __init__.py
│   ├── auth.py           # Login, Register
│   ├── user.py           # User serializers
│   └── permission.py     # Permission serializers
├── views/
│   ├── __init__.py
│   ├── auth.py           # Auth controllers
│   ├── user.py           # User controllers
│   └── permission.py     # Permission controllers
├── services/
│   ├── __init__.py
│   ├── auth_service.py   # Lógica de autenticación
│   ├── user_service.py   # Lógica de usuarios
│   └── permission_service.py # Lógica de permisos
├── middleware/
│   ├── __init__.py
│   └── optional_auth.py  # OptionalAuthenticate
├── permissions/
│   ├── __init__.py
│   └── custom.py         # Permisos personalizados
├── utils/
│   ├── __init__.py
│   ├── jwt.py            # Utilidades JWT
│   └── constants.py      # Constantes del sistema
├── urls.py               # Todas las URLs del módulo
├── admin.py              # Admin de Django
└── migrations/           # Migraciones de la base de datos
```

## Funcionalidades

### Autenticación
- Login con JWT
- Registro de usuarios
- Verificación de códigos
- Cambio de contraseñas

### Usuarios
- CRUD completo de usuarios
- Gestión de roles
- Verificación de usuarios

### Permisos y Roles
- Sistema de permisos basado en Django Guardian
- Roles personalizados (Admin, Member, User)
- Permisos a nivel de objeto

### Servicios
- Lógica de negocio separada de las vistas
- Servicios reutilizables
- Manejo de errores centralizado

## URLs del API

- `POST /api/architect/auth/login/` - Login de usuario
- `POST /api/architect/auth/register/` - Registro de usuario
- `GET /api/architect/users/` - Lista de usuarios
- `GET /api/architect/permissions/` - Lista de permisos
- `GET /api/architect/roles/` - Lista de roles

## Configuración

El módulo está configurado en `config/settings.py`:

```python
INSTALLED_APPS = [
    # ...
    '01_architect.apps.ArchitectConfig',
]

AUTH_USER_MODEL = '01_architect.User'

MIDDLEWARE += [
    '01_architect.middleware.optional_auth.OptionalAuthenticate',
]
```

## Migración

Para aplicar las migraciones:

```bash
python manage.py makemigrations 01_architect
python manage.py migrate
```

## Uso

### Crear un superusuario
```bash
python manage.py createsuperuser
```

### Acceder al admin
```
http://localhost:8000/admin/
```

## Dependencias

- Django 5.2+
- Django REST Framework
- Django Guardian
- djangorestframework-simplejwt

## Notas de Migración

Este módulo reemplaza las siguientes aplicaciones anteriores:
- `authentication`
- `Auth`
- `permissions`
- `roles`
- `services`
- `Controllers`

Todas las funcionalidades han sido migradas y reorganizadas manteniendo la compatibilidad con el sistema existente. 