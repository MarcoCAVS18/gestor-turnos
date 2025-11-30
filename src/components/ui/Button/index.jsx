// src/components/ui/Button/index.jsx

import React from 'react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  themeColor = '#EC4899',
  style: propStyle,
  ...props
}) => {
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
    const styles = {
      primary: {
        backgroundColor: themeColor,
        borderColor: themeColor,
        '--tw-ring-color': themeColor
      },
      outline: {
        borderColor: themeColor,
        color: themeColor,
        '--tw-ring-color': themeColor
      },
      ghost: {
        color: themeColor,
        '--tw-ring-color': themeColor
      }
    };

    return styles[variant] || styles.primary;
  };

  const getHoverColor = (baseColor) => {
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const darkerR = Math.max(0, r - 40);
    const darkerG = Math.max(0, g - 40);
    const darkerB = Math.max(0, b - 40);

    return `#${darkerR.toString(16).padStart(2, '0')}${darkerG.toString(16).padStart(2, '0')}${darkerB.toString(16).padStart(2, '0')}`;
  };

  const handleMouseEnter = (e) => {
    if (disabled || loading) return;

    if (variant === 'primary') {
      e.target.style.backgroundColor = getHoverColor(themeColor);
    } else if (variant === 'outline') {
      e.target.style.backgroundColor = `${themeColor}1A`;
    }
  };

  const handleMouseLeave = (e) => {
    if (disabled || loading) return;

    if (variant === 'primary') {
      e.target.style.backgroundColor = themeColor;
    } else if (variant === 'outline') {
      e.target.style.backgroundColor = 'transparent';
    }
  };

  return (
    <button
      className={`${getVariantClasses()} ${getSizeClasses()} ${className} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      style={{ ...getStyles(), ...propStyle }}
      onClick={disabled || loading ? undefined : onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <LoadingSpinner size="h-4 w-4" color="border-white" className="mr-2" />
      )}
      {Icon && !loading && (
        <Icon
          className={`h-5 w-5 ${children ? 'mr-0' : ''}`} 
        />
        )}
      {children}
    </button>
  );
};

export default Button;