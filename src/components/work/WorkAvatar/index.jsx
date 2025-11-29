// src/components/work/WorkAvatar/index.jsx 

import React from 'react';
import Flex from '../../ui/Flex';

const WorkAvatar = (***REMOVED*** nombre, color, size = 'md' ***REMOVED***) => ***REMOVED***
  const sizes = ***REMOVED***
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl'
  ***REMOVED***;

  // Validaciones defensivas
  const nombreSeguro = nombre || 'T'; // T de "Trabajo"
  const colorSeguro = color || '#EC4899';
  const sizeSeguro = sizes[size] || sizes.md;

  // Obtener primera letra del nombre de forma segura
  const inicial = nombreSeguro.toString().charAt(0).toUpperCase() || 'T';

  return (
    <Flex variant="center" 
      className=***REMOVED***`$***REMOVED***sizeSeguro***REMOVED*** rounded-lg`***REMOVED***
      style=***REMOVED******REMOVED*** backgroundColor: colorSeguro ***REMOVED******REMOVED***
    >
      <span className="text-white font-bold">
        ***REMOVED***inicial***REMOVED***
      </span>
    </Flex>
  );
***REMOVED***;

export default WorkAvatar;