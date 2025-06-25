// src/components/ui/Card/index.jsx

import React from 'react';

const Card = (***REMOVED***
  children,
  className = '',
  padding = 'md',
  shadow = 'md',
  rounded = 'xl',
  borderColor,
  borderPosition = 'none'
***REMOVED***) => ***REMOVED***
  const getPaddingClasses = () => ***REMOVED***
    const paddings = ***REMOVED***
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8'
    ***REMOVED***;
    return paddings[padding] || paddings.md;
  ***REMOVED***;

  const getShadowClasses = () => ***REMOVED***
    const shadows = ***REMOVED***
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl'
    ***REMOVED***;
    return shadows[shadow] || shadows.md;
  ***REMOVED***;

  const getRoundedClasses = () => ***REMOVED***
    const roundeds = ***REMOVED***
      none: '',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl'
    ***REMOVED***;
    return roundeds[rounded] || roundeds.xl;
  ***REMOVED***;

  const getBorderClasses = () => ***REMOVED***
    if (!borderColor || borderPosition === 'none') return '';
    
    const positions = ***REMOVED***
      left: 'border-l-4',
      right: 'border-r-4',
      top: 'border-t-4',
      bottom: 'border-b-4',
      all: 'border-4'
    ***REMOVED***;
    
    return positions[borderPosition] || '';
  ***REMOVED***;

  const getBorderStyle = () => ***REMOVED***
    if (!borderColor || borderPosition === 'none') return ***REMOVED******REMOVED***;
    
    return ***REMOVED***
      [`border$***REMOVED***borderPosition === 'all' ? '' : '-' + borderPosition***REMOVED***-color`]: borderColor
    ***REMOVED***;
  ***REMOVED***;

  return (
    <div
      className=***REMOVED***`bg-white $***REMOVED***getPaddingClasses()***REMOVED*** $***REMOVED***getShadowClasses()***REMOVED*** $***REMOVED***getRoundedClasses()***REMOVED*** $***REMOVED***getBorderClasses()***REMOVED*** $***REMOVED***className***REMOVED***`***REMOVED***
      style=***REMOVED***getBorderStyle()***REMOVED***
    >
      ***REMOVED***children***REMOVED***
    </div>
  );
***REMOVED***;

export default Card;