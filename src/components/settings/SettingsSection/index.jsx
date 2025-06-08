// src/components/settings/SettingsSection/index.jsx

import React from 'react';
import Card from '../../ui/Card';

const SettingsSection = ({ 
  icon: Icon, 
  title, 
  children, 
  className = '' 
}) => {
  return (
    <Card className={`mb-6 ${className}`}>
      <div className="flex items-center mb-4">
        <Icon className="h-5 w-5 text-gray-500 mr-2" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </Card>
  );
};

export default SettingsSection;