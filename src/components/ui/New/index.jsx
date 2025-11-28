// src/components/ui/New/index.jsx

import React from 'react';

const New = ({ 
  children = 'NEW',
  size = 'sm',
  className = '',
  animated = true,
  ...props 
}) => {
  
  const getSizeClasses = () => {
    const sizes = {
      xs: 'px-1.5 py-0.5 text-xs',
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-sm'
    };
    return sizes[size] || sizes.sm;
  };

  const baseClasses = `
    inline-flex items-center justify-center
    bg-red-500 text-white font-bold
    rounded-full uppercase tracking-wider
    transition-all duration-300 ease-out
    select-none
    ${getSizeClasses()}
    ${className}
  `;

  const animatedClasses = animated ? `
    hover:bg-red-600 hover:scale-110 hover:shadow-lg
    hover:shadow-red-500/30 hover:-translate-y-0.5
    active:scale-95 active:translate-y-0
    select-none
  ` : '';

  return (
    <span 
      className={`${baseClasses} ${animatedClasses}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
};

export default New;