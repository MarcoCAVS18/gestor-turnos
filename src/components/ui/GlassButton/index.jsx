// src/components/ui/GlassButton/index.jsx

import React from 'react';
import { ChevronRight } from 'lucide-react';
import './index.css';

const GlassButton = ({ 
  children,
  onClick,
  icon: Icon,
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const getSizeClasses = () => {
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg'
    };
    return sizes[size] || sizes.md;
  };

  const getVariantClasses = () => {
    const variants = {
      default: 'glass-button',
      primary: 'glass-button glass-button-primary',
      secondary: 'glass-button glass-button-secondary',
      success: 'glass-button glass-button-success',
      danger: 'glass-button glass-button-danger'
    };
    return variants[variant] || variants.default;
  };

  return (
    <button
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${disabled ? 'glass-button-disabled' : ''}
        ${loading ? 'glass-button-loading' : ''}
        ${className}
      `}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      {...props}
    >
      <span className="glass-button-content">
        {loading && (
          <div className="glass-button-spinner" />
        )}
        
        {Icon && !loading && (
          <Icon className="glass-button-icon" />
        )}
        
        <span className="glass-button-text">{children}</span>
        
        {!Icon && !loading && (
          <ChevronRight className="glass-button-arrow" />
        )}
      </span>
    </button>
  );
};

export default GlassButton;