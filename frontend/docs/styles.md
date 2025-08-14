<div align="center">
  <img src="https://img.icons8.com/ios-filled/100/000000/paint-palette.png" alt="Estilos" width="60"/>
  <br/>
  <img src="https://img.shields.io/badge/Ant%20Design-5.x-1677ff?logo=ant-design&logoColor=white" alt="Ant Design"/>
</div>

# Estilos

La aplicación utiliza una combinación de estilos globales y módulos CSS para mantener la coherencia visual y facilitar el mantenimiento.

## Organización
- Estilos globales: `src/css/normalize.css` y `src/css/VarColors.css`
- Estilos por componente: Archivos `.module.css` junto a cada componente.

## Buenas prácticas
- Utiliza variables CSS para colores y temas.
- Prefiere módulos CSS para evitar conflictos de nombres.
- Mantén los estilos de cada componente en su propia carpeta.

## Ejemplo de uso
```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
}
```

Para modificar la paleta de colores o estilos globales, edita los archivos en `src/css/`. 