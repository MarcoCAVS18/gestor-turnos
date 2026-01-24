// src/components/ui/LoadingSpinner/LoadingSpinner.jsx
import React from 'react';

/**
 * @param {object} props
 * @param {string} props.size - Clases de Tailwind para el tamaño (e.g., "h-12 w-12"). Por defecto es "h-6 w-6".
 * @param {string} props.color - Clases de Tailwind para el color del borde (e.g., "border-pink-500").
 * @param {object} props.style - Objeto de estilo en línea, útil para colores dinámicos.
 * @param {string} props.className - Clases adicionales para personalizar.
 */
const LoadingSpinner = ({ size = 'h-6 w-6', color = 'border-gray-900', style, className = '' }) => {
  return (
    <div
      className={`animate-spin rounded-full border-b-2 ${size} ${color} ${className}`}
      style={style}
      role="status"
      aria-label="Loading..."
    />
  );
};

export default LoadingSpinner;