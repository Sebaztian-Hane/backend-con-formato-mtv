# Guía de Pruebas Frontend - Módulo 05_appointments_status

## Descripción General
Este módulo maneja la gestión de citas y sus estados, incluyendo la creación, actualización, visualización y eliminación de citas, así como la generación de tickets y reportes.

1. **Componentes Principales:**
   - <mcfile name="appointments.jsx" path="src/features/appointments/ui/appointments.jsx"></mcfile>: Componente principal para la gestión de citas
   Pruebas que se pueden hacer:
- Paginación de resultados
- Filtros de búsqueda
- Ordenamiento de columnas
- Actualización en tiempo real
   - <mcfile name="NewAppointment.jsx" path="src/features/appointments/ui/RegisterAppointment/NewAppointment.jsx"></mcfile>: Manejo de registro de nuevas citas
   Pruebas que se pueden hacer:
- Crear cita con todos los campos obligatorios
- Validar selección de paciente
- Verificar selección de fecha y hora
- Comprobar selección de estado inicial
- Validar cálculo de pagos
   - <mcfile name="EditAppointment.jsx" path="src/features/appointments/ui/EditAppointment/EditAppointment.jsx"></mcfile>: Componente para edición de citas
   Pruebas que se pueden hacer:
- Modificar fecha/hora
- Cambiar estado de la cita
- Actualizar información de pago
- Verificar persistencia de cambios

1.1 **Componentes de Citas Completadas:**
   - <mcfile name="appointmentsComplete.jsx" path="src/features/appointmentsComplete/ui/appointmentsComplete.jsx"></mcfile>: Vista de citas completadas
   - <mcfile name="appointmentsCompleteService.js" path="src/features/appointmentsComplete/service/appointmentsCompleteService.js"></mcfile>: Servicios para citas completadas
   - <mcfile name="appointmentsCompleteHook.js" path="src/features/appointmentsComplete/hook/appointmentsCompleteHook.js"></mcfile>: Hook personalizado

1.2 **Componentes de Calendario:**
   - <mcfile name="Calendar.jsx" path="src/features/calendar/ui/Calendar.jsx"></mcfile>: Vista de calendario
   Pruebas que se pueden hacer:
- Mostrar citas por estado
- Navegación entre fechas
- Interacción con eventos
- Actualización en tiempo real
   - <mcfile name="calendarService.js" path="src/features/calendar/service/calendarService.js"></mcfile>: Servicios del calendario
   - <mcfile name="calendarHook.js" path="src/features/calendar/hook/calendarHook.js"></mcfile>: Hook para el calendario
   - <mcfile name="CalendarOverrides.css" path="src/features/calendar/ui/CalendarOverrides.css"></mcfile>: Estilos del calendario

2. **Hooks Personalizados:**
   - <mcfile name="appointmentsHook.js" path="src/features/appointments/hook/appointmentsHook.js"></mcfile>: 
     - `useAppointments`: Maneja el estado y lógica de las citas
     - `usePatients`: Gestiona la información de pacientes relacionada con las citas

3. **Componentes de UI Reutilizables:**
   - <mcfile name="CustomTimeFilter.jsx" path="src/components/DateSearch/CustomTimeFilter.jsx"></mcfile>: Filtro de tiempo para citas
   - <mcfile name="CustomSearch.jsx" path="src/components/Search/CustomSearch.jsx"></mcfile>: Búsqueda personalizada
   - <mcfile name="ModeloTable.jsx" path="src/components/Table/Tabla.jsx"></mcfile>: Tabla reutilizable
   - <mcfile name="ExcelPreviewTable.jsx" path="src/components/PdfTemplates/ExcelPreviewTable.jsx"></mcfile>: Vista previa de Excel
   - <mcfile name="TicketPDF.jsx" path="src/components/PdfTemplates/TicketPDF.jsx"></mcfile>: Generación de tickets
   Pruebas que se pueden hacer:
- Generación de PDF
- Datos correctos
- Formato adecuado
   - <mcfile name="FichaPDF.jsx" path="src/components/PdfTemplates/FichaPDF.jsx"></mcfile>: Generación de fichas
   Pruebas que se pueden hacer:
- Generación de ficha
- Información completa
- Formato correcto

4. **Servicios y Utilidades:**
   - <mcfile name="ToastContext.jsx" path="src/services/toastify/ToastContext.jsx"></mcfile>: Sistema de notificaciones
   - <mcfile name="Toast.jsx" path="src/services/toastify/Toast.jsx"></mcfile>: Componente de notificaciones

5. **Funcionalidades Principales:**
   - Gestión de citas (CRUD completo)
   - Manejo de estados de citas
   - Generación de documentos (tickets y fichas)
   - Búsqueda y filtrado de citas
   - Validaciones de formularios
   - Notificaciones de sistema
   - Integración con el módulo de pacientes

6. **Interacciones con API Backend:**
   El frontend interactúa con varios endpoints del backend:
   - `/api/appointments`: Gestión de citas
   - `/api/patients`: Integración con pacientes
   - `/api/appointments/status`: Manejo de estados de citas

7. **Estilos:**
   - <mcfile name="appointments.module.css" path="src/features/appointments/ui/appointments.module.css"></mcfile>
   - <mcfile name="NewAppointment.module.css" path="src/features/appointments/ui/RegisterAppointment/NewAppointment.module.css"></mcfile>
   - <mcfile name="appointmentsComplete.module.css" path="src/features/appointmentsComplete/ui/appointmentsComplete.module.css"></mcfile>

Todas estas interacciones están manejadas a través de hooks personalizados y servicios que centralizan la lógica de negocio y el manejo del estado de la aplicación.

## ---------------------------------------------------------------------



          
# Flujo de Interacción Usuario-Sistema en el Módulo de Citas

## 1. Listado de Citas (Vista Principal)

### Usuario → Frontend
- El usuario accede a la vista principal de citas (<mcfile name="appointments.jsx" path="src/features/appointments/ui/appointments.jsx"></mcfile>)
- Interactúa con filtros de búsqueda (<mcfile name="CustomSearch.jsx" path="src/components/Search/CustomSearch.jsx"></mcfile>)
- Utiliza filtros de tiempo (<mcfile name="CustomTimeFilter.jsx" path="src/components/DateSearch/CustomTimeFilter.jsx"></mcfile>)
- Navega por la paginación

### Frontend → Backend
- El hook <mcfile name="appointmentsHook.js" path="src/features/appointments/hook/appointmentsHook.js"></mcfile> gestiona las peticiones
- Envía solicitudes a `/api/appointments` con parámetros de:
  - Búsqueda
  - Filtros de tiempo
  - Paginación

### Backend → Frontend → Usuario
- El backend responde con datos paginados
- El frontend actualiza el estado mediante `useAppointments`
- Se muestra la información en <mcfile name="ModeloTable.jsx" path="src/components/Table/Tabla.jsx"></mcfile>
- Las notificaciones de éxito/error se muestran via <mcfile name="Toast.jsx" path="src/services/toastify/Toast.jsx"></mcfile>

## 2. Creación de Citas

### Usuario → Frontend
- Usuario accede al formulario de nueva cita (<mcfile name="NewAppointment.jsx" path="src/features/appointments/ui/RegisterAppointment/NewAppointment.jsx"></mcfile>)
- Completa campos obligatorios:
  - Selección de paciente
  - Fecha/hora
  - Estado inicial
  - Información de pago

### Frontend → Backend
- Validaciones de formulario en frontend
- `useAppointments` prepara los datos
- Envía POST a `/api/appointments`
- Si hay nuevo paciente, interactúa con `/api/patients`

### Backend → Frontend → Usuario
- Respuesta de creación exitosa/error
- Actualización automática de la lista de citas
- Notificación via <mcfile name="ToastContext.jsx" path="src/services/toastify/ToastContext.jsx"></mcfile>
- Redirección a la vista principal

## 3. Edición de Citas

### Usuario → Frontend
- Accede a <mcfile name="EditAppointment.jsx" path="src/features/appointments/ui/EditAppointment/EditAppointment.jsx"></mcfile>
- Modifica campos:
  - Fecha/hora
  - Estado
  - Información de pago

### Frontend → Backend
- Validaciones en frontend
- PUT a `/api/appointments/{id}`
- Para cambios de estado: PUT a `/api/appointments/status/{id}`

### Backend → Frontend → Usuario
- Confirmación de actualización
- Actualización en tiempo real de la vista
- Notificación de cambios

## 4. Calendario de Citas

### Usuario → Frontend
- Interactúa con <mcfile name="Calendar.jsx" path="src/features/calendar/ui/Calendar.jsx"></mcfile>
- Navega entre fechas
- Filtra por estados

### Frontend → Backend
- <mcfile name="calendarService.js" path="src/features/calendar/service/calendarService.js"></mcfile> gestiona peticiones
- Solicitudes a endpoints de citas pendientes y completadas

### Backend → Frontend → Usuario
- Datos de citas filtrados por fecha
- Actualización del calendario
- Vista con estilos de <mcfile name="CalendarOverrides.css" path="src/features/calendar/ui/CalendarOverrides.css"></mcfile>

## 5. Generación de Documentos

### Usuario → Frontend
- Solicita generación de ticket (<mcfile name="TicketPDF.jsx" path="src/components/PdfTemplates/TicketPDF.jsx"></mcfile>)
- Solicita ficha (<mcfile name="FichaPDF.jsx" path="src/components/PdfTemplates/FichaPDF.jsx"></mcfile>)

### Frontend → Backend
- Solicitud de datos necesarios para documentos
- Peticiones a endpoints correspondientes

### Backend → Frontend → Usuario
- Datos para documentos
- Generación de PDF en frontend
- Descarga automática o visualización

## 6. Citas Completadas

### Usuario → Frontend
- Accede a vista de citas completadas (<mcfile name="appointmentsComplete.jsx" path="src/features/appointmentsComplete/ui/appointmentsComplete.jsx"></mcfile>)
- Utiliza filtros y búsqueda

### Frontend → Backend
- <mcfile name="appointmentsCompleteService.js" path="src/features/appointmentsComplete/service/appointmentsCompleteService.js"></mcfile> gestiona peticiones
- Solicitudes filtradas a endpoint de citas completadas

### Backend → Frontend → Usuario
- Lista de citas completadas
- Actualización de vista
- Exportación a Excel si se solicita (<mcfile name="ExcelPreviewTable.jsx" path="src/components/PdfTemplates/ExcelPreviewTable.jsx"></mcfile>)

Cada interacción está respaldada por el sistema de notificaciones que informa al usuario sobre el éxito o fracaso de sus acciones, manteniendo una experiencia fluida y retroalimentación constante.
        