// src/components/layout/PageHeader/index.jsx

import React from 'react';
import Button from '../../ui/Button';

const PageHeader = ({ 
  title, 
  subtitle,
  action,
  className = '' 
}) => {
  return (
    <div className={`flex justify-between items-start mb-6 ${className}`}>
      <div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {subtitle && (
          <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
        )}
      </div>
      
      {action && (
        <Button 
          onClick={action.onClick}
          className="flex items-center gap-2"
          icon={action.icon}
          variant={action.variant || 'primary'}
          size={action.size || 'md'}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default PageHeader;