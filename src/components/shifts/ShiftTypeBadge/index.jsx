// src/components/shifts/ShiftTypeBadge/index.jsx

import React from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** TURN_TYPE_COLORS ***REMOVED*** from '../../../constants/colors';
import ***REMOVED*** getShiftTypesConfig ***REMOVED*** from '../../../utils/shiftTypesConfig';
import ***REMOVED*** determinarTipoTurno ***REMOVED*** from '../../../utils/shiftDetailsUtils';

const ShiftTypeBadge = (***REMOVED*** tipoTurno, turno, size = 'sm' ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** shiftRanges ***REMOVED*** = useApp();
  
  // Determinar el tipo si se pasa el turno completo
  const tipo = tipoTurno || determinarTipoTurno(turno, shiftRanges);
  
  // Mapeo directo a las constantes de colores
  const getColorAndConfig = (tipoTurno) => ***REMOVED***
    const configs = ***REMOVED***
      diurno: ***REMOVED***
        color: TURN_TYPE_COLORS.Diurno,
        label: 'Diurno',
        bgColor: TURN_TYPE_COLORS.Diurno + '20'
      ***REMOVED***,
      tarde: ***REMOVED***
        color: TURN_TYPE_COLORS.Tarde,
        label: 'Tarde', 
        bgColor: TURN_TYPE_COLORS.Tarde + '20'
      ***REMOVED***,
      noche: ***REMOVED***
        color: TURN_TYPE_COLORS.Nocturno,
        label: 'Nocturno',
        bgColor: TURN_TYPE_COLORS.Nocturno + '20'
      ***REMOVED***,
      sabado: ***REMOVED***
        color: TURN_TYPE_COLORS.Sábado,
        label: 'Sábado',
        bgColor: TURN_TYPE_COLORS.Sábado + '20'
      ***REMOVED***,
      domingo: ***REMOVED***
        color: TURN_TYPE_COLORS.Domingo,
        label: 'Domingo',
        bgColor: TURN_TYPE_COLORS.Domingo + '20'
      ***REMOVED***,
      mixto: ***REMOVED***
        color: '#6B7280',
        label: 'Mixto',
        bgColor: '#6B728020'
      ***REMOVED***
    ***REMOVED***;
    
    return configs[tipoTurno] || configs.mixto;
  ***REMOVED***;
  
  const tipoConfig = getColorAndConfig(tipo);
  
  const sizeClasses = ***REMOVED***
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  ***REMOVED***;

  return (
    <div 
      className=***REMOVED***`inline-flex items-center rounded-full font-medium $***REMOVED***sizeClasses[size]***REMOVED***`***REMOVED***
      style=***REMOVED******REMOVED*** 
        backgroundColor: tipoConfig.bgColor,
        color: tipoConfig.color
      ***REMOVED******REMOVED***
      title=***REMOVED***`Turno $***REMOVED***tipoConfig.label***REMOVED***`***REMOVED***
    >
      <span className="truncate">***REMOVED***tipoConfig.label***REMOVED***</span>
      
      ***REMOVED***/* Indicador especial para turnos nocturnos */***REMOVED***
      ***REMOVED***turno?.cruzaMedianoche && tipo === 'noche' && (
        <span className="ml-1 text-xs opacity-75">•</span>
      )***REMOVED***
      
      ***REMOVED***/* Indicador especial para turnos mixtos */***REMOVED***
      ***REMOVED***tipo === 'mixto' && (
        <span className="ml-1 text-xs opacity-75">~</span>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default ShiftTypeBadge;