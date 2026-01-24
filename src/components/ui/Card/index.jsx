// src/components/ui/Card/index.jsx

import React from 'react';

const Card = ({
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
}) => {
  const getPaddingClasses = () => {
    const paddings = {
      none: '',
      xs: 'p-2',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8'
    };
    return paddings[padding] || paddings.md;
  };

  const getShadowClasses = () => {
    const shadows = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl'
    };
    return shadows[shadow] || shadows.md;
  };

  const getRoundedClasses = () => {
    const roundeds = {
      none: '',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl'
    };
    return roundeds[rounded] || roundeds.xl;
  };

  const getBorderClasses = () => {
    if (!borderColor || borderPosition === 'none') return '';
    
    const positions = {
      left: `border-l-${borderWidth}`,
      right: `border-r-${borderWidth}`,
      top: `border-t-${borderWidth}`,
      bottom: `border-b-${borderWidth}`,
      all: `border-${borderWidth}`
    };
    
    return positions[borderPosition] || '';
  };

  const getVariantClasses = () => {
    const variants = {
      default: 'bg-white border-gray-200',
      elevated: 'bg-white',
      outlined: 'bg-white border-2 border-gray-300',
      ghost: 'bg-transparent',
      gradient: 'bg-gradient-to-br from-white to-gray-50 border-gray-200',
      transparent: 'bg-transparent border-none shadow-none'
    };
    return variants[variant] || variants.default;
  };

  const getInteractiveClasses = () => {
    if (!interactive && !onClick && !hover) return '';
    
    return 'transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:shadow-md';
  };

  const getBorderStyle = () => {
    if (!borderColor || borderPosition === 'none') return {};
    
    return {
      [`border${borderPosition === 'all' ? '' : '-' + borderPosition}-color`]: borderColor
    };
  };

  const combinedClassName = `
    ${getVariantClasses()}
    ${getPaddingClasses()} 
    ${variant !== 'transparent' ? getShadowClasses() : ''} 
    ${getRoundedClasses()} 
    ${getBorderClasses()}
    ${getInteractiveClasses()}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div
      className={combinedClassName}
      style={getBorderStyle()}
      onClick={interactive || onClick ? onClick : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;