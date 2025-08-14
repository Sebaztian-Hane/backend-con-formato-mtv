# Sistema de Gestión de Citas y Tickets

## Descripción
Este es un proyecto Django en desarrollo que implementa un sistema de gestión integral para manejar citas, salas, tickets y estados. El sistema está diseñado para facilitar la administración de recursos y la programación de actividades.

## Características del Proyecto

### Módulos Principales

- **Appointments (Citas)**: Gestión de citas y programación de actividades
- **Rooms (Salas)**: Administración de espacios y recursos físicos
- **Tickets**: Sistema de tickets para seguimiento de solicitudes
- **Statuses (Estados)**: Control de estados y flujos de trabajo

### Tecnologías Utilizadas

- **Django 5.2.5**: Framework web de Python
- **SQLite**: Base de datos para desarrollo
- **Python**: Lenguaje de programación principal

## Estructura del Proyecto

```
├── core/                   # Configuración principal de Django
│   ├── settings.py        # Configuraciones del proyecto
│   ├── urls.py           # URLs principales
│   ├── asgi.py           # Configuración ASGI
│   └── wsgi.py           # Configuración WSGI
├── appointments/          # Aplicación de citas
│   ├── models/           # Modelos de datos
│   ├── views/            # Vistas y lógica de negocio
│   ├── admin.py          # Configuración del admin
│   └── apps.py           # Configuración de la aplicación
├── rooms/                # Aplicación de salas
├── tickets/              # Aplicación de tickets
├── statuses/             # Aplicación de estados
├── manage.py             # Script de gestión de Django
└── db.sqlite3            # Base de datos SQLite
```

## Instalación y Configuración

### Prerrequisitos

- Python 3.8 o superior
- pip (gestor de paquetes de Python)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd <nombre-del-proyecto>
   ```

2. **Crear entorno virtual**
   ```bash
   python -m venv env
   ```

3. **Activar entorno virtual**
   - Windows:
     ```bash
     env\Scripts\activate
     ```
   - Linux/Mac:
     ```bash
     source env/bin/activate
     ```

4. **Instalar dependencias**
   ```bash
   pip install -r requirements.txt
   ```

5. **Ejecutar migraciones**
   ```bash
   python manage.py migrate
   ```

6. **Crear superusuario (opcional)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Ejecutar el servidor de desarrollo**
   ```bash
   python manage.py runserver
   ```

## Uso

Una vez que el servidor esté ejecutándose, puedes acceder a:

- **Admin de Django**: http://127.0.0.1:8000/admin/
- **Aplicación principal**: http://127.0.0.1:8000/

## Estado del Desarrollo

⚠️ **Proyecto en Desarrollo**

Este proyecto se encuentra actualmente en fase de desarrollo inicial. Los módulos están creados pero aún no tienen implementación completa de:

- Modelos de datos
- Vistas y formularios
- URLs específicas de cada aplicación
- Templates HTML
- Funcionalidades de negocio

### Próximos Pasos

1. Definir modelos de datos para cada aplicación
2. Implementar vistas y formularios
3. Crear templates HTML
4. Configurar URLs específicas
5. Implementar lógica de negocio
6. Agregar autenticación y autorización
7. Crear tests unitarios

## Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## Licencia

Este proyecto está bajo desarrollo. Los términos de licencia se definirán próximamente.

## Contacto

Para preguntas o soporte, por favor contacta al equipo de desarrollo.

---

**Nota**: Este README se actualizará conforme el proyecto evolucione y se implementen nuevas funcionalidades.
