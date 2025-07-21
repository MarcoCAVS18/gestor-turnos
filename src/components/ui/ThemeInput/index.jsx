// src/components/ui/ThemeInput/index.jsx

import React from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';

const ThemeInput = (***REMOVED*** 
  className = '',
  style = ***REMOVED******REMOVED***,
  ...props 
***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors ***REMOVED*** = useApp();
  
  // Combinar estilos personalizados con los del tema
  const combinedStyle = ***REMOVED***
    '--tw-ring-color': thematicColors?.base || '#EC4899',
    borderColor: '#D1D5DB', // Borde gris claro en lugar de gris oscuro
    backgroundColor: '#FFFFFF', // ✅ Fondo blanco explícito
    ...style
  ***REMOVED***;

  // Clases CSS combinadas
  const combinedClassName = `
    block w-full px-3 py-2 border rounded-lg 
    shadow-sm placeholder-gray-400 
    focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent
    transition-colors bg-white
    $***REMOVED***className***REMOVED***
  `.trim();
  
  return (
    <input
      className=***REMOVED***combinedClassName***REMOVED***
      style=***REMOVED***combinedStyle***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  );
***REMOVED***;

export default ThemeInput;