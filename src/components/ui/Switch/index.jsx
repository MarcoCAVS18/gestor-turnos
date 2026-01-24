// src/components/ui/Switch/index.jsx

import React from 'react';
import { useApp } from '../../../contexts/AppContext';

const Switch = ({ checked, onChange, disabled = false, size = 'md' }) => {
  const { thematicColors } = useApp();
  
  const getSizeClasses = () => {
    const sizes = {
      sm: { container: 'h-5 w-9', toggle: 'h-3 w-3', translate: 'translate-x-4' },
      md: { container: 'h-6 w-11', toggle: 'h-4 w-4', translate: 'translate-x-6' },
      lg: { container: 'h-7 w-14', toggle: 'h-5 w-5', translate: 'translate-x-8' }
    };
    return sizes[size] || sizes.md;
  };

  const sizeClasses = getSizeClasses();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  const activeColor = thematicColors?.base || '#EC4899';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={handleClick}
      className={`relative inline-flex ${sizeClasses.container} items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      style={{
        backgroundColor: checked ? activeColor : '#D1D5DB',
        '--tw-ring-color': activeColor
      }}
      disabled={disabled}
    >
      <span
        className={`inline-block ${sizeClasses.toggle} transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
          checked ? sizeClasses.translate : 'translate-x-1'
        }`}
        style={{
          boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)'
        }}
      />
    </button>
  );
};

export default Switch;