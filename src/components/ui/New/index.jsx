// src/components/ui/New/index.jsx

import React from 'react';

const New = (***REMOVED*** 
  children = 'NEW',
  size = 'sm',
  className = '',
  animated = true,
  ...props 
***REMOVED***) => ***REMOVED***
  
  const getSizeClasses = () => ***REMOVED***
    const sizes = ***REMOVED***
      xs: 'px-1.5 py-0.5 text-xs',
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-sm'
    ***REMOVED***;
    return sizes[size] || sizes.sm;
  ***REMOVED***;

  const baseClasses = `
    inline-flex items-center justify-center
    bg-red-500 text-white font-bold
    rounded-full uppercase tracking-wider
    transition-all duration-300 ease-out
    select-none
    $***REMOVED***getSizeClasses()***REMOVED***
    $***REMOVED***className***REMOVED***
  `;

  const animatedClasses = animated ? `
    hover:bg-red-600 hover:scale-110 hover:shadow-lg
    hover:shadow-red-500/30 hover:-translate-y-0.5
    active:scale-95 active:translate-y-0
    select-none
  ` : '';

  return (
    <span 
      className=***REMOVED***`$***REMOVED***baseClasses***REMOVED*** $***REMOVED***animatedClasses***REMOVED***`.trim()***REMOVED***
      ***REMOVED***...props***REMOVED***
    >
      ***REMOVED***children***REMOVED***
    </span>
  );
***REMOVED***;

export default New;