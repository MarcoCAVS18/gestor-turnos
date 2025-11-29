// src/components/ui/Flex/index.jsx

import React from 'react';

const Flex = (***REMOVED*** variant, children, className = '', ...props ***REMOVED***) => ***REMOVED***
  const getVariantClasses = () => ***REMOVED***
    switch (variant) ***REMOVED***
      case 'center':
        return 'flex items-center justify-center';
      case 'between':
        return 'flex items-center justify-between';
      case 'start':
        return 'flex items-center justify-start';
      case 'end':
        return 'flex items-center justify-end';
      case 'start-between':
        return 'flex items-start justify-between';
      default:
        return 'flex items-center';
    ***REMOVED***
  ***REMOVED***;

  const combinedClassName = `$***REMOVED***getVariantClasses()***REMOVED*** $***REMOVED***className***REMOVED***`.trim();

  return (
    <div className=***REMOVED***combinedClassName***REMOVED*** ***REMOVED***...props***REMOVED***>
      ***REMOVED***children***REMOVED***
    </div>
  );
***REMOVED***;

export default Flex;
