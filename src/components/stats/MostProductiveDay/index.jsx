// src/components/stats/MostProductiveDay/index.jsx
import React from 'react';
import { Award } from 'lucide-react';
import { formatCurrency } from '../../../utils/currency';
import { formatHoursDecimal } from '../../../utils/time';
import BaseStatsCard from '../../cards/base/BaseStatsCard';

const MostProductiveDay = ({ datosActuales, loading, thematicColors, className = '' }) => {
  const diaMasProductivo = datosActuales?.diaMasProductivo;
  
  const isEmpty = !diaMasProductivo || diaMasProductivo.dia === 'Ninguno' || !diaMasProductivo.ganancia || diaMasProductivo.ganancia <= 0;

  return (
    <BaseStatsCard
      icon={Award} // Pass the component directly
      title="Día más productivo"
      loading={loading}
      empty={isEmpty}
      emptyMessage="Sin datos suficientes esta semana."
      className={className}
    >
      <div className="w-full">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-lg" style={{ color: thematicColors?.primary }}>
              {diaMasProductivo.dia}
            </p>
            <p className="text-xs text-gray-600">
              {diaMasProductivo.turnos || 0} turnos • {formatHoursDecimal(diaMasProductivo.horas || 0)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(diaMasProductivo.ganancia)}
            </p>
          </div>
        </div>
      </div>
    </BaseStatsCard>
  );
};

export default MostProductiveDay;