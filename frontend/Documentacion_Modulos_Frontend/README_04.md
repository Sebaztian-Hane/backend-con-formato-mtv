# Guía de Pruebas Frontend - Módulo 04_therapists

## Índice
1. [Descripción General](#descripción-general)
2. [Estructura de Archivos](#estructura-de-archivos)
3. [Casos de Prueba](#casos-de-prueba)
4. [Procedimientos de Prueba](#procedimientos-de-prueba)
5. [Manejo de Errores](#manejo-de-errores)
6. [Métricas de Rendimiento](#métricas-de-rendimiento)

## Descripción General
Este documento proporciona una guía completa para realizar pruebas frontend del módulo de terapeutas (04_therapists).

## Estructura de Archivos

### Servicios
- <mcfile name="staffService.js" path="src/features/staff/service/staffService.js"></mcfile>
  - Gestiona las llamadas API para terapeutas
  - Incluye operaciones CRUD completas

### Hooks
- <mcfile name="staffHook.js" path="src/features/staff/hook/staffHook.js"></mcfile>
  - Maneja la lógica de estado
  - Gestiona operaciones asíncronas

### Componentes UI
- <mcfile name="infoTherapist.jsx" path="src/features/staff/ui/infoTherapist/infoTherapist.jsx"></mcfile>
  - Modal de información detallada

## Casos de Prueba

### 1. Listado de Terapeutas
- **Objetivo**: Verificar la carga y visualización correcta del listado de terapeutas
- **Pasos**:
  1. Acceder a la vista principal de terapeutas
  2. Verificar carga inicial
  3. Comprobar paginación
  4. Validar información mostrada

### 2. Búsqueda y Filtrado
- **Objetivo**: Validar funcionalidad de búsqueda
- **Pasos**:
  1. Ingresar términos de búsqueda
  2. Verificar resultados
  3. Comprobar filtros

### 3. Creación de Terapeuta
- **Objetivo**: Validar proceso de creación
- **Pasos**:
  1. Abrir formulario de creación
  2. Ingresar datos requeridos
  3. Validar campos obligatorios
  4. Verificar mensajes de error
  5. Confirmar creación exitosa

### 4. Actualización de Datos
- **Objetivo**: Verificar edición de información
- **Pasos**:
  1. Seleccionar terapeuta existente
  2. Modificar campos
  3. Validar actualizaciones
  4. Verificar persistencia

### 5. Eliminación
- **Objetivo**: Comprobar proceso de eliminación
- **Pasos**:
  1. Seleccionar terapeuta
  2. Confirmar eliminación
  3. Verificar actualización de lista

### 6. Visualización de Detalles
- **Objetivo**: Validar modal de información
- **Pasos**:
  1. Abrir detalles de terapeuta
  2. Verificar datos mostrados
  3. Comprobar campos específicos

## Procedimientos de Prueba

### Validaciones de Formulario
1. **Campos Requeridos**:
   - Nombre
   - Apellidos
   - Documento
   - Email

2. **Formatos Válidos**:
   - Email (formato correcto)
   - Teléfono (números)
   - Documentos (según tipo)

### Integración API
1. **Endpoints**:
   - GET `/therapists`
   - POST `/therapists`
   - PATCH `/therapists/{id}`
   - DELETE `/therapists/{id}`
   - GET `/therapists/search`

2. **Respuestas**:
   - Códigos HTTP correctos
   - Formato de datos
   - Manejo de errores

## Manejo de Errores

### Escenarios a Probar
1. **Errores de Red**:
   - Pérdida de conexión
   - Timeout
   - Respuestas 4xx/5xx

2. **Validaciones**:
   - Campos inválidos
   - Datos duplicados
   - Permisos insuficientes

### Mensajes de Error
- Verificar mensajes claros
- Comprobar toast notifications
- Validar estados de error en UI

## Métricas de Rendimiento

### Tiempos de Carga
1. **Carga Inicial**:
   - Tiempo hasta interactivo < 3s
   - Primera carga visible < 1s

2. **Operaciones**:
   - Búsqueda < 500ms
   - Creación/Actualización < 1s
   - Eliminación < 500ms

### Optimizaciones
1. **Caché**:
   - Verificar almacenamiento local
   - Comprobar invalidación

2. **Paginación**:
   - Rendimiento con grandes conjuntos
   - Scroll infinito/paginación

## Notas Adicionales

### Dependencias Clave
- Ant Design (componentes UI)
- Axios (llamadas API)
- React Context (estado global)
- Toast (notificaciones)

### Consideraciones de UX
1. **Feedback Visual**:
   - Spinners de carga
   - Indicadores de progreso
   - Estados de hover/focus

2. **Accesibilidad**:
   - Navegación por teclado
   - Lectores de pantalla
   - Contraste de colores

### Documentación Relacionada
- <mcfile name="optimizaciones-staff.md" path="docs/optimizaciones-staff.md"></mcfile>
- <mcfile name="arquitectura.md" path="docs/arquitectura.md"></mcfile>
- <mcfile name="components.md" path="docs/components.md"></mcfile>

## -----     
# Flujo de Interacción Usuario-Sistema en el Módulo de Terapeutas

## 1. Listado de Terapeutas

### Flujo de Usuario
1. Usuario accede a la página de terapeutas
2. Sistema:
   - Activa estado de carga (`loading: true`)
   - Ejecuta `loadStaff()` en <mcfile name="staffHook.js" path="src/features/staff/hook/staffHook.js"></mcfile>
   - Actualiza estado con datos recibidos
   - Desactiva estado de carga (`loading: false`)
   - Muestra lista paginada

### Manejo de Estados
```javascript
const [staff, setStaff] = useState([]);
const [loading, setLoading] = useState(false);
const [pagination, setPagination] = useState({
  currentPage: 1,
  totalItems: 0
});
```

## 2. Búsqueda de Terapeutas

### Flujo de Usuario
1. Usuario ingresa término de búsqueda
2. Sistema:
   - Activa estado de carga
   - Ejecuta `searchStaffByTerm(term)`
   - Actualiza lista con resultados
   - Actualiza paginación
   - Muestra resultados filtrados

### Manejo de Estados
```javascript
const [searchTerm, setSearchTerm] = useState('');
```

## 3. Creación de Terapeuta

### Flujo de Usuario
1. Usuario hace clic en "Nuevo Terapeuta"
2. Sistema muestra formulario modal
3. Usuario completa datos y envía
4. Sistema:
   - Valida campos
   - Muestra indicadores de carga
   - Procesa creación
   - Actualiza lista
   - Muestra notificación de éxito/error

### Manejo de Estados y Validaciones
- Formulario controlado con estados locales
- Validaciones en tiempo real
- Feedback visual inmediato

## 4. Visualización de Detalles

### Flujo de Usuario
1. Usuario selecciona terapeuta (clic en ícono de info)
2. Sistema:
   - Abre modal <mcfile name="infoTherapist.jsx" path="src/features/staff/ui/infoTherapist/infoTherapist.jsx"></mcfile>
   - Muestra información detallada

### Estructura de Datos Mostrados
```javascript
const fullName = `${therapist.paternal_lastname || ''} ${therapist.maternal_lastname || ''} ${therapist.name || ''}`.trim();
const avatarUrl = therapist.photo_url || null;
```

## 5. Actualización de Terapeuta

### Flujo de Usuario
1. Usuario selecciona editar terapeuta
2. Sistema:
   - Carga datos actuales en formulario
   - Usuario modifica campos
   - Sistema valida cambios
   - Procesa actualización
   - Actualiza lista y muestra notificación

### Manejo de Actualización
```javascript
const handleUpdateTherapist = async (id, formData) => {
  setLoading(true);
  try {
    // Proceso de actualización
    showToast('exito', 'Terapeuta actualizado');
  } catch (error) {
    showToast('error', 'Error en actualización');
  }
  setLoading(false);
};
```

## 6. Eliminación de Terapeuta

### Flujo de Usuario
1. Usuario selecciona eliminar terapeuta
2. Sistema:
   - Muestra confirmación
   - Procesa eliminación
   - Actualiza lista
   - Muestra notificación

### Manejo de Eliminación
```javascript
const handleDeleteTherapist = async (id) => {
  try {
    // Proceso de eliminación
    setStaff(prevStaff => prevStaff.filter(t => t.id !== id));
    showToast('exito', 'Terapeuta eliminado');
  } catch (error) {
    showToast('error', 'Error en eliminación');
  }
};
```

## 7. Manejo de Estados Globales

### Estados Principales
1. **Loading**:
   - Controla spinners y deshabilitación de controles
   - Previene acciones múltiples

2. **Error**:
   - Captura y muestra errores
   - Maneja reintentos

3. **Paginación**:
   - Mantiene estado de página actual
   - Controla total de items

### Sistema de Notificaciones
- Utiliza `ToastContext` para mensajes
- Tipos: éxito, error, info
- Duración configurable

## 8. Optimizaciones

### Actualizaciones Optimistas
1. Lista se actualiza inmediatamente
2. Cambios se confirman en background
3. Rollback en caso de error

### Caché y Rendimiento
1. Datos se mantienen en memoria
2. Paginación eficiente
3. Búsqueda optimizada

## 9. Manejo de Errores

### Niveles de Error
1. **Validación de Campos**:
   - Feedback inmediato
   - Mensajes específicos

2. **Errores de Red**:
   - Reintentos automáticos
   - Mensajes amigables

3. **Errores de Estado**:
   - Recuperación automática
   - Mantenimiento de consistencia
