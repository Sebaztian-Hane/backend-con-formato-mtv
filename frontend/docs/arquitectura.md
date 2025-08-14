<div align="center">
  <img src="https://img.icons8.com/ios-filled/100/000000/blueprint.png" alt="Arquitectura" width="60"/>
  <br/>
  <img src="https://img.shields.io/badge/Diagrama-Mermaid-00b96b?logo=mermaid&logoColor=white" alt="Mermaid"/>
</div>

# Arquitectura

La arquitectura de ReflexoPeru-V2-Front está basada en una estructura modular y desacoplada, facilitando la escalabilidad y el mantenimiento.

## Diagrama de Arquitectura

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

## Explicación
- **Componentes**: Elementos reutilizables de la interfaz.
- **Features**: Módulos funcionales independientes (pacientes, citas, reportes, etc.).
- **Servicios**: Encapsulan la lógica de comunicación con APIs y servicios externos.
- **Backend**: Provee los datos y lógica de negocio a través de una API REST. 