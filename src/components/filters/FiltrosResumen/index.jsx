// src/components/filters/FiltrosResumen/index.jsx - REFACTORIZADO

import React from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Flex from '../../ui/Flex';

const FiltrosResumen = ({ filters, onRemoveFilter, onClearAll, estadisticas }) => {
  const { trabajos, trabajosDelivery } = useApp();
  const colors = useThemeColors();
  
  // Combinar trabajos para obtener nombres
  const todosLosTrabajos = [...trabajos, ...trabajosDelivery];
  
  // Verificar si hay filtros activos
  const hasActiveFilters = filters.trabajo !== 'todos' || 
                          filters.diasSemana.length > 0 || 
                          filters.tipoTurno !== 'todos';
  
  if (!hasActiveFilters) return null;

  // Obtener nombre del trabajo
  const getNombreTrabajo = (id) => {
    const trabajo = todosLosTrabajos.find(t => t.id === id);
    return trabajo?.nombre || 'Trabajo desconocido';
  };

  // Mapear días de la semana
  const diasSemanaLabels = {
    lunes: 'Lunes',
    martes: 'Martes',
    miercoles: 'Miércoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sabado: 'Sábado',
    domingo: 'Domingo'
  };

  // Mapear tipos de turno
  const tiposTurnoLabels = {
    diurno: 'Diurno',
    tarde: 'Tarde',
    noche: 'Noche',
    sabado: 'Sábado',
    domingo: 'Domingo',
    delivery: 'Delivery'
  };

  return (
    <div 
      className="p-4 rounded-lg border-l-4 space-y-3"
      style={{ 
        backgroundColor: colors.transparent5,
        borderLeftColor: colors.primary 
      }}
    >
      {/* Estadísticas */}
      <Flex variant="between" className="text-sm">
        <span style={{ color: colors.primary }} className="font-medium">
          Filtros activos: {estadisticas?.turnosFiltrados || 0} de {estadisticas?.totalTurnos || 0} turnos
        </span>
        <button
          onClick={onClearAll}
          className="flex items-center space-x-1 px-2 py-1 text-xs rounded-md hover:bg-gray-100 transition-colors"
          style={{ color: colors.primary }}
        >
          <X size={12} />
          <span>Limpiar todo</span>
        </button>
      </Flex>

      {/* Tags de filtros activos */}
      <div className="flex flex-wrap gap-2">
        {filters.trabajo !== 'todos' && (
          <div 
            className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm"
            style={{ 
              backgroundColor: colors.transparent20,
              color: colors.primary 
            }}
          >
            <span>Trabajo: {getNombreTrabajo(filters.trabajo)}</span>
            <button 
              onClick={() => onRemoveFilter('trabajo')}
              className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
            >
              <X size={14} />
            </button>
          </div>
        )}
        
        {filters.diasSemana.length > 0 && (
          <div 
            className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm"
            style={{ 
              backgroundColor: colors.transparent20,
              color: colors.primary 
            }}
          >
            <span>
              Días: {filters.diasSemana.length === 7 
                ? 'Todos' 
                : filters.diasSemana.map(dia => diasSemanaLabels[dia]).join(', ')
              }
            </span>
            <button 
              onClick={() => onRemoveFilter('diasSemana')}
              className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
            >
              <X size={14} />
            </button>
          </div>
        )}
        
        {filters.tipoTurno !== 'todos' && (
          <Flex variant="center" 
            className="space-x-2 px-3 py-1 rounded-full text-sm"
            style={{ 
              backgroundColor: colors.transparent20,
              color: colors.primary 
            }}
          >
            <span>Tipo: {tiposTurnoLabels[filters.tipoTurno] || filters.tipoTurno}</span>
            <button 
              onClick={() => onRemoveFilter('tipoTurno')}
              className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
            >
              <X size={14} />
            </button>
          </Flex>
        )}
      </div>
    </div>
  );
};

export default FiltrosResumen;