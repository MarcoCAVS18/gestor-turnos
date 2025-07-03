// src/pages/Estadisticas.jsx

import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useWeeklyStats } from '../hooks/useWeeklyStats';
import { useDeliveryStats } from '../hooks/useDeliveryStats';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import WeekNavigator from '../components/stats/WeekNavigator';
import StatsProgressBar from '../components/stats/StatsProgressBar';
import WeeklyStatsGrid from '../components/stats/WeeklyStatsGrid';
import WeeklyComparison from '../components/stats/WeeklyComparison';
import DailyDistribution from '../components/stats/DailyDistribution';
import ShiftTypeStats from '../components/stats/ShiftTypeStats';

// Componentes de delivery
import ResumenDelivery from '../components/stats/ResumenDelivery';
import EficienciaVehiculos from '../components/stats/EficienciaVehiculos';
import ComparacionPlataformas from '../components/stats/ComparacionPlataformas';
import SeguimientoCombustible from '../components/stats/SeguimientoCombustible';

const Estadisticas = () => {
  const { cargando, metaHorasSemanales, deliveryEnabled } = useApp();
  const [offsetSemana, setOffsetSemana] = useState(0);
  
  // Usar el hook corregido sin pasar parámetros innecesarios
  const datosActuales = useWeeklyStats(offsetSemana);
  const datosAnteriores = useWeeklyStats(offsetSemana - 1);
  
  // Obtener estadísticas de delivery si está habilitado
  const deliveryStats = useDeliveryStats('mes');
  const tieneDelivery = deliveryEnabled && deliveryStats.totalPedidos > 0;

  console.log('📊 Estado de estadísticas:', {
    cargando,
    deliveryEnabled,
    tieneDelivery,
    datosActuales: {
      totalGanado: datosActuales.totalGanado,
      totalTurnos: datosActuales.totalTurnos,
      horasTrabajadas: datosActuales.horasTrabajadas
    },
    deliveryStats: {
      totalPedidos: deliveryStats.totalPedidos,
      totalGanado: deliveryStats.totalGanado
    }
  });

  return (
    <LoadingWrapper loading={cargando}>
      <div className="px-4 py-6 space-y-6">

        <WeekNavigator 
          offsetSemana={offsetSemana}
          onSemanaChange={setOffsetSemana}
          fechaInicio={datosActuales.fechaInicio}
          fechaFin={datosActuales.fechaFin}
        />

        {metaHorasSemanales && (
          <StatsProgressBar 
            horasSemanales={datosActuales.horasTrabajadas}
            metaHoras={metaHorasSemanales}
            gananciaTotal={datosActuales.totalGanado}
          />
        )}

        <WeeklyStatsGrid 
          datos={datosActuales}
        />

        <WeeklyComparison 
          datosActuales={datosActuales}
          datosAnteriores={datosAnteriores}
        />

        <DailyDistribution 
          gananciaPorDia={datosActuales.gananciaPorDia}
        />

        {datosActuales.tiposDeTurno && Object.keys(datosActuales.tiposDeTurno).length > 0 && (
          <ShiftTypeStats 
            tiposDeTurno={datosActuales.tiposDeTurno}
          />
        )}

        {/* Sección de estadísticas de delivery - solo visible si está habilitado */}
        {tieneDelivery && (
          <>
            <div className="pt-4">
              <h2 className="text-xl font-semibold mb-4 text-center">
                📦 Estadísticas de Delivery
              </h2>
            </div>
            
            <ResumenDelivery deliveryStats={deliveryStats} />
            
            {/* Tarjetas horizontales una debajo de la otra */}
            <div className="space-y-6">
              <EficienciaVehiculos deliveryStats={deliveryStats} />
              <SeguimientoCombustible deliveryStats={deliveryStats} />
            </div>
            
            <ComparacionPlataformas deliveryStats={deliveryStats} />
          </>
        )}

        {/* Debug info para desarrollo */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs">
            <h3 className="font-bold mb-2">🔧 Debug Info:</h3>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify({
                deliveryEnabled,
                tieneDelivery,
                totalTurnosActuales: datosActuales.totalTurnos,
                totalGanadoActual: datosActuales.totalGanado,
                deliveryPedidos: deliveryStats.totalPedidos,
                deliveryGanado: deliveryStats.totalGanado
              }, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </LoadingWrapper>
  );
};

export default Estadisticas;