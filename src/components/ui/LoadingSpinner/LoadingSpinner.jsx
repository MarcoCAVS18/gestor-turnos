// src/components/ui/LoadingSpinner/LoadingSpinner.jsx
import React from 'react';

/**
 * Un componente de spinner de carga reutilizable.
 * @param ***REMOVED***object***REMOVED*** props
 * @param ***REMOVED***string***REMOVED*** props.size - Clases de Tailwind para el tamaño (e.g., "h-12 w-12"). Por defecto es "h-6 w-6".
 * @param ***REMOVED***string***REMOVED*** props.color - Clases de Tailwind para el color del borde (e.g., "border-pink-500").
 * @param ***REMOVED***object***REMOVED*** props.style - Objeto de estilo en línea, útil para colores dinámicos.
 * @param ***REMOVED***string***REMOVED*** props.className - Clases adicionales para personalizar.
 */
const LoadingSpinner = (***REMOVED*** size = 'h-6 w-6', color = 'border-gray-900', style, className = '' ***REMOVED***) => ***REMOVED***
  return (
    <div
      className=***REMOVED***`animate-spin rounded-full border-b-2 $***REMOVED***size***REMOVED*** $***REMOVED***color***REMOVED*** $***REMOVED***className***REMOVED***`***REMOVED***
      style=***REMOVED***style***REMOVED***
      role="status"
      aria-label="Cargando..."
    />
  );
***REMOVED***;

export default LoadingSpinner;