// src/pages/Estadisticas.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** useWeeklyStats ***REMOVED*** from '../hooks/useWeeklyStats';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import WeekNavigator from '../components/stats/WeekNavigator';
import WeeklyStatsGrid from '../components/stats/WeeklyStatsGrid';
import WeeklyComparison from '../components/stats/WeeklyComparison';
import DailyDistribution from '../components/stats/DailyDistribution';
import ShiftTypeStats from '../components/stats/ShiftTypeStats';

const Estadisticas = () => ***REMOVED***
  const ***REMOVED*** turnos, trabajos, cargando ***REMOVED*** = useApp();
  const [offsetSemana, setOffsetSemana] = useState(0);
  
  // Obtener datos de la semana actual y anterior
  const datosActuales = useWeeklyStats(turnos, trabajos, offsetSemana);
  const datosAnteriores = useWeeklyStats(turnos, trabajos, offsetSemana - 1);

  return (
    <LoadingWrapper loading=***REMOVED***cargando***REMOVED***>
      <div className="px-4 py-6 space-y-6">

        ***REMOVED***/* Navegador de semana */***REMOVED***
        <WeekNavigator 
          offsetSemana=***REMOVED***offsetSemana***REMOVED***
          onSemanaChange=***REMOVED***setOffsetSemana***REMOVED***
          fechaInicio=***REMOVED***datosActuales.fechaInicio***REMOVED***
          fechaFin=***REMOVED***datosActuales.fechaFin***REMOVED***
        />

        ***REMOVED***/* Grid de estadísticas principales */***REMOVED***
        <WeeklyStatsGrid 
          datos=***REMOVED***datosActuales***REMOVED***
        />

        ***REMOVED***/* Comparación con semana anterior */***REMOVED***
        <WeeklyComparison 
          datosActuales=***REMOVED***datosActuales***REMOVED***
          datosAnteriores=***REMOVED***datosAnteriores***REMOVED***
        />

        ***REMOVED***/* Distribución diaria */***REMOVED***
        <DailyDistribution 
          gananciaPorDia=***REMOVED***datosActuales.gananciaPorDia***REMOVED***
        />

        ***REMOVED***/* Estadísticas por tipo de turno */***REMOVED***
        ***REMOVED***datosActuales.tiposDeTurno && Object.keys(datosActuales.tiposDeTurno).length > 0 && (
          <ShiftTypeStats 
            tiposDeTurno=***REMOVED***datosActuales.tiposDeTurno***REMOVED***
          />
        )***REMOVED***
      </div>
    </LoadingWrapper>
  );
***REMOVED***;

export default Estadisticas;