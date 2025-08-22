// src/components/stats/WorkBreakdown/index.jsx - REFACTORIZADO

import React from 'react';
import { BarChart2 } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';

const WorkBreakdown = ({ gananciaPorTrabajo = [], totalGanado = 0 }) => {
  const colors = useThemeColors();

  // Verificar datos
  const trabajosValidos = Array.isArray(gananciaPorTrabajo) ? gananciaPorTrabajo : [];
  const totalSeguro = typeof totalGanado === 'number' && !isNaN(totalGanado) ? totalGanado : 0;

  if (trabajosValidos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center mb-4">
          <BarChart2 size={18} style={{ color: colors.primary }} className="mr-2" />
          <h3 className="font-semibold">Por trabajo</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <BarChart2 size={48} className="mx-auto mb-3 opacity-30" />
          <p>No hay datos de trabajos</p>
        </div>
      </div>
    );
  }

  // Componente para barra de progreso de trabajo
  const BarraTrabajo = ({ trabajo, maximo }) => {
    const trabajoSeguro = {
      nombre: (trabajo && typeof trabajo.nombre === 'string') ? trabajo.nombre : 'Sin nombre',
      ganancia: (trabajo && typeof trabajo.ganancia === 'number') ? trabajo.ganancia : 0,
      turnos: (trabajo && typeof trabajo.turnos === 'number') ? trabajo.turnos : 0,
      horas: (trabajo && typeof trabajo.horas === 'number') ? trabajo.horas : 0,
      color: (trabajo && typeof trabajo.color === 'string') ? trabajo.color : colors.primary
    };

    const porcentaje = maximo > 0 ? (trabajoSeguro.ganancia / maximo) * 100 : 0;

    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{trabajoSeguro.nombre}</span>
          <div className="text-right">
            <span className="text-sm font-bold" style={{ color: trabajoSeguro.color }}>
              {formatCurrency(trabajoSeguro.ganancia)}
            </span>
            <p className="text-xs text-gray-500">
              {trabajoSeguro.turnos} turnos · {trabajoSeguro.horas.toFixed(1)}h
            </p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${Math.min(porcentaje, 100)}%`,
              backgroundColor: trabajoSeguro.color
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center mb-4">
        <BarChart2 size={18} style={{ color: colors.primary }} className="mr-2" />
        <h3 className="font-semibold">Por trabajo</h3>
      </div>

      <div className="space-y-3">
        {trabajosValidos.map((trabajo, index) => (
          <BarraTrabajo
            key={trabajo?.id || index}
            trabajo={trabajo}
            maximo={totalSeguro}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkBreakdown;