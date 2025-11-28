import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';
import BaseStatsCard from '../../cards/base/BaseStatsCard'; // Import BaseStatsCard

const MonthlyProjection = ({ totalGanado = 0, horasTrabajadas = 0 }) => {
  const colors = useThemeColors();

  // Verificar que los datos sean válidos
  const totalSeguro = typeof totalGanado === 'number' && !isNaN(totalGanado) ? totalGanado : 0;
  const horasSeguras = typeof horasTrabajadas === 'number' && !isNaN(horasTrabajadas) ? horasTrabajadas : 0;

  const gananciaProyectada = totalSeguro * 4.33;
  const horasProyectadas = horasSeguras * 4.33;

  const isEmpty = totalSeguro === 0 && horasSeguras === 0;

  return (
    <BaseStatsCard
      icon={TrendingUp}
      title="Proyección mensual"
      empty={isEmpty}
      emptyMessage="No hay datos de actividad reciente"
      emptyDescription="Registra turnos para ver tu proyección mensual"
    >
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          Si mantienes este ritmo durante todo el mes
        </p>
        <p
          className="text-3xl font-bold"
          style={{ color: colors.primary }}
        >
          {formatCurrency(gananciaProyectada)}
        </p>
        <p className="text-sm text-gray-500">
          ~{horasProyectadas.toFixed(0)} horas
        </p>
      </div>
    </BaseStatsCard>
  );
};

export default MonthlyProjection;