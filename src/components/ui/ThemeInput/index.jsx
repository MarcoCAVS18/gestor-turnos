// src/components/ui/ThemeInput/index.jsx

import React from 'react';
import { useApp } from '../../../contexts/AppContext';
import Input from '../Input';

const ThemeInput = ({ ...props }) => {
  const { coloresTemáticos } = useApp();
  
  return (
    <Input 
      focusColor={coloresTemáticos?.base || '#EC4899'}
      {...props} 
    />
  );
};

export default ThemeInput;