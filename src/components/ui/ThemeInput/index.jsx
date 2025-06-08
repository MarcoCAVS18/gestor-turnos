// src/components/ui/ThemeInput/index.jsx

import React from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import Input from '../Input';

const ThemeInput = (***REMOVED*** ...props ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** coloresTemáticos ***REMOVED*** = useApp();
  
  return (
    <Input 
      focusColor=***REMOVED***coloresTemáticos?.base || '#EC4899'***REMOVED***
      ***REMOVED***...props***REMOVED*** 
    />
  );
***REMOVED***;

export default ThemeInput;