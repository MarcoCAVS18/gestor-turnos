// src/components/ui/Switch/index.jsx

import React from 'react';

const Switch = (***REMOVED*** checked, onChange, disabled = false, size = 'md' ***REMOVED***) => ***REMOVED***
  
  const getSizeClasses = () => ***REMOVED***
    const sizes = ***REMOVED***
      sm: ***REMOVED*** container: 'h-5 w-9', toggle: 'h-3 w-3', translate: 'translate-x-4' ***REMOVED***,
      md: ***REMOVED*** container: 'h-6 w-11', toggle: 'h-4 w-4', translate: 'translate-x-6' ***REMOVED***,
      lg: ***REMOVED*** container: 'h-7 w-14', toggle: 'h-5 w-5', translate: 'translate-x-8' ***REMOVED***
    ***REMOVED***;
    return sizes[size] || sizes.md;
  ***REMOVED***;

  const sizeClasses = getSizeClasses();

  const handleClick = () => ***REMOVED***
    if (!disabled) ***REMOVED***
      onChange(!checked);
    ***REMOVED*** else ***REMOVED***
      // Click ignored, switch is disabled
    ***REMOVED***
  ***REMOVED***;

  return (
    <button
      type="button"
      onClick=***REMOVED***handleClick***REMOVED***
      className=***REMOVED***`relative inline-flex $***REMOVED***sizeClasses.container***REMOVED*** items-center rounded-full transition-colors $***REMOVED***
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      ***REMOVED*** $***REMOVED***checked ? 'bg-pink-600' : 'bg-gray-200'***REMOVED***`***REMOVED***
      disabled=***REMOVED***disabled***REMOVED***
    >
      <span
        className=***REMOVED***`inline-block $***REMOVED***sizeClasses.toggle***REMOVED*** transform rounded-full bg-white transition-transform $***REMOVED***
          checked ? sizeClasses.translate : 'translate-x-1'
        ***REMOVED***`***REMOVED***
      />
    </button>
  );
***REMOVED***;

export default Switch;