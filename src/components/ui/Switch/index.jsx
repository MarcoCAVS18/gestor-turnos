// src/components/ui/Switch/index.jsx

import React from 'react';

const Switch = ({ checked, onChange, disabled = false, size = 'md' }) => {
  console.log('Switch - Props:', { checked, disabled });
  
  const getSizeClasses = () => {
    const sizes = {
      sm: { container: 'h-5 w-9', toggle: 'h-3 w-3', translate: 'translate-x-4' },
      md: { container: 'h-6 w-11', toggle: 'h-4 w-4', translate: 'translate-x-6' },
      lg: { container: 'h-7 w-14', toggle: 'h-5 w-5', translate: 'translate-x-8' }
    };
    return sizes[size] || sizes.md;
  };

  const sizeClasses = getSizeClasses();

  const handleClick = () => {
    console.log('Switch - Click event, current checked:', checked);
    if (!disabled) {
      console.log('Switch - Calling onChange with:', !checked);
      onChange(!checked);
    } else {
      console.log('Switch - Click ignored, disabled:', disabled);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`relative inline-flex ${sizeClasses.container} items-center rounded-full transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${checked ? 'bg-pink-600' : 'bg-gray-200'}`}
      disabled={disabled}
    >
      <span
        className={`inline-block ${sizeClasses.toggle} transform rounded-full bg-white transition-transform ${
          checked ? sizeClasses.translate : 'translate-x-1'
        }`}
      />
    </button>
  );
};

export default Switch;