// src/components/ui/Badge/index.jsx

import React from 'react';

/**
 * Componente Badge reutilizable para mostrar etiquetas con diferentes variantes
 *
 * @param ***REMOVED***string***REMOVED*** variant - Variante de color: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
 * @param ***REMOVED***string***REMOVED*** size - Tamaño: 'xs' | 'sm' | 'md' | 'lg'
 * @param ***REMOVED***boolean***REMOVED*** rounded - Si debe ser completamente redondeado (pill shape)
 * @param ***REMOVED***React.ReactNode***REMOVED*** children - Contenido del badge
 * @param ***REMOVED***React.ReactNode***REMOVED*** icon - Ícono opcional a mostrar
 * @param ***REMOVED***string***REMOVED*** className - Clases CSS adicionales
 * @param ***REMOVED***object***REMOVED*** style - Estilos inline adicionales
 */
const Badge = (***REMOVED***
  variant = 'default',
  size = 'sm',
  rounded = false,
  children,
  icon: Icon,
  className = '',
  style = ***REMOVED******REMOVED***,
  ...props
***REMOVED***) => ***REMOVED***
  // Clases base
  const baseClasses = 'inline-flex items-center font-medium';

  // Variantes de color
  const variantClasses = ***REMOVED***
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-blue-50 text-blue-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-orange-50 text-orange-700',
    danger: 'bg-red-50 text-red-700',
    info: 'bg-cyan-50 text-cyan-700',
    purple: 'bg-purple-50 text-purple-700',
    pink: 'bg-pink-50 text-pink-700'
  ***REMOVED***;

  // Tamaños
  const sizeClasses = ***REMOVED***
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  ***REMOVED***;

  // Tamaños de iconos
  const iconSizes = ***REMOVED***
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16
  ***REMOVED***;

  // Clases de redondeo
  const roundedClass = rounded ? 'rounded-full' : 'rounded';

  const combinedClasses = `
    $***REMOVED***baseClasses***REMOVED***
    $***REMOVED***variantClasses[variant] || variantClasses.default***REMOVED***
    $***REMOVED***sizeClasses[size]***REMOVED***
    $***REMOVED***roundedClass***REMOVED***
    $***REMOVED***className***REMOVED***
  `.trim().replace(/\s+/g, ' ');

  return (
    <span className=***REMOVED***combinedClasses***REMOVED*** style=***REMOVED***style***REMOVED*** ***REMOVED***...props***REMOVED***>
      ***REMOVED***Icon && (
        <Icon
          size=***REMOVED***iconSizes[size]***REMOVED***
          className="mr-1"
          style=***REMOVED******REMOVED*** flexShrink: 0 ***REMOVED******REMOVED***
        />
      )***REMOVED***
      ***REMOVED***children***REMOVED***
    </span>
  );
***REMOVED***;

export default Badge;
