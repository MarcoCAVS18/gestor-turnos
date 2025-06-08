// src/components/stats/WeekNavigator/index.jsx 
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';

const WeekNavigator = ({ offsetSemana = 0, onSemanaChange, fechaInicio, fechaFin }) => {
  const { coloresTemáticos } = useApp();

  const cambiarSemana = typeof onSemanaChange === 'function' ? onSemanaChange : () => {};
  const fechaInicioValida = fechaInicio instanceof Date ? fechaInicio : new Date();
  const fechaFinValida = fechaFin instanceof Date ? fechaFin : new Date();

  const obtenerTituloSemana = () => {
    if (offsetSemana === 0) return 'Esta semana';
    if (offsetSemana === -1) return 'Semana pasada';
    if (offsetSemana === 1) return 'Próxima semana';
    if (offsetSemana > 1) return `En ${offsetSemana} semanas`;
    return `Hace ${Math.abs(offsetSemana)} semanas`;
  };

  const formatearFecha = (fecha) => {
    try {
      return fecha.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => cambiarSemana(offsetSemana - 1)}
          className="p-2 rounded-full transition-colors"
          style={{
            backgroundColor: coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)',
            color: coloresTemáticos?.base || '#EC4899'
          }}
        >
          <ChevronLeft size={20} />
        </button>

        <div className="text-center">
          <h2 className="text-xl font-semibold">{obtenerTituloSemana()}</h2>
          <p className="text-sm text-gray-600">
            {formatearFecha(fechaInicioValida)} - {formatearFecha(fechaFinValida)}
          </p>
        </div>

        <button
          onClick={() => cambiarSemana(offsetSemana + 1)}
          className="p-2 rounded-full transition-colors"
          style={{
            backgroundColor: coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)',
            color: coloresTemáticos?.base || '#EC4899'
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default WeekNavigator;