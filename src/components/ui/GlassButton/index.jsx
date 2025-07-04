// src/components/ui/GlassButton/index.jsx

import React from 'react';
import ***REMOVED*** ChevronRight ***REMOVED*** from 'lucide-react';
import './index.css';

const GlassButton = (***REMOVED*** 
  children,
  onClick,
  icon: Icon,
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props 
***REMOVED***) => ***REMOVED***
  const getSizeClasses = () => ***REMOVED***
    const sizes = ***REMOVED***
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg'
    ***REMOVED***;
    return sizes[size] || sizes.md;
  ***REMOVED***;

  const getVariantClasses = () => ***REMOVED***
    const variants = ***REMOVED***
      default: 'glass-button',
      primary: 'glass-button glass-button-primary',
      secondary: 'glass-button glass-button-secondary',
      success: 'glass-button glass-button-success',
      danger: 'glass-button glass-button-danger'
    ***REMOVED***;
    return variants[variant] || variants.default;
  ***REMOVED***;

  return (
    <button
      className=***REMOVED***`
        $***REMOVED***getVariantClasses()***REMOVED***
        $***REMOVED***getSizeClasses()***REMOVED***
        $***REMOVED***disabled ? 'glass-button-disabled' : ''***REMOVED***
        $***REMOVED***loading ? 'glass-button-loading' : ''***REMOVED***
        $***REMOVED***className***REMOVED***
      `***REMOVED***
      onClick=***REMOVED***disabled || loading ? undefined : onClick***REMOVED***
      disabled=***REMOVED***disabled || loading***REMOVED***
      ***REMOVED***...props***REMOVED***
    >
      <span className="glass-button-content">
        ***REMOVED***loading && (
          <div className="glass-button-spinner" />
        )***REMOVED***
        
        ***REMOVED***Icon && !loading && (
          <Icon className="glass-button-icon" />
        )***REMOVED***
        
        <span className="glass-button-text">***REMOVED***children***REMOVED***</span>
        
        ***REMOVED***!Icon && !loading && (
          <ChevronRight className="glass-button-arrow" />
        )***REMOVED***
      </span>
    </button>
  );
***REMOVED***;

export default GlassButton;