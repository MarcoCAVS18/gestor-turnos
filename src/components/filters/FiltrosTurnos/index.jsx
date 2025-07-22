// src/components/filters/FiltrosTurnos/index.jsx

import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import FiltroTrabajo from '../FiltroTrabajo';
import FiltroDiasSemana from '../FiltroDiasSemana';
import FiltroTipoTurno from '../FiltroTipoTurno';

const FiltrosTurnos = ({ onFiltersChange, activeFilters = {} }) => {
  const { thematicColors } = useApp();
  const [showFilters, setShowFilters] = useState(false);
  
  // Verificar si hay filtros activos
  const hasActiveFilters = Object.values(activeFilters).some(filter => {
    if (Array.isArray(filter)) {
      return filter.length > 0;
    }
    return filter && filter !== 'todos';
  });
  
  // Manejar cambios en los filtros
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...activeFilters, [filterType]: value };
    onFiltersChange(newFilters);
  };
  
  // Limpiar todos los filtros
  const clearAllFilters = () => {
    const clearedFilters = {
      trabajo: 'todos',
      diasSemana: [],
      tipoTurno: 'todos'
    };
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="mb-6">
      {/* Botón para mostrar/ocultar filtros */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors"
          style={{
            backgroundColor: showFilters ? thematicColors?.transparent10 : 'white',
            borderColor: showFilters ? thematicColors?.base : '#E5E7EB',
            color: showFilters ? thematicColors?.base : '#6B7280'
          }}
        >
          <Filter size={18} />
          <span className="font-medium">Filtros</span>
          {hasActiveFilters && (
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: thematicColors?.base }}
            />
          )}
        </button>
        
        {/* Botón de limpiar filtros */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={14} />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {/* Panel de filtros */}
      {showFilters && (
        <div 
          className="rounded-lg border p-4 space-y-4 transition-all"
          style={{ 
            backgroundColor: thematicColors?.transparent5,
            borderColor: thematicColors?.transparent20 
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por trabajo */}
            <FiltroTrabajo
              value={activeFilters.trabajo || 'todos'}
              onChange={(value) => handleFilterChange('trabajo', value)}
            />
            
            {/* Filtro por días de la semana */}
            <FiltroDiasSemana
              value={activeFilters.diasSemana || []}
              onChange={(value) => handleFilterChange('diasSemana', value)}
            />
            
            {/* Filtro por tipo de turno */}
            <FiltroTipoTurno
              value={activeFilters.tipoTurno || 'todos'}
              onChange={(value) => handleFilterChange('tipoTurno', value)}
            />
          </div>
          
          {/* Resumen de filtros activos */}
          {hasActiveFilters && (
            <div className="pt-3 border-t" style={{ borderColor: thematicColors?.transparent20 }}>
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Filtros activos:</span>
                {activeFilters.trabajo && activeFilters.trabajo !== 'todos' && (
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: thematicColors?.transparent20,
                      color: thematicColors?.base 
                    }}
                  >
                    Trabajo específico
                  </span>
                )}
                {activeFilters.diasSemana && activeFilters.diasSemana.length > 0 && (
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: thematicColors?.transparent20,
                      color: thematicColors?.base 
                    }}
                  >
                    {activeFilters.diasSemana.length} días
                  </span>
                )}
                {activeFilters.tipoTurno && activeFilters.tipoTurno !== 'todos' && (
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: thematicColors?.transparent20,
                      color: thematicColors?.base 
                    }}
                  >
                    Tipo: {activeFilters.tipoTurno}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FiltrosTurnos;