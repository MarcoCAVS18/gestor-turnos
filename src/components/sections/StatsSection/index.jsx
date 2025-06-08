// src/components/sections/StatsSection/index.jsx

import React from 'react';
import WeekNavigator from '../../stats/WeekNavigator';
import StatsProgressBar from '../../stats/StatsProgressBar';
import WeeklyStatsGrid from '../../stats/WeeklyStatsGrid';
import WorkDistributionChart from '../../stats/WorkDistributionChart';
import DailyBreakdownCard from '../../stats/DailyBreakdownCard';

const StatsSection = ({ weekStatsData = {}, trabajos = [] }) => {
  const {
    semanaActual = 0,
    horasSemanales = 0,
    gananciaTotal = 0,
    distribucionTrabajos = [],
    turnosPorDia = {},
    promedioHorasPorDia = 0,
    trabajoMasFrecuente = null
  } = weekStatsData;

  return (
    <div className="space-y-6">
      <WeekNavigator semanaActual={semanaActual} />
      
      {/* Barra de progreso */}
      <StatsProgressBar 
        horasSemanales={horasSemanales}
        metaHoras={40}
        gananciaTotal={gananciaTotal}
      />
      
      {/* Grid de estadísticas semanales */}
      <WeeklyStatsGrid 
        horasSemanales={horasSemanales}
        gananciaTotal={gananciaTotal}
        promedioHorasPorDia={promedioHorasPorDia}
        trabajoMasFrecuente={trabajoMasFrecuente}
      />
      
      {/* Gráfico de distribución */}
      <WorkDistributionChart 
        distribucionTrabajos={distribucionTrabajos}
      />
      
      {/* Desglose diario */}
      <DailyBreakdownCard 
        turnosPorDia={turnosPorDia}
        trabajos={trabajos}
      />
    </div>
  );
};

export default StatsSection;