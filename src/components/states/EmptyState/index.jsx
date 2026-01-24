// src/components/states/EmptyState/index.jsx

import React from 'react';
import Button from '../../ui/Button';
import Card from '../../ui/Card';

const EmptyStateContent = ({ icon: Icon, title, description, action }) => (
  <>
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
  </>
);

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className = '',
  contained = false 
}) => {
  if (contained) {
    return (
      <div className={`text-center ${className}`}>
        <EmptyStateContent icon={Icon} title={title} description={description} action={action} />
      </div>
    );
  }

  return (
    <Card className={`text-center py-12 ${className}`}>
      <EmptyStateContent icon={Icon} title={title} description={description} action={action} />
    </Card>
  );
};

export default EmptyState;