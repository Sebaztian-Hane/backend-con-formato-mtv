# Optimizaciones del Modal de Edición de Staff

## Problema Identificado

El modal de edición de staff tardaba mucho en abrirse debido a que los componentes de tipo de documento y ubicación (select en cascada) cargaban sus datos de forma síncrona cuando se abría el modal.

## Soluciones Implementadas

### 1. Sistema de Caché Global para APIs

**Archivo:** `src/components/Select/SelectsApi.js`

- Implementado un sistema de caché global que almacena los datos de las APIs
- Evita llamadas repetidas a la misma API
- Incluye función `clearApiCache()` para limpiar el caché cuando sea necesario

```javascript
const apiCache = {
  countries: null,
  regions: null,
  provinces: {},
  districts: {},
  documentTypes: null,
  paymentStatuses: null,
  predeterminedPrices: null,
  diagnoses: null,
};
```

### 2. Precarga de Datos Antes de Abrir el Modal

**Archivo:** `src/features/staff/hook/staffHook.js`

- Agregada función `preloadEditData()` que precarga los datos necesarios
- Los datos se cargan en paralelo usando `Promise.all()`
- Se ejecuta antes de abrir el modal para que esté listo inmediatamente

```javascript
const preloadEditData = async () => {
  const [documentTypes, regions] = await Promise.all([
    getDocumentTypes(),
    getDepartaments(),
  ]);
  return { documentTypes, regions };
};
```

### 3. Optimización del Componente SelectUbigeoCascader

**Archivo:** `src/components/Select/SelectUbigeoCascader.jsx`

- Implementado caché interno para provincias y distritos
- Uso de `useCallback` y `useMemo` para evitar recálculos innecesarios
- Carga lazy de datos solo cuando es necesario
- Optimización del árbol de opciones para modo edición

### 4. Optimización del Componente SelectTypeOfDocument

**Archivo:** `src/components/Select/SelctTypeOfDocument.jsx`

- Eliminado caché redundante (ahora usa el caché global)
- Uso de `useCallback` para optimizar funciones
- Indicador de carga mientras se obtienen los datos

### 5. Estado de Carga en el Modal

**Archivo:** `src/features/staff/ui/EditTherapist/EditTherapist.jsx`

- Agregado estado `isFormReady` para controlar cuándo mostrar el formulario
- Indicador de carga mientras se prepara el formulario
- Uso de `useMemo` para memoizar los datos del formulario

### 6. Botón de Edición con Estado de Carga

**Archivo:** `src/features/staff/ui/staff.jsx`

- Agregado estado `editLoading` para mostrar carga en el botón
- Precarga de datos antes de abrir el modal
- Mejor experiencia de usuario con feedback visual

## Beneficios de las Optimizaciones

1. **Apertura más rápida del modal**: Los datos se precargan antes de abrir el modal
2. **Menos llamadas a la API**: Sistema de caché evita llamadas repetidas
3. **Mejor experiencia de usuario**: Indicadores de carga y feedback visual
4. **Código más eficiente**: Uso de hooks de React para optimizar rendimiento
5. **Escalabilidad**: El sistema de caché se puede reutilizar en otros componentes

## Uso

Para usar las optimizaciones:

1. El sistema de caché funciona automáticamente
2. La precarga de datos se ejecuta al hacer clic en "Editar"
3. El modal se abre más rápido con los datos ya cargados
4. Si necesitas limpiar el caché, usa `clearCache()` del hook

## Mantenimiento

- El caché se mantiene durante la sesión del usuario
- Se puede limpiar manualmente si es necesario
- Los datos se recargan automáticamente si no están en caché 