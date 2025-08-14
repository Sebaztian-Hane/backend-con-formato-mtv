<div align="center">
  <img src="https://img.icons8.com/ios-filled/100/000000/puzzle.png" alt="Componentes" width="60"/>
  <br/>
  <img src="https://img.shields.io/badge/React-19.1.0-61dafb?logo=react&logoColor=white" alt="React"/>
</div>

# Componentes

En este proyecto, los componentes reutilizables se encuentran en `src/components/` y están organizados por tipo y funcionalidad. Permiten construir la interfaz de usuario de manera modular y escalable.

## Organización
- Cada componente está en una subcarpeta dentro de `src/components/`.
- Los estilos específicos suelen estar en archivos `.module.css` junto al componente.

## Principales categorías de componentes

### Botones
- **Button/CustomButtom.jsx**: Botón personalizado reutilizable para acciones generales.

### Inputs y Formularios
- **Input/Input.jsx**: Campo de entrada de texto.
- **Form/Form.jsx**: Formularios reutilizables para registro y edición.

### Tablas y Paginación
- **Table/Tabla.jsx**: Tabla para mostrar datos tabulares.
- **Table/Pagination/Pagination.jsx**: Componente de paginación para tablas.

### Modales
- **Modal/BaseModalProfile.jsx**: Modal para edición de perfil.
- **Modal/BaseModalPayments/BaseModalPayments.jsx**: Modal para pagos.
- **Modal/EditModal.jsx**: Modal de edición genérico.

### Selectores y Búsqueda
- **Select/SelectCountry.jsx**: Selector de país.
- **Select/SelectDiagnoses.jsx**: Selector de diagnósticos.
- **Select/SelectPaymentStatus.jsx**: Selector de estado de pago.
- **Search/CustomSearch.jsx**: Barra de búsqueda personalizada.
- **DateSearch/CustomTimeFilter.jsx**: Filtro de fechas y horas.

### Otros
- **Header/Header.jsx**: Encabezado principal de la app.
- **ThemeToggle/ThemeToggle.jsx**: Cambio de tema (oscuro/claro).
- **LoadingProvider/**: Gestión de estados de carga.

## Ejemplo de uso
```jsx
import CustomButton from '../components/Button/CustomButtom';

<CustomButton label="Guardar" onClick={handleSave} />
```

Consulta cada archivo para ver los props y ejemplos de uso específicos. 