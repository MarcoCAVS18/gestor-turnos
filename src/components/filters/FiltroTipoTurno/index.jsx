// src/components/filters/FiltroTipoTurno/index.jsx - REFACTORIZADO

import React from 'react';
import { Clock } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { getAvailableShiftTypes } from '../../../utils/shiftTypesConfig';

const FiltroTipoTurno = ({ value, onChange }) => {
  const { turnosPorFecha, shiftRanges } = useApp();
  const colors = useThemeColors();
  
  // Obtener tipos de turno disponibles dinámicamente
  const tiposTurno = getAvailableShiftTypes(turnosPorFecha, shiftRanges, { base: colors.primary });

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Clock size={16} className="inline mr-2" />
        Tipo de turno
      </label>
      
      <div className="space-y-2">
        {tiposTurno.map(tipo => {
          const Icon = tipo.icon;
          const isSelected = value === tipo.id;
          
          return (
            <button
              key={tipo.id}
              onClick={() => onChange(tipo.id)}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:scale-[1.02] hover:shadow-sm"
              style={{
                backgroundColor: isSelected 
                  ? `${tipo.color}15`
                  : 'transparent',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: isSelected 
                  ? tipo.color 
                  : '#E5E7EB',
                color: isSelected 
                  ? tipo.color 
                  : '#6B7280'
              }}
            >
              <Icon size={16} style={{ color: tipo.color }} />
              <span className="flex-1 text-left">{tipo.label}</span>
              
              {/* Indicador de selección */}
              {isSelected && (
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: tipo.color }}
                />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Mostrar tipo seleccionado */}
      {value !== 'todos' && (
        <div className="mt-2 text-xs text-gray-600">
          <Clock size={12} className="inline mr-1" />
          Filtrado por: {tiposTurno.find(t => t.id === value)?.label}
        </div>
      )}
    </div>
  );
};

export default FiltroTipoTurno;