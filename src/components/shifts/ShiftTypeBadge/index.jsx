// src/components/shift/ShiftTypeBadge/index.jsx

import React from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** getShiftTypesConfig ***REMOVED*** from '../../../utils/shiftTypesConfig';
import ***REMOVED*** determinarTipoTurno ***REMOVED*** from '../../../utils/shiftDetailsUtils';

const ShiftTypeBadge = (***REMOVED*** tipoTurno, turno, size = 'sm' ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors, shiftRanges ***REMOVED*** = useApp();
  
  // Obtener la configuración de tipos de turno
  const shiftTypesConfig = getShiftTypesConfig(thematicColors);
  
  // Determinar el tipo si se pasa el turno completo
  const tipo = tipoTurno || determinarTipoTurno(turno, shiftRanges);
  
  // Obtener la configuración del tipo
  const tipoInfo = shiftTypesConfig[tipo] || shiftTypesConfig.noche;
  const Icon = tipoInfo.icon;
  
  const sizeClasses = ***REMOVED***
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  ***REMOVED***;
  
  const iconSizes = ***REMOVED***
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16
  ***REMOVED***;

  return (
    <div 
      className=***REMOVED***`inline-flex items-center rounded-full font-medium $***REMOVED***sizeClasses[size]***REMOVED***`***REMOVED***
      style=***REMOVED******REMOVED*** 
        backgroundColor: tipoInfo.bgColor,
        color: tipoInfo.color
      ***REMOVED******REMOVED***
      title=***REMOVED***tipoInfo.description***REMOVED***
    >
      <Icon size=***REMOVED***iconSizes[size]***REMOVED*** className="mr-1 flex-shrink-0" />
      <span className="truncate">***REMOVED***tipoInfo.label***REMOVED***</span>
      
      ***REMOVED***/* Indicador especial para turnos nocturnos */***REMOVED***
      ***REMOVED***turno?.cruzaMedianoche && tipo === 'noche' && (
        <span className="ml-1 text-xs opacity-75">🌙</span>
      )***REMOVED***
      
      ***REMOVED***/* Indicador especial para turnos mixtos */***REMOVED***
      ***REMOVED***tipo === 'mixto' && (
        <span className="ml-1 text-xs opacity-75">🔄</span>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default ShiftTypeBadge;