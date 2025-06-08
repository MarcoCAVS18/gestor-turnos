// src/pages/Estadisticas.jsx

import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useWeeklyStats } from '../hooks/useWeeklyStats';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import WeekNavigator from '../components/stats/WeekNavigator';
import StatsProgressBar from '../components/stats/StatsProgressBar';
import WeeklyStatsGrid from '../components/stats/WeeklyStatsGrid';
import WeeklyComparison from '../components/stats/WeeklyComparison';
import DailyDistribution from '../components/stats/DailyDistribution';
import ShiftTypeStats from '../components/stats/ShiftTypeStats';

const Estadisticas = () => {
  const { turnos, trabajos, cargando, metaHorasSemanales } = useApp();
  const [offsetSemana, setOffsetSemana] = useState(0);
  
  // Obtener datos de la semana actual y anterior
  const datosActuales = useWeeklyStats(turnos, trabajos, offsetSemana);
  const datosAnteriores = useWeeklyStats(turnos, trabajos, offsetSemana - 1);

  return (
    <LoadingWrapper loading={cargando}>
      <div className="px-4 py-6 space-y-6">

        {/* Navegador de semana */}
        <WeekNavigator 
          offsetSemana={offsetSemana}
          onSemanaChange={setOffsetSemana}
          fechaInicio={datosActuales.fechaInicio}
          fechaFin={datosActuales.fechaFin}
        />

        {/* Barra de progreso semanal */}
        {metaHorasSemanales && (
          <StatsProgressBar 
            horasSemanales={datosActuales.horasTrabajadas}
            metaHoras={metaHorasSemanales}
            gananciaTotal={datosActuales.totalGanado}
          />
        )}

        {/* Grid de estadísticas principales */}
        <WeeklyStatsGrid 
          datos={datosActuales}
        />

        {/* Comparación con semana anterior */}
        <WeeklyComparison 
          datosActuales={datosActuales}
          datosAnteriores={datosAnteriores}
        />

        {/* Distribución diaria */}
        <DailyDistribution 
          gananciaPorDia={datosActuales.gananciaPorDia}
        />

        {/* Estadísticas por tipo de turno */}
        {datosActuales.tiposDeTurno && Object.keys(datosActuales.tiposDeTurno).length > 0 && (
          <ShiftTypeStats 
            tiposDeTurno={datosActuales.tiposDeTurno}
          />
        )}
      </div>
    </LoadingWrapper>
  );
};

export default Estadisticas;