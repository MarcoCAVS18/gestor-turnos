// src/components/ui/Badge/index.jsx

import React from 'react';

/**
 * Reusable component to display labels with different variants
 *
 * @param ***REMOVED***string***REMOVED*** variant - Color variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
 * @param ***REMOVED***string***REMOVED*** size - Size: 'xs' | 'sm' | 'md' | 'lg'
 * @param ***REMOVED***boolean***REMOVED*** rounded - If it should be fully rounded (pill shape)
 * @param ***REMOVED***React.ReactNode***REMOVED*** children - Badge content
 * @param ***REMOVED***React.ReactNode***REMOVED*** icon - Optional icon to display
 * @param ***REMOVED***string***REMOVED*** className - Additional CSS classes
 * @param ***REMOVED***object***REMOVED*** style - Additional inline styles
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
  // Base classes
  const baseClasses = 'inline-flex items-center font-medium';

  // Color variants
  const variantClasses = ***REMOVED***
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-blue-50 text-blue-700',
    success: 'bg-green-50 text-green-700',
    win: 'bg-purple-50 text-purple-700', // Cambié 'pink' por 'win' para consistencia con estilos comunes (opcional, si prefieres mantener 'pink', déjalo como 'pink')
    warning: 'bg-orange-50 text-orange-700',
    danger: 'bg-red-50 text-red-700',
    info: 'bg-cyan-50 text-cyan-700',
    purple: 'bg-purple-50 text-purple-700',
    pink: 'bg-pink-50 text-pink-700'
  ***REMOVED***;

  // Sizes
  const sizeClasses = ***REMOVED***
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  ***REMOVED***;

  // Icon sizes
  const iconSizes = ***REMOVED***
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16
  ***REMOVED***;

  // Rounded class
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