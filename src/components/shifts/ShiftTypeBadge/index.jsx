// src/components/shift/ShiftTypeBadge/index.jsx

import React from 'react';
import { useApp } from '../../../contexts/AppContext';
import { getShiftTypesConfig } from '../../../utils/shiftTypesConfig';
import { determinarTipoTurno } from '../../../utils/shiftDetailsUtils';

const ShiftTypeBadge = ({ tipoTurno, turno, size = 'sm' }) => {
  const { thematicColors, shiftRanges } = useApp();
  
  // Obtener la configuración de tipos de turno
  const shiftTypesConfig = getShiftTypesConfig(thematicColors);
  
  // Determinar el tipo si se pasa el turno completo
  const tipo = tipoTurno || determinarTipoTurno(turno, shiftRanges);
  
  // Obtener la configuración del tipo
  const tipoInfo = shiftTypesConfig[tipo] || shiftTypesConfig.noche;
  const Icon = tipoInfo.icon;
  
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  const iconSizes = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16
  };

  return (
    <div 
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]}`}
      style={{ 
        backgroundColor: tipoInfo.bgColor,
        color: tipoInfo.color
      }}
      title={tipoInfo.description}
    >
      <Icon size={iconSizes[size]} className="mr-1 flex-shrink-0" />
      <span className="truncate">{tipoInfo.label}</span>
      
      {/* Indicador especial para turnos nocturnos */}
      {turno?.cruzaMedianoche && tipo === 'noche' && (
        <span className="ml-1 text-xs opacity-75">🌙</span>
      )}
      
      {/* Indicador especial para turnos mixtos */}
      {tipo === 'mixto' && (
        <span className="ml-1 text-xs opacity-75">🔄</span>
      )}
    </div>
  );
};

export default ShiftTypeBadge;