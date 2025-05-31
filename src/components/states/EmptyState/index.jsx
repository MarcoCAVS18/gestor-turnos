// src/components/states/EmptyState/index.jsx

import React from 'react';
import Button from '../../ui/Button';
import Card from '../../ui/Card';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className = '' 
}) => {
  return (
    <Card className={`text-center py-12 ${className}`}>
      {Icon && <Icon size={48} className="mx-auto text-gray-400 mb-4" />}
      <h3 className="text-lg font-semibold text-gray-600 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      {action && (
        <Button 
          onClick={action.onClick}
          className="flex items-center gap-2"
          icon={action.icon}
          variant={action.variant || 'primary'}
        >
          {action.label}
        </Button>
      )}
    </Card>
  );
};

export default EmptyState;