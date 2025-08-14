/**
 * Formatea un mensaje de error del backend, eliminando cualquier texto
 * que se encuentre dentro de paréntesis para mostrar un mensaje más limpio al usuario.
 * @param {string} message - El mensaje original del backend.
 * @param {string} defaultMessage - Un mensaje por defecto si el original está vacío.
 * @returns {string} - El mensaje formateado.
 */
export const formatToastMessage = (
  message,
  defaultMessage = 'Ha ocurrido un error inesperado.',
) => {
  if (!message || typeof message !== 'string') {
    return defaultMessage;
  }
  // Elimina cualquier texto dentro de paréntesis, incluyendo los paréntesis.
  // Ejemplo: "Error de duplicado (ya existe)" -> "Error de duplicado"
  return message.replace(/\s*\(.*\)\s*/g, '').trim();
};
