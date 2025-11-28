import React from 'react';
import ***REMOVED*** TrendingUp ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import BaseStatsCard from '../../cards/base/BaseStatsCard'; // Import BaseStatsCard

const MonthlyProjection = (***REMOVED*** totalGanado = 0, horasTrabajadas = 0 ***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();

  // Verificar que los datos sean válidos
  const totalSeguro = typeof totalGanado === 'number' && !isNaN(totalGanado) ? totalGanado : 0;
  const horasSeguras = typeof horasTrabajadas === 'number' && !isNaN(horasTrabajadas) ? horasTrabajadas : 0;

  const gananciaProyectada = totalSeguro * 4.33;
  const horasProyectadas = horasSeguras * 4.33;

  const isEmpty = totalSeguro === 0 && horasSeguras === 0;

  return (
    <BaseStatsCard
      icon=***REMOVED***TrendingUp***REMOVED***
      title="Proyección mensual"
      empty=***REMOVED***isEmpty***REMOVED***
      emptyMessage="No hay datos de actividad reciente"
      emptyDescription="Registra turnos para ver tu proyección mensual"
    >
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          Si mantienes este ritmo durante todo el mes
        </p>
        <p
          className="text-3xl font-bold"
          style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
        >
          ***REMOVED***formatCurrency(gananciaProyectada)***REMOVED***
        </p>
        <p className="text-sm text-gray-500">
          ~***REMOVED***horasProyectadas.toFixed(0)***REMOVED*** horas
        </p>
      </div>
    </BaseStatsCard>
  );
***REMOVED***;

export default MonthlyProjection;