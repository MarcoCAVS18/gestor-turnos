// src/components/ui/Button/index.jsx

import React from 'react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const Button = (***REMOVED*** 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  themeColor = '#EC4899',
  ...props 
***REMOVED***) => ***REMOVED***
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
    const styles = ***REMOVED***
      primary: ***REMOVED***
        backgroundColor: themeColor,
        borderColor: themeColor,
        '--tw-ring-color': themeColor
      ***REMOVED***,
      outline: ***REMOVED***
        borderColor: themeColor,
        color: themeColor,
        '--tw-ring-color': themeColor
      ***REMOVED***,
      ghost: ***REMOVED***
        color: themeColor,
        '--tw-ring-color': themeColor
      ***REMOVED***
    ***REMOVED***;

    return styles[variant] || styles.primary;
  ***REMOVED***;

  const getHoverColor = (baseColor) => ***REMOVED***
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const darkerR = Math.max(0, r - 40);
    const darkerG = Math.max(0, g - 40);
    const darkerB = Math.max(0, b - 40);
    
    return `#$***REMOVED***darkerR.toString(16).padStart(2, '0')***REMOVED***$***REMOVED***darkerG.toString(16).padStart(2, '0')***REMOVED***$***REMOVED***darkerB.toString(16).padStart(2, '0')***REMOVED***`;
  ***REMOVED***;

  const handleMouseEnter = (e) => ***REMOVED***
    if (disabled || loading) return;
    
    if (variant === 'primary') ***REMOVED***
      e.target.style.backgroundColor = getHoverColor(themeColor);
    ***REMOVED*** else if (variant === 'outline') ***REMOVED***
      e.target.style.backgroundColor = `$***REMOVED***themeColor***REMOVED***1A`; 
    ***REMOVED***
  ***REMOVED***;

  const handleMouseLeave = (e) => ***REMOVED***
    if (disabled || loading) return;
    
    if (variant === 'primary') ***REMOVED***
      e.target.style.backgroundColor = themeColor;
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
        <LoadingSpinner size="h-4 w-4" color="border-white" className="mr-2" />
      )***REMOVED***
      ***REMOVED***Icon && !loading && <Icon className="mr-2 h-4 w-4" />***REMOVED***
      ***REMOVED***children***REMOVED***
    </button>
  );
***REMOVED***;

export default Button;