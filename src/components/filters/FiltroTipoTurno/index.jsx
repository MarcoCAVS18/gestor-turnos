// src/components/filters/FiltroTipoTurno/index.jsx

import React from 'react';
import ***REMOVED*** Clock ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** getAvailableShiftTypes ***REMOVED*** from '../../../utils/shiftTypesConfig';

const FiltroTipoTurno = (***REMOVED*** value, onChange ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors, turnosPorFecha, shiftRanges ***REMOVED*** = useApp();
  
  // Obtener tipos de turno disponibles dinámicamente
  const tiposTurno = getAvailableShiftTypes(turnosPorFecha, shiftRanges, thematicColors);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tipo de turno
      </label>
      
      <div className="space-y-2">
        ***REMOVED***tiposTurno.map(tipo => ***REMOVED***
          const Icon = tipo.icon;
          const isSelected = value === tipo.id;
          
          return (
            <button
              key=***REMOVED***tipo.id***REMOVED***
              onClick=***REMOVED***() => onChange(tipo.id)***REMOVED***
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:scale-[1.02] hover:shadow-sm"
              style=***REMOVED******REMOVED***
                backgroundColor: isSelected 
                  ? `$***REMOVED***tipo.color***REMOVED***15`
                  : 'transparent',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: isSelected 
                  ? tipo.color 
                  : '#E5E7EB',
                color: isSelected 
                  ? tipo.color 
                  : '#6B7280'
              ***REMOVED******REMOVED***
            >
              <Icon size=***REMOVED***16***REMOVED*** style=***REMOVED******REMOVED*** color: tipo.color ***REMOVED******REMOVED*** />
              <span className="flex-1 text-left">***REMOVED***tipo.label***REMOVED***</span>
              
              ***REMOVED***/* Indicador de selección */***REMOVED***
              ***REMOVED***isSelected && (
                <div 
                  className="w-2 h-2 rounded-full"
                  style=***REMOVED******REMOVED*** backgroundColor: tipo.color ***REMOVED******REMOVED***
                />
              )***REMOVED***
            </button>
          );
        ***REMOVED***)***REMOVED***
      </div>
      
      ***REMOVED***/* Mostrar tipo seleccionado */***REMOVED***
      ***REMOVED***value !== 'todos' && (
        <div className="mt-2 text-xs text-gray-600">
          Filtrado por: ***REMOVED***tiposTurno.find(t => t.id === value)?.label***REMOVED***
        </div>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default FiltroTipoTurno;