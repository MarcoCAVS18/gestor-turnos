import React from 'react';
import Button from '../ui/Button';

// Este wrapper mantiene la compatibilidad mientras migramos
const DynamicButton = (props) => {
  // Mapear cualquier prop específica de DynamicButton a Button si es necesario
  return <Button {...props} />;
};

export default DynamicButton;