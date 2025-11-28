import React from 'react';
import { Calendar, Clock, DollarSign } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';
import BaseStatsCard from '../../cards/base/BaseStatsCard'; // Import BaseStatsCard
import { calculateShiftHours, calculateShiftEarnings } from '../../../utils/statsCalculations'; // Import from statsCalculations

const DailyBreakdownCard = ({ turnosPorDia = {}, trabajos = [] }) => {
  const colors = useThemeColors();

  // Validar datos
  const datos = turnosPorDia && typeof turnosPorDia === 'object' ? turnosPorDia : {};
  const trabajosValidos = Array.isArray(trabajos) ? trabajos : [];

  const isEmpty = Object.keys(datos).length === 0;

  // Formatear fecha
  const formatearFecha = (fecha) => {
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
    } catch (error) {
      return fecha;
    }
  };

  return (
    <BaseStatsCard
      title="Desglose Diario"
      icon={Calendar}
      empty={isEmpty}
      emptyMessage="No hay turnos registrados esta semana"
      emptyDescription="Los turnos aparecerán aquí una vez que agregues algunos"
    >
      <div className="space-y-3">
        {Object.entries(datos).map(([fecha, turnos]) => {
          const horasTotal = turnos.reduce((total, turno) => total + calculateShiftHours(turno), 0);
          const gananciaTotal = turnos.reduce((total, turno) => total + calculateShiftEarnings(turno, trabajosValidos), 0);

          return (
            <div key={fecha} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: colors.transparent10 }}
                >
                  <Calendar size={16} style={{ color: colors.primary }} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {formatearFecha(fecha)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {turnos.length} turno{turnos.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center text-purple-600">
                  <Clock size={14} className="mr-1" />
                  <span>{horasTotal.toFixed(1)}h</span>
                </div>
                <div className="flex items-center text-green-600">
                  <DollarSign size={14} className="mr-1" />
                  <span>{formatCurrency(gananciaTotal)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </BaseStatsCard>
  );
};

export default DailyBreakdownCard;