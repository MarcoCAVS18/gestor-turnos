// src/components/DynamicButton.jsx

import React from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

const DynamicButton = (***REMOVED*** 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled = false,
  ...props 
***REMOVED***) => ***REMOVED***
  const ***REMOVED*** coloresTemáticos ***REMOVED*** = useApp();

  // Definir estilos según la variante
  const getVariantStyles = () => ***REMOVED***
    if (!coloresTemáticos) ***REMOVED***
      // Fallback a colores por defecto
      return ***REMOVED***
        primary: ***REMOVED***
          backgroundColor: '#EC4899',
          color: '#ffffff',
          hoverBg: '#BE185D',
          activeBg: '#9F1239'
        ***REMOVED***,
        secondary: ***REMOVED***
          backgroundColor: 'transparent',
          color: '#EC4899',
          border: '1px solid #EC4899',
          hoverBg: 'rgba(236, 72, 153, 0.1)',
          activeBg: 'rgba(236, 72, 153, 0.2)'
        ***REMOVED***
      ***REMOVED***;
    ***REMOVED***

    return ***REMOVED***
      primary: ***REMOVED***
        backgroundColor: coloresTemáticos.base,
        color: coloresTemáticos.textContrast,
        hoverBg: coloresTemáticos.hover,
        activeBg: coloresTemáticos.active
      ***REMOVED***,
      secondary: ***REMOVED***
        backgroundColor: 'transparent',
        color: coloresTemáticos.base,
        border: `1px solid $***REMOVED***coloresTemáticos.base***REMOVED***`,
        hoverBg: coloresTemáticos.transparent10,
        activeBg: coloresTemáticos.transparent20
      ***REMOVED***,
      outline: ***REMOVED***
        backgroundColor: 'transparent',
        color: coloresTemáticos.base,
        border: `1px solid $***REMOVED***coloresTemáticos.base***REMOVED***`,
        hoverBg: coloresTemáticos.base,
        hoverColor: coloresTemáticos.textContrast,
        activeBg: coloresTemáticos.dark
      ***REMOVED***,
      ghost: ***REMOVED***
        backgroundColor: 'transparent',
        color: coloresTemáticos.base,
        hoverBg: coloresTemáticos.transparent10,
        activeBg: coloresTemáticos.transparent20
      ***REMOVED***
    ***REMOVED***;
  ***REMOVED***;

  // Definir tamaños
  const getSizeStyles = () => ***REMOVED***
    return ***REMOVED***
      sm: ***REMOVED***
        padding: '0.375rem 0.75rem',
        fontSize: '0.875rem',
        borderRadius: '0.375rem'
      ***REMOVED***,
      md: ***REMOVED***
        padding: '0.5rem 1rem',
        fontSize: '1rem',
        borderRadius: '0.5rem'
      ***REMOVED***,
      lg: ***REMOVED***
        padding: '0.75rem 1.5rem',
        fontSize: '1.125rem',
        borderRadius: '0.5rem'
      ***REMOVED***
    ***REMOVED***;
  ***REMOVED***;

  const variantStyles = getVariantStyles()[variant];
  const sizeStyles = getSizeStyles()[size];

  const baseStyles = ***REMOVED***
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '500',
    transition: 'all 0.2s ease-in-out',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    border: variantStyles.border || 'none',
    outline: 'none',
    ...sizeStyles,
    ...variantStyles
  ***REMOVED***;

  const handleMouseEnter = (e) => ***REMOVED***
    if (disabled) return;
    e.target.style.backgroundColor = variantStyles.hoverBg;
    if (variantStyles.hoverColor) ***REMOVED***
      e.target.style.color = variantStyles.hoverColor;
    ***REMOVED***
  ***REMOVED***;

  const handleMouseLeave = (e) => ***REMOVED***
    if (disabled) return;
    e.target.style.backgroundColor = variantStyles.backgroundColor;
    e.target.style.color = variantStyles.color;
  ***REMOVED***;

  const handleMouseDown = (e) => ***REMOVED***
    if (disabled) return;
    e.target.style.backgroundColor = variantStyles.activeBg;
  ***REMOVED***;

  const handleMouseUp = (e) => ***REMOVED***
    if (disabled) return;
    e.target.style.backgroundColor = variantStyles.hoverBg;
  ***REMOVED***;

  return (
    <button
      style=***REMOVED***baseStyles***REMOVED***
      className=***REMOVED***className***REMOVED***
      onClick=***REMOVED***disabled ? undefined : onClick***REMOVED***
      onMouseEnter=***REMOVED***handleMouseEnter***REMOVED***
      onMouseLeave=***REMOVED***handleMouseLeave***REMOVED***
      onMouseDown=***REMOVED***handleMouseDown***REMOVED***
      onMouseUp=***REMOVED***handleMouseUp***REMOVED***
      disabled=***REMOVED***disabled***REMOVED***
      ***REMOVED***...props***REMOVED***
    >
      ***REMOVED***children***REMOVED***
    </button>
  );
***REMOVED***;

export default DynamicButton;