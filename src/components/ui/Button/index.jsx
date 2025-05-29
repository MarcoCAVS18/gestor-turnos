import React from 'react';
import { useApp } from '../../../contexts/AppContext';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  ...props 
}) => {
  const { coloresTemáticos } = useApp();

  const getVariantClasses = () => {
    const base = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variants = {
      primary: `${base} text-white shadow-sm hover:shadow-md`,
      outline: `${base} border bg-transparent hover:bg-opacity-10`,
      ghost: `${base} bg-transparent hover:bg-opacity-10`,
      secondary: `${base} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50`,
      danger: `${base} bg-red-500 text-white hover:bg-red-600 focus:ring-red-500`
    };

    return variants[variant] || variants.primary;
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };
    return sizes[size] || sizes.md;
  };

  const getStyles = () => {
    if (!coloresTemáticos) return {};
    
    const styles = {
      primary: {
        backgroundColor: coloresTemáticos.base,
        borderColor: coloresTemáticos.base,
        '--tw-ring-color': coloresTemáticos.base
      },
      outline: {
        borderColor: coloresTemáticos.base,
        color: coloresTemáticos.base,
        '--tw-ring-color': coloresTemáticos.base
      },
      ghost: {
        color: coloresTemáticos.base,
        '--tw-ring-color': coloresTemáticos.base
      }
    };

    return styles[variant] || styles.primary;
  };

  const handleMouseEnter = (e) => {
    if (disabled || loading) return;
    
    if (variant === 'primary') {
      e.target.style.backgroundColor = coloresTemáticos?.hover || '#BE185D';
    } else if (variant === 'outline') {
      e.target.style.backgroundColor = coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)';
    }
  };

  const handleMouseLeave = (e) => {
    if (disabled || loading) return;
    
    if (variant === 'primary') {
      e.target.style.backgroundColor = coloresTemáticos?.base || '#EC4899';
    } else if (variant === 'outline') {
      e.target.style.backgroundColor = 'transparent';
    }
  };

  return (
    <button
      className={`${getVariantClasses()} ${getSizeClasses()} ${className} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      style={getStyles()}
      onClick={disabled || loading ? undefined : onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      )}
      {Icon && !loading && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </button>
  );
};

export default Button;
