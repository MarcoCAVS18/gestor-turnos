// src/components/ui/Card/index.jsx

import React from 'react';

const Card = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'md',
  rounded = 'xl',
  borderColor,
  borderPosition = 'none'
}) => {
  const getPaddingClasses = () => {
    const paddings = {
      none: '',
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
      left: 'border-l-4',
      right: 'border-r-4',
      top: 'border-t-4',
      bottom: 'border-b-4',
      all: 'border-4'
    };
    
    return positions[borderPosition] || '';
  };

  const getBorderStyle = () => {
    if (!borderColor || borderPosition === 'none') return {};
    
    return {
      [`border${borderPosition === 'all' ? '' : '-' + borderPosition}-color`]: borderColor
    };
  };

  return (
    <div
      className={`bg-white ${getPaddingClasses()} ${getShadowClasses()} ${getRoundedClasses()} ${getBorderClasses()} ${className}`}
      style={getBorderStyle()}
    >
      {children}
    </div>
  );
};

export default Card;