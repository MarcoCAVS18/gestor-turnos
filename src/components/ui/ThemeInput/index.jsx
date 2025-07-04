// src/components/ui/ThemeInput/index.jsx

import React from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import Input from '../Input';

const ThemeInput = (***REMOVED*** ...props ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors ***REMOVED*** = useApp();
  
  return (
    <Input 
      focusColor=***REMOVED***thematicColors?.base || '#EC4899'***REMOVED***
      ***REMOVED***...props***REMOVED*** 
    />
  );
***REMOVED***;

export default ThemeInput;