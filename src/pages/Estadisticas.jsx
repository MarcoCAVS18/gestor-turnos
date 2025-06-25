// src/pages/Estadisticas.jsx - Versión con debug de imports

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

// Componentes de delivery - verificando imports uno por uno
import ResumenDelivery from '../components/stats/ResumenDelivery';
import EficienciaVehiculos from '../components/stats/EficienciaVehiculos';
import ComparacionPlataformas from '../components/stats/ComparacionPlataformas';
import SeguimientoCombustible from '../components/stats/SeguimientoCombustible';


const Estadisticas = () => {
  const { turnos, trabajos, cargando, metaHorasSemanales, deliveryEnabled } = useApp();
  const [offsetSemana, setOffsetSemana] = useState(0);
  
  const datosActuales = useWeeklyStats(turnos, trabajos, offsetSemana);
  const datosAnteriores = useWeeklyStats(turnos, trabajos, offsetSemana - 1);
  
  // Obtener estadísticas de delivery si está habilitado
  const deliveryStats = useDeliveryStats('mes');
  const tieneDelivery = deliveryEnabled && deliveryStats.totalPedidos > 0;

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
            {ResumenDelivery && <ResumenDelivery deliveryStats={deliveryStats} />}
            
            {/* Tarjetas horizontales una debajo de la otra */}
            <div className="space-y-6">
              {EficienciaVehiculos && <EficienciaVehiculos deliveryStats={deliveryStats} />}
              {SeguimientoCombustible && <SeguimientoCombustible deliveryStats={deliveryStats} />}
            </div>
            
            {ComparacionPlataformas && <ComparacionPlataformas deliveryStats={deliveryStats} />}
          </>
        )}
      </div>
    </LoadingWrapper>
  );
};

export default Estadisticas;