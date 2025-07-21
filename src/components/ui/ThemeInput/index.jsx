// src/components/ui/ThemeInput/index.jsx

import React from 'react';
import { useApp } from '../../../contexts/AppContext';

const ThemeInput = ({ 
  className = '',
  style = {},
  ...props 
}) => {
  const { thematicColors } = useApp();
  
  // Combinar estilos personalizados con los del tema
  const combinedStyle = {
    '--tw-ring-color': thematicColors?.base || '#EC4899',
    borderColor: '#D1D5DB', // Borde gris claro en lugar de gris oscuro
    backgroundColor: '#FFFFFF', // ✅ Fondo blanco explícito
    ...style
  };

  // Clases CSS combinadas
  const combinedClassName = `
    block w-full px-3 py-2 border rounded-lg 
    shadow-sm placeholder-gray-400 
    focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent
    transition-colors bg-white
    ${className}
  `.trim();
  
  return (
    <input
      className={combinedClassName}
      style={combinedStyle}
      {...props}
    />
  );
};

export default ThemeInput;