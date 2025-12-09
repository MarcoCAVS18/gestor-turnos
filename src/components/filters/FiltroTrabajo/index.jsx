// src/components/filters/FiltroTrabajo/index.jsx

import React from 'react';
import { Briefcase, Truck } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';

const FiltroTrabajo = ({ value, onChange }) => {
  const { trabajos, trabajosDelivery } = useApp();
  const colors = useThemeColors();
  
  // Combinar todos los trabajos
  const todosLosTrabajos = [
    ...trabajos.map(t => ({ ...t, tipo: t.tipo || 'tradicional' })),
    ...trabajosDelivery.map(t => ({ ...t, tipo: 'delivery' }))
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Filtrar por trabajo
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {value !== 'todos' ? (
            (() => {
              const trabajoSeleccionado = todosLosTrabajos.find(t => t.id === value);
              return trabajoSeleccionado?.tipo === 'delivery' ? (
                <Truck size={16} className="text-green-600" />
              ) : (
                <Briefcase size={16} style={{ color: colors.primary }} />
              );
            })()
          ) : (
            <Briefcase size={16} className="text-gray-400" />
          )}
        </div>

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full py-2 pr-8 border border-gray-300 rounded-lg 
            bg-white text-sm focus:outline-none focus:ring-2 focus:border-transparent 
            transition-colors
            pl-10 /* ESTO REEMPLAZA AL STYLE JSX */
          `}
          style={{ '--tw-ring-color': colors.primary }}
        >
          <option value="todos">Todos los trabajos</option>
          {todosLosTrabajos.map(trabajo => (
            <option key={trabajo.id} value={trabajo.id}>
              {trabajo.nombre}
              {trabajo.tipo === 'delivery' ? ' (Delivery)' : ''}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FiltroTrabajo;