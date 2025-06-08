// src/components/sections/StatsSection/index.jsx

import React from 'react';
import WeekNavigator from '../../stats/WeekNavigator';
import StatsProgressBar from '../../stats/StatsProgressBar';
import WeeklyStatsGrid from '../../stats/WeeklyStatsGrid';
import WorkDistributionChart from '../../stats/WorkDistributionChart';
import DailyBreakdownCard from '../../stats/DailyBreakdownCard';

const StatsSection = (***REMOVED*** weekStatsData = ***REMOVED******REMOVED***, trabajos = [] ***REMOVED***) => ***REMOVED***
  const ***REMOVED***
    semanaActual = 0,
    horasSemanales = 0,
    gananciaTotal = 0,
    distribucionTrabajos = [],
    turnosPorDia = ***REMOVED******REMOVED***,
    promedioHorasPorDia = 0,
    trabajoMasFrecuente = null
  ***REMOVED*** = weekStatsData;

  return (
    <div className="space-y-6">
      <WeekNavigator semanaActual=***REMOVED***semanaActual***REMOVED*** />
      
      ***REMOVED***/* Barra de progreso */***REMOVED***
      <StatsProgressBar 
        horasSemanales=***REMOVED***horasSemanales***REMOVED***
        metaHoras=***REMOVED***40***REMOVED***
        gananciaTotal=***REMOVED***gananciaTotal***REMOVED***
      />
      
      ***REMOVED***/* Grid de estadísticas semanales */***REMOVED***
      <WeeklyStatsGrid 
        horasSemanales=***REMOVED***horasSemanales***REMOVED***
        gananciaTotal=***REMOVED***gananciaTotal***REMOVED***
        promedioHorasPorDia=***REMOVED***promedioHorasPorDia***REMOVED***
        trabajoMasFrecuente=***REMOVED***trabajoMasFrecuente***REMOVED***
      />
      
      ***REMOVED***/* Gráfico de distribución */***REMOVED***
      <WorkDistributionChart 
        distribucionTrabajos=***REMOVED***distribucionTrabajos***REMOVED***
      />
      
      ***REMOVED***/* Desglose diario */***REMOVED***
      <DailyBreakdownCard 
        turnosPorDia=***REMOVED***turnosPorDia***REMOVED***
        trabajos=***REMOVED***trabajos***REMOVED***
      />
    </div>
  );
***REMOVED***;

export default StatsSection;