// src/components/shifts/ShiftTypeBadge/index.jsx

import React from 'react';
import { useApp } from '../../../contexts/AppContext';
import { TURN_TYPE_COLORS } from '../../../constants/colors';
import { getShiftTypesConfig } from '../../../utils/shiftTypesConfig';
import { determinarTipoTurno } from '../../../utils/shiftDetailsUtils';

const ShiftTypeBadge = ({ tipoTurno, turno, size = 'sm' }) => {
  const { shiftRanges } = useApp();
  
  // Determinar el tipo si se pasa el turno completo
  const tipo = tipoTurno || determinarTipoTurno(turno, shiftRanges);
  
  // Mapeo directo a las constantes de colores
  const getColorAndConfig = (tipoTurno) => {
    const configs = {
      diurno: {
        color: TURN_TYPE_COLORS.Diurno,
        label: 'Diurno',
        bgColor: TURN_TYPE_COLORS.Diurno + '20'
      },
      tarde: {
        color: TURN_TYPE_COLORS.Tarde,
        label: 'Tarde', 
        bgColor: TURN_TYPE_COLORS.Tarde + '20'
      },
      noche: {
        color: TURN_TYPE_COLORS.Nocturno,
        label: 'Nocturno',
        bgColor: TURN_TYPE_COLORS.Nocturno + '20'
      },
      sabado: {
        color: TURN_TYPE_COLORS.Sábado,
        label: 'Sábado',
        bgColor: TURN_TYPE_COLORS.Sábado + '20'
      },
      domingo: {
        color: TURN_TYPE_COLORS.Domingo,
        label: 'Domingo',
        bgColor: TURN_TYPE_COLORS.Domingo + '20'
      },
      mixto: {
        color: '#6B7280',
        label: 'Mixto',
        bgColor: '#6B728020'
      }
    };
    
    return configs[tipoTurno] || configs.mixto;
  };
  
  const tipoConfig = getColorAndConfig(tipo);
  
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <div 
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]}`}
      style={{ 
        backgroundColor: tipoConfig.bgColor,
        color: tipoConfig.color
      }}
      title={`Turno ${tipoConfig.label}`}
    >
      <span className="truncate">{tipoConfig.label}</span>
      
      {/* Indicador especial para turnos nocturnos */}
      {turno?.cruzaMedianoche && tipo === 'noche' && (
        <span className="ml-1 text-xs opacity-75">•</span>
      )}
      
      {/* Indicador especial para turnos mixtos */}
      {tipo === 'mixto' && (
        <span className="ml-1 text-xs opacity-75">~</span>
      )}
    </div>
  );
};

export default ShiftTypeBadge;