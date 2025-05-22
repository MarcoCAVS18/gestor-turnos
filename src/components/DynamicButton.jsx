// src/components/DynamicButton.jsx - Botón que usa colores temáticos

import React from 'react';
import { useApp } from '../contexts/AppContext';

const DynamicButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled = false,
  ...props 
}) => {
  const { coloresTemáticos } = useApp();

  // Definir estilos según la variante
  const getVariantStyles = () => {
    if (!coloresTemáticos) {
      // Fallback a colores por defecto
      return {
        primary: {
          backgroundColor: '#EC4899',
          color: '#ffffff',
          hoverBg: '#BE185D',
          activeBg: '#9F1239'
        },
        secondary: {
          backgroundColor: 'transparent',
          color: '#EC4899',
          border: '1px solid #EC4899',
          hoverBg: 'rgba(236, 72, 153, 0.1)',
          activeBg: 'rgba(236, 72, 153, 0.2)'
        }
      };
    }

    return {
      primary: {
        backgroundColor: coloresTemáticos.base,
        color: coloresTemáticos.textContrast,
        hoverBg: coloresTemáticos.hover,
        activeBg: coloresTemáticos.active
      },
      secondary: {
        backgroundColor: 'transparent',
        color: coloresTemáticos.base,
        border: `1px solid ${coloresTemáticos.base}`,
        hoverBg: coloresTemáticos.transparent10,
        activeBg: coloresTemáticos.transparent20
      },
      outline: {
        backgroundColor: 'transparent',
        color: coloresTemáticos.base,
        border: `1px solid ${coloresTemáticos.base}`,
        hoverBg: coloresTemáticos.base,
        hoverColor: coloresTemáticos.textContrast,
        activeBg: coloresTemáticos.dark
      },
      ghost: {
        backgroundColor: 'transparent',
        color: coloresTemáticos.base,
        hoverBg: coloresTemáticos.transparent10,
        activeBg: coloresTemáticos.transparent20
      }
    };
  };

  // Definir tamaños
  const getSizeStyles = () => {
    return {
      sm: {
        padding: '0.375rem 0.75rem',
        fontSize: '0.875rem',
        borderRadius: '0.375rem'
      },
      md: {
        padding: '0.5rem 1rem',
        fontSize: '1rem',
        borderRadius: '0.5rem'
      },
      lg: {
        padding: '0.75rem 1.5rem',
        fontSize: '1.125rem',
        borderRadius: '0.5rem'
      }
    };
  };

  const variantStyles = getVariantStyles()[variant];
  const sizeStyles = getSizeStyles()[size];

  const baseStyles = {
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
  };

  const handleMouseEnter = (e) => {
    if (disabled) return;
    e.target.style.backgroundColor = variantStyles.hoverBg;
    if (variantStyles.hoverColor) {
      e.target.style.color = variantStyles.hoverColor;
    }
  };

  const handleMouseLeave = (e) => {
    if (disabled) return;
    e.target.style.backgroundColor = variantStyles.backgroundColor;
    e.target.style.color = variantStyles.color;
  };

  const handleMouseDown = (e) => {
    if (disabled) return;
    e.target.style.backgroundColor = variantStyles.activeBg;
  };

  const handleMouseUp = (e) => {
    if (disabled) return;
    e.target.style.backgroundColor = variantStyles.hoverBg;
  };

  return (
    <button
      style={baseStyles}
      className={className}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default DynamicButton;