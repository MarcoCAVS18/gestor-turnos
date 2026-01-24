// src/components/ui/Flex/index.jsx

import React from 'react';

const Flex = ({ variant, children, className = '', ...props }) => {
  const getVariantClasses = () => {
    switch (variant) {
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
    }
  };

  const combinedClassName = `${getVariantClasses()} ${className}`.trim();

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
};

export default Flex;
