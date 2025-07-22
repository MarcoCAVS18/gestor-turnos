// src/components/filters/FiltroDiasSemana/index.jsx

import React from 'react';
import { useApp } from '../../../contexts/AppContext';

const FiltroDiasSemana = ({ value, onChange }) => {
  const { thematicColors } = useApp();
  
  const diasSemana = [
    { id: 'lunes', label: 'L', nombre: 'Lunes' },
    { id: 'martes', label: 'M', nombre: 'Martes' },
    { id: 'miercoles', label: 'X', nombre: 'Miércoles' },
    { id: 'jueves', label: 'J', nombre: 'Jueves' },
    { id: 'viernes', label: 'V', nombre: 'Viernes' },
    { id: 'sabado', label: 'S', nombre: 'Sábado' },
    { id: 'domingo', label: 'D', nombre: 'Domingo' }
  ];

  const handleDayToggle = (dayId) => {
    const newValue = value.includes(dayId)
      ? value.filter(d => d !== dayId)
      : [...value, dayId];
    onChange(newValue);
  };

  const selectAll = () => {
    onChange(diasSemana.map(d => d.id));
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Días de la semana
        </label>
        <div className="flex space-x-1">
          {value.length < diasSemana.length && (
            <button
              onClick={selectAll}
              className="text-xs px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
              style={{ color: thematicColors?.base }}
            >
              Todos
            </button>
          )}
          {value.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-gray-500 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              Ninguno
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {diasSemana.map(dia => {
          const isSelected = value.includes(dia.id);
          return (
            <button
              key={dia.id}
              onClick={() => handleDayToggle(dia.id)}
              className="w-8 h-8 rounded-lg text-xs font-medium transition-all hover:scale-105 flex items-center justify-center"
              style={{
                backgroundColor: isSelected 
                  ? thematicColors?.base 
                  : 'transparent',
                color: isSelected 
                  ? 'white' 
                  : thematicColors?.base,
                border: `1px solid ${isSelected 
                  ? thematicColors?.base 
                  : thematicColors?.transparent30}`,
                boxShadow: isSelected 
                  ? `0 2px 4px ${thematicColors?.transparent30}` 
                  : 'none'
              }}
              title={dia.nombre}
            >
              {dia.label}
            </button>
          );
        })}
      </div>
      
      {/* Mostrar días seleccionados */}
      {value.length > 0 && (
        <div className="mt-2 text-xs text-gray-600">
          Seleccionados: {value.length}/{diasSemana.length}
        </div>
      )}
    </div>
  );
};

export default FiltroDiasSemana;