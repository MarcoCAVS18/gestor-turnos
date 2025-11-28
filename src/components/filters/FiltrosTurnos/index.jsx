// src/components/filters/FiltrosTurnos/index.jsx - REFACTORIZADO

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** Filter, X ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import Badge from '../../ui/Badge';
import FiltroTrabajo from '../FiltroTrabajo';
import FiltroDiasSemana from '../FiltroDiasSemana';
import FiltroTipoTurno from '../FiltroTipoTurno';

const FiltrosTurnos = (***REMOVED*** onFiltersChange, activeFilters = ***REMOVED******REMOVED*** ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const [showFilters, setShowFilters] = useState(false);
  
  // Verificar si hay filtros activos
  const hasActiveFilters = Object.values(activeFilters).some(filter => ***REMOVED***
    if (Array.isArray(filter)) ***REMOVED***
      return filter.length > 0;
    ***REMOVED***
    return filter && filter !== 'todos';
  ***REMOVED***);
  
  // Manejar cambios en los filtros
  const handleFilterChange = (filterType, value) => ***REMOVED***
    const newFilters = ***REMOVED*** ...activeFilters, [filterType]: value ***REMOVED***;
    onFiltersChange(newFilters);
  ***REMOVED***;
  
  // Limpiar todos los filtros
  const clearAllFilters = () => ***REMOVED***
    const clearedFilters = ***REMOVED***
      trabajo: 'todos',
      diasSemana: [],
      tipoTurno: 'todos'
    ***REMOVED***;
    onFiltersChange(clearedFilters);
  ***REMOVED***;

  return (
    <div className="mb-6">
      ***REMOVED***/* Botón para mostrar/ocultar filtros */***REMOVED***
      <div className="flex items-center justify-between mb-4">
        <button
          onClick=***REMOVED***() => setShowFilters(!showFilters)***REMOVED***
          className="flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors"
          style=***REMOVED******REMOVED***
            backgroundColor: showFilters ? colors.transparent10 : 'white',
            borderColor: showFilters ? colors.primary : '#E5E7EB',
            color: showFilters ? colors.primary : '#6B7280'
          ***REMOVED******REMOVED***
        >
          <Filter size=***REMOVED***18***REMOVED*** />
          <span className="font-medium">Filtros</span>
          ***REMOVED***hasActiveFilters && (
            <div 
              className="w-2 h-2 rounded-full"
              style=***REMOVED******REMOVED*** backgroundColor: colors.primary ***REMOVED******REMOVED***
            />
          )***REMOVED***
        </button>
        
        ***REMOVED***/* Botón de limpiar filtros */***REMOVED***
        ***REMOVED***hasActiveFilters && (
          <button
            onClick=***REMOVED***clearAllFilters***REMOVED***
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size=***REMOVED***14***REMOVED*** />
            <span>Limpiar</span>
          </button>
        )***REMOVED***
      </div>

      ***REMOVED***/* Panel de filtros */***REMOVED***
      ***REMOVED***showFilters && (
        <div 
          className="rounded-lg border p-4 space-y-4 transition-all"
          style=***REMOVED******REMOVED*** 
            backgroundColor: colors.transparent5,
            borderColor: colors.transparent20 
          ***REMOVED******REMOVED***
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            ***REMOVED***/* Filtro por trabajo */***REMOVED***
            <FiltroTrabajo
              value=***REMOVED***activeFilters.trabajo || 'todos'***REMOVED***
              onChange=***REMOVED***(value) => handleFilterChange('trabajo', value)***REMOVED***
            />
            
            ***REMOVED***/* Filtro por días de la semana */***REMOVED***
            <FiltroDiasSemana
              value=***REMOVED***activeFilters.diasSemana || []***REMOVED***
              onChange=***REMOVED***(value) => handleFilterChange('diasSemana', value)***REMOVED***
            />
            
            ***REMOVED***/* Filtro por tipo de turno */***REMOVED***
            <FiltroTipoTurno
              value=***REMOVED***activeFilters.tipoTurno || 'todos'***REMOVED***
              onChange=***REMOVED***(value) => handleFilterChange('tipoTurno', value)***REMOVED***
            />
          </div>
          
          ***REMOVED***/* Resumen de filtros activos */***REMOVED***
          ***REMOVED***hasActiveFilters && (
            <div className="pt-3 border-t" style=***REMOVED******REMOVED*** borderColor: colors.transparent20 ***REMOVED******REMOVED***>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600">Filtros activos:</span>
                ***REMOVED***activeFilters.trabajo && activeFilters.trabajo !== 'todos' && (
                  <Badge variant="info" size="xs" rounded>
                    Trabajo específico
                  </Badge>
                )***REMOVED***
                ***REMOVED***activeFilters.diasSemana && activeFilters.diasSemana.length > 0 && (
                  <Badge variant="info" size="xs" rounded>
                    ***REMOVED***activeFilters.diasSemana.length***REMOVED*** días
                  </Badge>
                )***REMOVED***
                ***REMOVED***activeFilters.tipoTurno && activeFilters.tipoTurno !== 'todos' && (
                  <Badge variant="info" size="xs" rounded>
                    Tipo: ***REMOVED***activeFilters.tipoTurno***REMOVED***
                  </Badge>
                )***REMOVED***
              </div>
            </div>
          )***REMOVED***
        </div>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default FiltrosTurnos;