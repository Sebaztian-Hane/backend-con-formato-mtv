<div align="center">
  <img src="https://img.icons8.com/ios-filled/100/000000/route.png" alt="Rutas" width="60"/>
  <br/>
  <img src="https://img.shields.io/badge/React%20Router-7.6.2-34d058?logo=react-router&logoColor=white" alt="React Router"/>
</div>

# Rutas

Las rutas definen la navegación principal de la aplicación y la protección de acceso a ciertas vistas. Están organizadas y protegidas para garantizar la seguridad y la experiencia de usuario.

## Organización
- Definidas en `src/routes/Router.jsx`.
- Rutas protegidas mediante `ProtectedRoute.jsx`.
- Contexto de autenticación en `AuthContext.jsx`.

## Ejemplos de rutas principales
- `/login`: Página de inicio de sesión.
- `/dashboard`: Panel principal tras autenticación.
- `/pacientes`: Gestión de pacientes.
- `/citas`: Gestión de citas.
- `/reportes`: Visualización y descarga de reportes.
- `/usuarios`: Gestión de usuarios y perfiles.

Para modificar o agregar rutas, edita `src/routes/Router.jsx` y utiliza `ProtectedRoute` para restringir el acceso según el estado de autenticación. 