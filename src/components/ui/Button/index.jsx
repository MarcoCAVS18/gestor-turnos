import React from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';

const Button = (***REMOVED*** 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  ...props 
***REMOVED***) => ***REMOVED***
  const ***REMOVED*** coloresTemáticos ***REMOVED*** = useApp();

  const getVariantClasses = () => ***REMOVED***
    const base = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variants = ***REMOVED***
      primary: `$***REMOVED***base***REMOVED*** text-white shadow-sm hover:shadow-md`,
      outline: `$***REMOVED***base***REMOVED*** border bg-transparent hover:bg-opacity-10`,
      ghost: `$***REMOVED***base***REMOVED*** bg-transparent hover:bg-opacity-10`,
      secondary: `$***REMOVED***base***REMOVED*** border border-gray-300 bg-white text-gray-700 hover:bg-gray-50`,
      danger: `$***REMOVED***base***REMOVED*** bg-red-500 text-white hover:bg-red-600 focus:ring-red-500`
    ***REMOVED***;

    return variants[variant] || variants.primary;
  ***REMOVED***;

  const getSizeClasses = () => ***REMOVED***
    const sizes = ***REMOVED***
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    ***REMOVED***;
    return sizes[size] || sizes.md;
  ***REMOVED***;

  const getStyles = () => ***REMOVED***
    if (!coloresTemáticos) return ***REMOVED******REMOVED***;
    
    const styles = ***REMOVED***
      primary: ***REMOVED***
        backgroundColor: coloresTemáticos.base,
        borderColor: coloresTemáticos.base,
        '--tw-ring-color': coloresTemáticos.base
      ***REMOVED***,
      outline: ***REMOVED***
        borderColor: coloresTemáticos.base,
        color: coloresTemáticos.base,
        '--tw-ring-color': coloresTemáticos.base
      ***REMOVED***,
      ghost: ***REMOVED***
        color: coloresTemáticos.base,
        '--tw-ring-color': coloresTemáticos.base
      ***REMOVED***
    ***REMOVED***;

    return styles[variant] || styles.primary;
  ***REMOVED***;

  const handleMouseEnter = (e) => ***REMOVED***
    if (disabled || loading) return;
    
    if (variant === 'primary') ***REMOVED***
      e.target.style.backgroundColor = coloresTemáticos?.hover || '#BE185D';
    ***REMOVED*** else if (variant === 'outline') ***REMOVED***
      e.target.style.backgroundColor = coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)';
    ***REMOVED***
  ***REMOVED***;

  const handleMouseLeave = (e) => ***REMOVED***
    if (disabled || loading) return;
    
    if (variant === 'primary') ***REMOVED***
      e.target.style.backgroundColor = coloresTemáticos?.base || '#EC4899';
    ***REMOVED*** else if (variant === 'outline') ***REMOVED***
      e.target.style.backgroundColor = 'transparent';
    ***REMOVED***
  ***REMOVED***;

  return (
    <button
      className=***REMOVED***`$***REMOVED***getVariantClasses()***REMOVED*** $***REMOVED***getSizeClasses()***REMOVED*** $***REMOVED***className***REMOVED*** $***REMOVED***
        disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      ***REMOVED***`***REMOVED***
      style=***REMOVED***getStyles()***REMOVED***
      onClick=***REMOVED***disabled || loading ? undefined : onClick***REMOVED***
      onMouseEnter=***REMOVED***handleMouseEnter***REMOVED***
      onMouseLeave=***REMOVED***handleMouseLeave***REMOVED***
      disabled=***REMOVED***disabled || loading***REMOVED***
      ***REMOVED***...props***REMOVED***
    >
      ***REMOVED***loading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      )***REMOVED***
      ***REMOVED***Icon && !loading && <Icon className="mr-2 h-4 w-4" />***REMOVED***
      ***REMOVED***children***REMOVED***
    </button>
  );
***REMOVED***;

export default Button;
