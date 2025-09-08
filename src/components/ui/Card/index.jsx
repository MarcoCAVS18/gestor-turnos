// src/components/ui/Card/index.jsx

import React from 'react';

const Card = (***REMOVED***
  children,
  className = '',
  padding = 'md',
  shadow = 'md',
  rounded = 'xl',
  borderColor,
  borderPosition = 'none',
  borderWidth = '1',
  hover = false,
  interactive = false,
  onClick,
  variant = 'default',
  ...props
***REMOVED***) => ***REMOVED***
  const getPaddingClasses = () => ***REMOVED***
    const paddings = ***REMOVED***
      none: '',
      xs: 'p-2',
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
      left: `border-l-$***REMOVED***borderWidth***REMOVED***`,
      right: `border-r-$***REMOVED***borderWidth***REMOVED***`,
      top: `border-t-$***REMOVED***borderWidth***REMOVED***`,
      bottom: `border-b-$***REMOVED***borderWidth***REMOVED***`,
      all: `border-$***REMOVED***borderWidth***REMOVED***`
    ***REMOVED***;
    
    return positions[borderPosition] || '';
  ***REMOVED***;

  const getVariantClasses = () => ***REMOVED***
    const variants = ***REMOVED***
      default: 'bg-white border border-gray-200',
      elevated: 'bg-white',
      outlined: 'bg-white border-2 border-gray-300',
      ghost: 'bg-transparent',
      gradient: 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
    ***REMOVED***;
    return variants[variant] || variants.default;
  ***REMOVED***;

  const getInteractiveClasses = () => ***REMOVED***
    if (!interactive && !onClick && !hover) return '';
    
    return 'transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md';
  ***REMOVED***;

  const getBorderStyle = () => ***REMOVED***
    if (!borderColor || borderPosition === 'none') return ***REMOVED******REMOVED***;
    
    return ***REMOVED***
      [`border$***REMOVED***borderPosition === 'all' ? '' : '-' + borderPosition***REMOVED***-color`]: borderColor
    ***REMOVED***;
  ***REMOVED***;

  const combinedClassName = `
    $***REMOVED***getVariantClasses()***REMOVED***
    $***REMOVED***getPaddingClasses()***REMOVED*** 
    $***REMOVED***getShadowClasses()***REMOVED*** 
    $***REMOVED***getRoundedClasses()***REMOVED*** 
    $***REMOVED***getBorderClasses()***REMOVED***
    $***REMOVED***getInteractiveClasses()***REMOVED***
    $***REMOVED***className***REMOVED***
  `.trim().replace(/\s+/g, ' ');

  return (
    <div
      className=***REMOVED***combinedClassName***REMOVED***
      style=***REMOVED***getBorderStyle()***REMOVED***
      onClick=***REMOVED***interactive || onClick ? onClick : undefined***REMOVED***
      ***REMOVED***...props***REMOVED***
    >
      ***REMOVED***children***REMOVED***
    </div>
  );
***REMOVED***;

export default Card;