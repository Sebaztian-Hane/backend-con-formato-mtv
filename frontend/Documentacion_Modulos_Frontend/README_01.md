# Guía de Pruebas Frontend - Módulo 01 Architect 🏗️

## 1. Descripción General
Este módulo maneja la autenticación y autorización del sistema. Las pruebas frontend deben enfocarse en la interacción usuario-sistema y la correcta integración con las APIs backend.

## 2. Componentes a Probar

### 2.1 Componentes de UI
- <mcfile name="login.jsx" path="src/features/auth/ui/login.jsx"></mcfile>
  - Formulario de login
  - Validación de campos
  - Mensajes de error
  - Redirección post-login
  - Visibilidad de contraseña

- <mcfile name="ChangesPassword.jsx" path="src/features/auth/ui/ChangesPassword/ChangesPassword.jsx"></mcfile>
  - Validación de contraseñas
  - Confirmación de cambios
  - Manejo de errores

### 2.2 Hooks y Servicios
- <mcfile name="authHook.js" path="src/features/auth/hook/authHook.js"></mcfile>
  - Estado de autenticación
  - Manejo de tokens
  - Persistencia de sesión

- <mcfile name="authService.js" path="src/features/auth/service/authService.js"></mcfile>
  - Integración con APIs
  - Manejo de respuestas

## 3. Casos de Prueba

### 3.1 Login
1. **Validación de Campos**
   - Email vacío
   - Email inválido
   - Contraseña vacía
   - Credenciales incorrectas

2. **Flujo Exitoso**
   - Login correcto
   - Almacenamiento de token
   - Redirección apropiada

### 3.2 Cambio de Contraseña
1. **Validaciones**
   - Contraseña actual correcta
   - Nueva contraseña cumple requisitos
   - Confirmación coincide

2. **Mensajes de Error**
   - Contraseña actual incorrecta
   - Nueva contraseña inválida
   - Confirmación no coincide

### 3.3 Manejo de Sesión
1. **Persistencia**
   - Token almacenado correctamente
   - Datos de usuario en localStorage
   - Recuperación post-refresh

2. **Cierre de Sesión**
   - Limpieza de datos
   - Redirección correcta

## 4. APIs para Pruebas

```javascript
// Autenticación
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout

// Verificación
POST /api/auth/verify-email
POST /api/auth/reset-password

// Información de Usuario
GET /api/auth/user
GET /api/auth/permissions
```

## 5. Datos de Prueba

### 5.1 Usuario de Prueba
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

### 5.2 Respuestas Esperadas
- Login exitoso: Status 200 + token
- Error de credenciales: Status 401
- Error de validación: Status 422

## 6. Herramientas Recomendadas
- React Developer Tools
- Redux DevTools (si aplica)
- Chrome DevTools (Network, Application)

## 7. Consideraciones Especiales

### 7.1 Seguridad
- Verificar almacenamiento seguro de tokens
- Comprobar expiración de sesión
- Validar manejo de CORS

### 7.2 UX/UI
- Validar estados de carga
- Comprobar mensajes de error
- Verificar accesibilidad

### 7.3 Integración
- Probar integración con contextos:
  - <mcfile name="UserContext.jsx" path="src/context/UserContext.jsx"></mcfile>
  - <mcfile name="CompanyContext.jsx" path="src/context/CompanyContext.jsx"></mcfile>

## 8. Flujo de Pruebas Recomendado
1. Login básico
2. Validaciones de formularios
3. Manejo de errores
4. Persistencia de sesión
5. Cambio de contraseña
6. Cierre de sesión
7. Casos de error
8. Pruebas de integración

## 9. Documentación Relacionada
- <mcfile name="README.md" path="01_architect/README.md"></mcfile>
- <mcfile name="hooks.md" path="docs/hooks.md"></mcfile>

## -------------------------------------------------------------------

## 10.Flujo de Interacción Usuario-Sistema en el Módulo 01

## 1. Proceso de Login

### Paso 1: Interacción del Usuario
1. Usuario ingresa a la página de login (<mcfile name="login.jsx" path="src/features/auth/ui/login.jsx"></mcfile>)
2. Completa campos de email y contraseña
3. Hace clic en "Iniciar Sesión"

### Paso 2: Validación Frontend
1. El componente Login valida:
   - Campos no vacíos
   - Formato de email válido
   - Longitud mínima de contraseña

### Paso 3: Llamada al Servicio
1. Si la validación es exitosa:
   ```javascript
   const { login } = useAuth(); // Hook personalizado
   await login(credentials); // Llama al servicio de autenticación
   ```

### Paso 4: Procesamiento de Respuesta
1. Si es exitoso:
   - Almacena token en localStorage
   - Actualiza estado de autenticación
   - Redirecciona al dashboard
2. Si hay error:
   - Muestra mensaje de error
   - Mantiene al usuario en la página de login

## 2. Cambio de Contraseña

### Paso 1: Acceso
1. Usuario navega a la página de cambio de contraseña
2. Sistema verifica autenticación mediante token

### Paso 2: Formulario
1. Usuario ingresa:
   - Contraseña actual
   - Nueva contraseña
   - Confirmación de nueva contraseña

### Paso 3: Validación y Envío
1. <mcfile name="ChangesPassword.jsx" path="src/features/auth/ui/ChangesPassword/ChangesPassword.jsx"></mcfile> valida:
   - Coincidencia de contraseñas
   - Requisitos de seguridad
2. Envía datos al backend mediante el servicio

## 3. Manejo de Estados

### Estado Local (Componentes)
```javascript
// Estados en login.jsx
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [passwordVisible, setPasswordVisible] = useState(false);
```

### Estado Global (Contextos)
1. <mcfile name="UserContext.jsx" path="src/context/UserContext.jsx"></mcfile>
   - Información del usuario
   - Estado de autenticación

2. <mcfile name="CompanyContext.jsx" path="src/context/CompanyContext.jsx"></mcfile>
   - Datos de la empresa
   - Configuraciones

## 4. Flujo de Datos

### Entrada → Procesamiento → Salida
1. **Entrada (UI)**:
   - Captura datos del usuario
   - Validación inicial

2. **Procesamiento (Hooks y Servicios)**:
   - <mcfile name="authHook.js" path="src/features/auth/hook/authHook.js"></mcfile>
   - <mcfile name="authService.js" path="src/features/auth/service/authService.js"></mcfile>

3. **Salida (UI + Estado)**:
   - Actualización de interfaz
   - Mensajes al usuario
   - Redirecciones

## 5. Manejo de Errores

### Frontend
1. Validaciones en tiempo real
2. Mensajes de error específicos
3. Estados de carga (loading)

### Comunicación
1. Errores de red
2. Timeouts
3. Respuestas inesperadas

## 6. Seguridad

### Cliente
1. Validación de tokens
2. Almacenamiento seguro
3. Limpieza en logout

### Comunicación
1. HTTPS
2. Headers de autenticación
3. Manejo de sesiones
        