<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React Logo" width="120"/>
  <br/>
  <br/>
  
  <img src="https://img.shields.io/badge/React-19.1.0-61dafb?logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-6.3.5-646cff?logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Ant%20Design-5.x-1677ff?logo=ant-design&logoColor=white" alt="Ant Design"/>
  <img src="https://img.shields.io/badge/ApexCharts-4.7.0-00b96b?logo=apexcharts&logoColor=white" alt="ApexCharts"/>
  <img src="https://img.shields.io/badge/Axios-1.9.0-5a29e4?logo=axios&logoColor=white" alt="Axios"/>
  <img src="https://img.shields.io/badge/React%20Router-7.6.2-34d058?logo=react-router&logoColor=white" alt="React Router"/>
 
</div>
 <br/>

 
# ReflexoPeru-V2-Front

Bienvenido al frontend de ReflexoPeru, una plataforma moderna para la gestión integral de clínicas de reflexología. Este proyecto está desarrollado en React + Vite y sigue una arquitectura modular, escalable y profesional.

## Descripción General

ReflexoPeru-V2-Front permite administrar pacientes, citas, reportes, personal y pagos, facilitando la operación diaria y la toma de decisiones mediante reportes y métricas visuales. El sistema está orientado a personal administrativo y terapeutas, brindando una experiencia de usuario ágil y eficiente.

## Tecnologías principales
- React
- Vite
- Ant Design
- ApexCharts
- Axios
- React Router

## Estructura del Proyecto

- **src/components/**: Componentes reutilizables (botones, inputs, tablas, modales, etc.)
- **src/features/**: Módulos funcionales (pacientes, citas, reportes, etc.)
- **src/pages/**: Páginas principales de la app
- **src/routes/**: Rutas y protección de rutas
- **src/services/**: Servicios de API y notificaciones
- **src/utils/**: Utilidades generales
- **src/assets/**: Imágenes y fuentes

## Arquitectura

```mermaid
flowchart TD
  Usuario -->|Navegador| Frontend[React App]
  Frontend --> Componentes[Componentes UI]
  Frontend --> Features[Módulos Funcionales]
  Frontend --> Servicios[Servicios/API]
  Componentes --> UI[Elementos visuales]
  Features --> Pacientes[Gestión de Pacientes]
  Features --> Citas[Gestión de Citas]
  Features --> Reportes[Reportes y Métricas]
  Servicios --> Backend[API Backend]



```

## Tabla de Navegación

| Sección                  | Descripción breve                                 | Enlace                         |
|--------------------------|---------------------------------------------------|---------------------------------|
| Componentes              | Componentes reutilizables y su uso                | [Ver más](./docs/components.md)           |
| Hooks                    | Hooks personalizados y ejemplos                   | [Ver más](./docs/hooks.md)                |
| Servicios                | Servicios de API, notificaciones y utilidades     | [Ver más](./docs/services.md)             |
| Rutas                    | Navegación y protección de vistas                 | [Ver más](./docs/routes.md)               |
| Estilos                  | Organización y buenas prácticas de CSS            | [Ver más](./docs/styles.md)               |
| Arquitectura             | Diagrama y explicación del flujo general          | [Ver más](./docs/arquitectura.md)         |

Para más detalles, consulta la documentación completa en la carpeta [`/docs`](./docs).

---

¿Tienes dudas o sugerencias? Revisa la sección de [FAQ](./docs/faq.md) o abre un issue en el repositorio.
