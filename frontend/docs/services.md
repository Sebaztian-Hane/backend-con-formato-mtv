<div align="center">
  <img src="https://img.icons8.com/ios-filled/100/000000/service-bell.png" alt="Servicios" width="60"/>
  <br/>
  <img src="https://img.shields.io/badge/Axios-1.9.0-5a29e4?logo=axios&logoColor=white" alt="Axios"/>
</div>

# Servicios

Los servicios gestionan la comunicación con APIs, notificaciones y otras funcionalidades externas. Están organizados por tipo y por módulo.

## Organización
- Servicios de API: `src/services/api/Axios/`
- Servicios de notificaciones: `src/services/toastify/`
- Servicios por módulo: `src/features/[modulo]/service/`
- Utilidades generales: `src/utils/`

## Ejemplos de servicios

### API
- **baseConfig.js**: Configuración base de Axios para llamadas HTTP.
- **MethodsGeneral.js**: Métodos generales para peticiones HTTP.

### Notificaciones
- **toastConfig.js**: Configuración de notificaciones Toastify.
- **ToastContext.jsx**: Contexto para mostrar notificaciones globales.

### Por módulo
- **patientsService.js**: Lógica de API para pacientes.
- **appointmentsService.js**: Lógica de API para citas.
- **reportsService.js**: Lógica de API para reportes.
- **profileService.js**: Lógica de API para perfil de usuario.

### Utilidades
- **localStorageUtility.js**: Helpers para manejo de localStorage.
- **vars.js**: Variables y constantes globales.

Consulta cada archivo para ver los métodos y ejemplos de uso específicos. 