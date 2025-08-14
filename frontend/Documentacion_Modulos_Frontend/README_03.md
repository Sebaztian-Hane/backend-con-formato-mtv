# Guía de Pruebas Frontend - Módulo 03_patients_diagnoses

## 1. Descripción General
Este módulo maneja la gestión de pacientes y diagnósticos, incluyendo el registro, actualización y visualización de historias clínicas.

## 2. Componentes Principales

### 2.1 Gestión de Pacientes
**Ubicación**: <mcfile name="patients.jsx" path="src/features/patients/ui/patients.jsx"></mcfile>

#### Funcionalidades a Probar:
- **Listado de Pacientes**
  - Verificar la carga inicial de la lista
  - Comprobar la paginación
  - Validar el ordenamiento de columnas

- **Búsqueda de Pacientes**
  - Búsqueda por nombre
  - Búsqueda por número de documento
  - Validar resultados en tiempo real

- **Gestión de Pacientes**
  - Crear nuevo paciente
  - Editar información existente
  - Eliminar paciente
  - Validar mensajes de confirmación

### 2.2 Historia Clínica
**Ubicación**: <mcfile name="PatientHistory.jsx" path="src/features/history/ui/PatientHistory.jsx"></mcfile>

#### Funcionalidades a Probar:
- **Información General**
  - Datos personales del paciente
  - Historial médico
  - Observaciones privadas y públicas

- **Diagnósticos**
  - Registro de diagnósticos
  - Actualización de diagnósticos existentes
  - Validación de campos requeridos

- **Gestión de Terapeutas**
  - Asignación de terapeuta
  - Cambio de terapeuta
  - Eliminación de terapeuta

## 3. Casos de Prueba

### 3.1 Registro de Pacientes
1. **Datos Válidos**
   - Ingresar todos los campos requeridos
   - Verificar la creación exitosa
   - Comprobar la redirección

2. **Validaciones**
   - Campos vacíos
   - Formatos inválidos (email, teléfono)
   - Documentos duplicados

### 3.2 Historia Clínica
1. **Creación**
   - Registro de historia nueva
   - Validación de campos obligatorios
   - Guardado de información

2. **Actualización**
   - Modificación de diagnósticos
   - Actualización de observaciones
   - Cambios en información médica

### 3.3 Integración
1. **Flujo Completo**
   - Registro de paciente
   - Creación de historia
   - Asignación de terapeuta
   - Registro de diagnóstico

2. **Manejo de Errores**
   - Pérdida de conexión
   - Errores del servidor
   - Conflictos de datos

## 4. Herramientas y Hooks

### 4.1 Hooks Principales
- **usePatients**
  - Gestión del estado de pacientes
  - Operaciones CRUD
  - Manejo de errores

- **usePatientHistory**
  - Carga de historia clínica
  - Actualizaciones
  - Validaciones

### 4.2 Servicios
- Verificar integración con APIs
- Validar manejo de respuestas
- Comprobar gestión de errores

## 5. Consideraciones Especiales

### 5.1 Rendimiento
- Tiempo de carga inicial
- Respuesta en búsquedas
- Manejo de listas grandes

### 5.2 UX/UI
- Mensajes de feedback
- Estados de carga
- Validaciones en tiempo real

### 5.3 Seguridad
- Validación de permisos
- Protección de rutas
- Manejo de sesiones

## 6. Documentación de Errores
Para cada prueba fallida, documentar:
- Pasos para reproducir
- Comportamiento esperado
- Comportamiento actual
- Evidencia (capturas, logs)

## 7. Ambiente de Pruebas
1. **Preparación**
   - Base de datos limpia
   - Datos de prueba preparados
   - Usuario con permisos correctos

2. **Herramientas Recomendadas**
   - React Developer Tools
   - Network Inspector
   - Console Logger

## 8. Checklist de Pruebas

### 8.1 Pre-requisitos
- [ ] Ambiente configurado
- [ ] Datos de prueba listos
- [ ] Permisos configurados

### 8.2 Pruebas Funcionales
- [ ] CRUD de pacientes
- [ ] Gestión de historia clínica
- [ ] Manejo de diagnósticos
- [ ] Asignación de terapeutas

### 8.3 Validaciones
- [ ] Campos requeridos
- [ ] Formatos de datos
- [ ] Mensajes de error
- [ ] Confirmaciones

### 8.4 Integración
- [ ] Flujos completos
- [ ] Manejo de errores
- [ ] Persistencia de datos
- [ ] Sincronización

## 9. Reporte de Pruebas
Documentar para cada sesión:
1. Casos probados
2. Resultados obtenidos
3. Errores encontrados
4. Evidencias recopiladas
5. Recomendaciones

## 10.Flujo que Sigue:



          
# Flujo de Interacción Usuario-Sistema en el Módulo 03_patients_diagnoses

## 1. Gestión de Pacientes

### 1.1 Listado de Pacientes
**Flujo de interacción:**
1. Usuario accede a la vista de pacientes
2. Sistema:
   - Ejecuta `loadPatients()` en <mcfile name="patientsHook.js" path="src/features/patients/hook/patientsHook.js"></mcfile>
   - Actualiza el estado con `setPatients()`
   - Muestra la lista en la interfaz

### 1.2 Búsqueda de Pacientes
**Flujo de interacción:**
1. Usuario ingresa término de búsqueda
2. Sistema:
   - Activa `handleSearch()` en <mcfile name="patients.jsx" path="src/features/patients/ui/patients.jsx"></mcfile>
   - Ejecuta `searchPatientsByTerm()` después de 1.2 segundos (debounce)
   - Actualiza la lista de resultados

### 1.3 Registro de Nuevo Paciente
**Flujo de interacción:**
1. Usuario hace clic en "Registrar"
2. Sistema navega a la vista de registro (`navigate('registrar')`)
3. Usuario completa el formulario
4. Al enviar:
   - Sistema ejecuta `submitNewPatient()`
   - Muestra notificación de éxito/error
   - Actualiza la lista de pacientes

### 1.4 Edición de Paciente
**Flujo de interacción:**
1. Usuario selecciona "Editar"
2. Sistema:
   - Ejecuta `handleEdit()`
   - Carga datos actuales del paciente
   - Muestra formulario de edición
3. Usuario modifica datos
4. Al guardar:
   - Sistema ejecuta `handleUpdatePatient()`
   - Muestra notificación
   - Actualiza la lista

## 2. Historia Clínica

### 2.1 Acceso a Historia
**Flujo de interacción:**
1. Usuario hace clic en "Historia"
2. Sistema:
   - Navega a `historia/${record.id}`
   - Carga datos con `usePatientHistory(id)`
   - Muestra el formulario con datos

### 2.2 Gestión de Terapeutas
**Flujo de interacción:**
1. Usuario selecciona "Asignar Terapeuta"
2. Sistema:
   - Ejecuta `showTherapistModal()`
   - Muestra lista de terapeutas
3. Usuario selecciona terapeuta:
   - Sistema ejecuta `handleSelectTherapist()`
   - Actualiza el formulario

### 2.3 Actualización de Historia
**Flujo de interacción:**
1. Usuario modifica campos
2. Al guardar:
   - Sistema valida datos
   - Ejecuta actualizaciones correspondientes
   - Muestra notificación de resultado

## 3. Manejo de Estados y Respuestas

### 3.1 Estados de Carga
- Sistema muestra spinners durante operaciones:
  ```jsx
  {loadingEditId === record.id ? (
    <Spin size="small" style={{ color: '#fff' }} />
  ) : (
    'Editar'
  )}
  ```

### 3.2 Notificaciones
- Sistema utiliza el componente Toast para feedback:
  - Éxito en operaciones
  - Errores de validación
  - Errores de sistema

### 3.3 Manejo de Errores
1. Error en carga:
   - Sistema muestra mensaje de error
   - Mantiene estado anterior
   - Permite reintentar operación

2. Error en guardado:
   - Muestra mensaje específico
   - Mantiene datos en formulario
   - Permite corregir y reintentar

## 4. Optimizaciones

### 4.1 Debounce en Búsqueda
```javascript
useEffect(() => {
  const delayDebounce = setTimeout(() => {
    if (searchTerm.trim()) {
      searchPatientsByTerm(searchTerm.trim());
    } else {
      loadPatients(1);
    }
  }, 1200);

  return () => clearTimeout(delayDebounce);
}, [searchTerm]);
```

### 4.2 Caché de Datos
- Sistema mantiene estado local para operaciones frecuentes
- Actualiza solo cuando es necesario
- Usa paginación para optimizar carga

## 5. Validaciones

### 5.1 Campos Requeridos
- Sistema valida antes de enviar
- Muestra mensajes específicos
- Mantiene estado del formulario

### 5.2 Formato de Datos
- Validación de tipos
- Formato de fechas
- Datos numéricos
        