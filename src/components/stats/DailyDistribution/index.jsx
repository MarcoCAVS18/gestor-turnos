// src/components/stats/DailyDistribution/index.jsx
import React from 'react';
import { Calendar, Clock, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../../utils/currency';
import { formatHoursDecimal } from '../../../utils/time';
import BaseStatsCard from '../../cards/base/BaseStatsCard';
import Flex from '../../ui/Flex';

const DailyDistribution = ({ datosActuales, loading, thematicColors }) => {
  const { gananciaPorDia, totalGanado } = datosActuales;

  const isEmpty = !totalGanado || totalGanado === 0;

  return (
    <BaseStatsCard
      icon={Calendar}
      title="Distribución Semanal"
      loading={loading}
      empty={isEmpty}
      emptyMessage="No hay datos de ganancias esta semana."
    >
      <div className="w-full">
        {/* Wrapper para habilitar scroll horizontal en móvil */}
        <div className="lg:overflow-x-hidden overflow-x-auto">
          <div className="space-y-2 lg:w-full min-w-[30rem]">
            {Object.entries(gananciaPorDia).map(([dia, datos]) => (
              <div key={dia} className="p-2 bg-gray-50 rounded-lg">
                {/* Usar grid para un mejor control de las columnas */}
                <div className="grid grid-cols-4 gap-x-2 items-center">
                  <span className="text-sm font-medium text-gray-700 col-span-1 truncate">{dia}</span>
                  
                  <Flex variant="end" className="col-span-1">
                    <DollarSign size={14} className="mr-1 flex-shrink-0" style={{ color: thematicColors?.primary }} />
                    <span className="text-sm font-bold text-right" style={{ color: thematicColors?.primary }}>
                      {formatCurrency(datos.ganancia)}
                    </span>
                  </Flex>

                  <Flex variant="end" className="col-span-1">
                    <Clock size={14} className="mr-1 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600 text-right whitespace-nowrap">
                      {formatHoursDecimal(datos.horas)}
                    </span>
                  </Flex>

                  <div className="text-sm text-gray-500 text-right col-span-1 whitespace-nowrap">
                    {datos.turnos} turno{datos.turnos !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseStatsCard>
  );
};

export default DailyDistribution;