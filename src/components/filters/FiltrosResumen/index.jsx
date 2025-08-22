// src/components/filters/FiltrosResumen/index.jsx - REFACTORIZADO

import React from 'react';
import ***REMOVED*** X ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';

const FiltrosResumen = (***REMOVED*** filters, onRemoveFilter, onClearAll, estadisticas ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** trabajos, trabajosDelivery ***REMOVED*** = useApp();
  const colors = useThemeColors();
  
  // Combinar trabajos para obtener nombres
  const todosLosTrabajos = [...trabajos, ...trabajosDelivery];
  
  // Verificar si hay filtros activos
  const hasActiveFilters = filters.trabajo !== 'todos' || 
                          filters.diasSemana.length > 0 || 
                          filters.tipoTurno !== 'todos';
  
  if (!hasActiveFilters) return null;

  // Obtener nombre del trabajo
  const getNombreTrabajo = (id) => ***REMOVED***
    const trabajo = todosLosTrabajos.find(t => t.id === id);
    return trabajo?.nombre || 'Trabajo desconocido';
  ***REMOVED***;

  // Mapear días de la semana
  const diasSemanaLabels = ***REMOVED***
    lunes: 'Lunes',
    martes: 'Martes',
    miercoles: 'Miércoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sabado: 'Sábado',
    domingo: 'Domingo'
  ***REMOVED***;

  // Mapear tipos de turno
  const tiposTurnoLabels = ***REMOVED***
    diurno: 'Diurno',
    tarde: 'Tarde',
    noche: 'Noche',
    sabado: 'Sábado',
    domingo: 'Domingo',
    delivery: 'Delivery'
  ***REMOVED***;

  return (
    <div 
      className="p-4 rounded-lg border-l-4 space-y-3"
      style=***REMOVED******REMOVED*** 
        backgroundColor: colors.transparent5,
        borderLeftColor: colors.primary 
      ***REMOVED******REMOVED***
    >
      ***REMOVED***/* Estadísticas */***REMOVED***
      <div className="flex items-center justify-between text-sm">
        <span style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="font-medium">
          Filtros activos: ***REMOVED***estadisticas?.turnosFiltrados || 0***REMOVED*** de ***REMOVED***estadisticas?.totalTurnos || 0***REMOVED*** turnos
        </span>
        <button
          onClick=***REMOVED***onClearAll***REMOVED***
          className="flex items-center space-x-1 px-2 py-1 text-xs rounded-md hover:bg-gray-100 transition-colors"
          style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
        >
          <X size=***REMOVED***12***REMOVED*** />
          <span>Limpiar todo</span>
        </button>
      </div>

      ***REMOVED***/* Tags de filtros activos */***REMOVED***
      <div className="flex flex-wrap gap-2">
        ***REMOVED***filters.trabajo !== 'todos' && (
          <div 
            className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm"
            style=***REMOVED******REMOVED*** 
              backgroundColor: colors.transparent20,
              color: colors.primary 
            ***REMOVED******REMOVED***
          >
            <span>Trabajo: ***REMOVED***getNombreTrabajo(filters.trabajo)***REMOVED***</span>
            <button 
              onClick=***REMOVED***() => onRemoveFilter('trabajo')***REMOVED***
              className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
            >
              <X size=***REMOVED***14***REMOVED*** />
            </button>
          </div>
        )***REMOVED***
        
        ***REMOVED***filters.diasSemana.length > 0 && (
          <div 
            className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm"
            style=***REMOVED******REMOVED*** 
              backgroundColor: colors.transparent20,
              color: colors.primary 
            ***REMOVED******REMOVED***
          >
            <span>
              Días: ***REMOVED***filters.diasSemana.length === 7 
                ? 'Todos' 
                : filters.diasSemana.map(dia => diasSemanaLabels[dia]).join(', ')
              ***REMOVED***
            </span>
            <button 
              onClick=***REMOVED***() => onRemoveFilter('diasSemana')***REMOVED***
              className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
            >
              <X size=***REMOVED***14***REMOVED*** />
            </button>
          </div>
        )***REMOVED***
        
        ***REMOVED***filters.tipoTurno !== 'todos' && (
          <div 
            className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm"
            style=***REMOVED******REMOVED*** 
              backgroundColor: colors.transparent20,
              color: colors.primary 
            ***REMOVED******REMOVED***
          >
            <span>Tipo: ***REMOVED***tiposTurnoLabels[filters.tipoTurno] || filters.tipoTurno***REMOVED***</span>
            <button 
              onClick=***REMOVED***() => onRemoveFilter('tipoTurno')***REMOVED***
              className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
            >
              <X size=***REMOVED***14***REMOVED*** />
            </button>
          </div>
        )***REMOVED***
      </div>
    </div>
  );
***REMOVED***;

export default FiltrosResumen;