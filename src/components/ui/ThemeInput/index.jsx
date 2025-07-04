// src/components/ui/ThemeInput/index.jsx

import React from 'react';
import { useApp } from '../../../contexts/AppContext';
import Input from '../Input';

const ThemeInput = ({ ...props }) => {
  const { thematicColors } = useApp();
  
  return (
    <Input 
      focusColor={thematicColors?.base || '#EC4899'}
      {...props} 
    />
  );
};

export default ThemeInput;