<div align="center">
  <img src="https://img.shields.io/badge/React-19.1.0-61dafb?logo=react&logoColor=white" alt="React"/>
</div>

# Hooks Personalizados

Los hooks encapsulan lógica reutilizable y permiten separar la lógica de negocio de los componentes. En este proyecto, los hooks están organizados por módulo y también existen hooks globales.

## Organización
- Hooks globales: `src/hooks/`
- Hooks por módulo: `src/features/[modulo]/hook/`

## Ejemplos de hooks por módulo

### Autenticación
- **authHook.js**: Maneja login, logout y estado de usuario.

### Pacientes
- **patientsHook.js**: Lógica para gestión de pacientes (registro, edición, búsqueda).

### Citas
- **appointmentsHook.js**: Lógica para gestión de citas.
- **appointmentsCompleteHook.js**: Lógica para citas completadas.

### Reportes
- **reportsHook.js**: Lógica para generación y filtrado de reportes.

### Staff
- **staffHook.js**: Lógica para gestión de terapeutas y personal.

### Estadísticas
- **useStatistic.js**: Lógica para métricas y dashboard.

### Otros
- **loginpacticles.js**: Efectos visuales en el login.

Cada hook está documentado con comentarios en el código fuente y se recomienda revisar los archivos para ver los detalles de uso. 