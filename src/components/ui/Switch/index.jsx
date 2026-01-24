// src/components/ui/Switch/index.jsx

import React from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';

const Switch = (***REMOVED*** checked, onChange, disabled = false, size = 'md' ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors ***REMOVED*** = useApp();
  
  const getSizeClasses = () => ***REMOVED***
    const sizes = ***REMOVED***
      sm: ***REMOVED*** container: 'h-5 w-9', toggle: 'h-3 w-3', translate: 'translate-x-4' ***REMOVED***,
      md: ***REMOVED*** container: 'h-6 w-11', toggle: 'h-4 w-4', translate: 'translate-x-6' ***REMOVED***,
      lg: ***REMOVED*** container: 'h-7 w-14', toggle: 'h-5 w-5', translate: 'translate-x-8' ***REMOVED***
    ***REMOVED***;
    return sizes[size] || sizes.md;
  ***REMOVED***;

  const sizeClasses = getSizeClasses();

  const handleClick = (e) => ***REMOVED***
    e.preventDefault();
    e.stopPropagation();
    
    if (!disabled && onChange) ***REMOVED***
      onChange(!checked);
    ***REMOVED***
  ***REMOVED***;

  const activeColor = thematicColors?.base || '#EC4899';

  return (
    <button
      type="button"
      role="switch"
      aria-checked=***REMOVED***checked***REMOVED***
      onClick=***REMOVED***handleClick***REMOVED***
      className=***REMOVED***`relative inline-flex $***REMOVED***sizeClasses.container***REMOVED*** items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 $***REMOVED***
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      ***REMOVED***`***REMOVED***
      style=***REMOVED******REMOVED***
        backgroundColor: checked ? activeColor : '#D1D5DB',
        '--tw-ring-color': activeColor
      ***REMOVED******REMOVED***
      disabled=***REMOVED***disabled***REMOVED***
    >
      <span
        className=***REMOVED***`inline-block $***REMOVED***sizeClasses.toggle***REMOVED*** transform rounded-full bg-white shadow-lg transition-transform duration-200 $***REMOVED***
          checked ? sizeClasses.translate : 'translate-x-1'
        ***REMOVED***`***REMOVED***
        style=***REMOVED******REMOVED***
          boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)'
        ***REMOVED******REMOVED***
      />
    </button>
  );
***REMOVED***;

export default Switch;