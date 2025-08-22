// src/components/filters/FiltroDiasSemana/index.jsx - REFACTORIZADO

import React from 'react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';

const FiltroDiasSemana = (***REMOVED*** value, onChange ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  
  const diasSemana = [
    ***REMOVED*** id: 'lunes', label: 'L', nombre: 'Lunes' ***REMOVED***,
    ***REMOVED*** id: 'martes', label: 'M', nombre: 'Martes' ***REMOVED***,
    ***REMOVED*** id: 'miercoles', label: 'X', nombre: 'Miércoles' ***REMOVED***,
    ***REMOVED*** id: 'jueves', label: 'J', nombre: 'Jueves' ***REMOVED***,
    ***REMOVED*** id: 'viernes', label: 'V', nombre: 'Viernes' ***REMOVED***,
    ***REMOVED*** id: 'sabado', label: 'S', nombre: 'Sábado' ***REMOVED***,
    ***REMOVED*** id: 'domingo', label: 'D', nombre: 'Domingo' ***REMOVED***
  ];

  const handleDayToggle = (dayId) => ***REMOVED***
    const newValue = value.includes(dayId)
      ? value.filter(d => d !== dayId)
      : [...value, dayId];
    onChange(newValue);
  ***REMOVED***;

  const selectAll = () => ***REMOVED***
    onChange(diasSemana.map(d => d.id));
  ***REMOVED***;

  const clearAll = () => ***REMOVED***
    onChange([]);
  ***REMOVED***;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Días de la semana
        </label>
        <div className="flex space-x-1">
          ***REMOVED***value.length < diasSemana.length && (
            <button
              onClick=***REMOVED***selectAll***REMOVED***
              className="text-xs px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
              style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
            >
              Todos
            </button>
          )***REMOVED***
          ***REMOVED***value.length > 0 && (
            <button
              onClick=***REMOVED***clearAll***REMOVED***
              className="text-xs text-gray-500 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              Ninguno
            </button>
          )***REMOVED***
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        ***REMOVED***diasSemana.map(dia => ***REMOVED***
          const isSelected = value.includes(dia.id);
          return (
            <button
              key=***REMOVED***dia.id***REMOVED***
              onClick=***REMOVED***() => handleDayToggle(dia.id)***REMOVED***
              className="w-8 h-8 rounded-lg text-xs font-medium transition-all hover:scale-105 flex items-center justify-center"
              style=***REMOVED******REMOVED***
                backgroundColor: isSelected 
                  ? colors.primary 
                  : 'transparent',
                color: isSelected 
                  ? 'white' 
                  : colors.primary,
                border: `1px solid $***REMOVED***isSelected 
                  ? colors.primary 
                  : colors.transparent30***REMOVED***`,
                boxShadow: isSelected 
                  ? `0 2px 4px $***REMOVED***colors.transparent30***REMOVED***` 
                  : 'none'
              ***REMOVED******REMOVED***
              title=***REMOVED***dia.nombre***REMOVED***
            >
              ***REMOVED***dia.label***REMOVED***
            </button>
          );
        ***REMOVED***)***REMOVED***
      </div>
      
      ***REMOVED***/* Mostrar días seleccionados */***REMOVED***
      ***REMOVED***value.length > 0 && (
        <div className="mt-2 text-xs text-gray-600">
          Seleccionados: ***REMOVED***value.length***REMOVED***/***REMOVED***diasSemana.length***REMOVED***
        </div>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default FiltroDiasSemana;