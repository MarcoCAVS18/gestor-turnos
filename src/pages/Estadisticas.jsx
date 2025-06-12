// src/pages/Estadisticas.jsx - Versión con debug de imports

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** useWeeklyStats ***REMOVED*** from '../hooks/useWeeklyStats';
import ***REMOVED*** useDeliveryStats ***REMOVED*** from '../hooks/useDeliveryStats';
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

// Debug: Verificar que todos los componentes se importaron correctamente
console.log('Componentes importados:', ***REMOVED***
  ResumenDelivery,
  EficienciaVehiculos,
  ComparacionPlataformas,
  SeguimientoCombustible
***REMOVED***);

const Estadisticas = () => ***REMOVED***
  const ***REMOVED*** turnos, trabajos, cargando, metaHorasSemanales, deliveryEnabled ***REMOVED*** = useApp();
  const [offsetSemana, setOffsetSemana] = useState(0);
  
  const datosActuales = useWeeklyStats(turnos, trabajos, offsetSemana);
  const datosAnteriores = useWeeklyStats(turnos, trabajos, offsetSemana - 1);
  
  // Obtener estadísticas de delivery si está habilitado
  const deliveryStats = useDeliveryStats('mes');
  const tieneDelivery = deliveryEnabled && deliveryStats.totalPedidos > 0;

  return (
    <LoadingWrapper loading=***REMOVED***cargando***REMOVED***>
      <div className="px-4 py-6 space-y-6">

        <WeekNavigator 
          offsetSemana=***REMOVED***offsetSemana***REMOVED***
          onSemanaChange=***REMOVED***setOffsetSemana***REMOVED***
          fechaInicio=***REMOVED***datosActuales.fechaInicio***REMOVED***
          fechaFin=***REMOVED***datosActuales.fechaFin***REMOVED***
        />

        ***REMOVED***metaHorasSemanales && (
          <StatsProgressBar 
            horasSemanales=***REMOVED***datosActuales.horasTrabajadas***REMOVED***
            metaHoras=***REMOVED***metaHorasSemanales***REMOVED***
            gananciaTotal=***REMOVED***datosActuales.totalGanado***REMOVED***
          />
        )***REMOVED***

        <WeeklyStatsGrid 
          datos=***REMOVED***datosActuales***REMOVED***
        />

        <WeeklyComparison 
          datosActuales=***REMOVED***datosActuales***REMOVED***
          datosAnteriores=***REMOVED***datosAnteriores***REMOVED***
        />

        <DailyDistribution 
          gananciaPorDia=***REMOVED***datosActuales.gananciaPorDia***REMOVED***
        />

        ***REMOVED***datosActuales.tiposDeTurno && Object.keys(datosActuales.tiposDeTurno).length > 0 && (
          <ShiftTypeStats 
            tiposDeTurno=***REMOVED***datosActuales.tiposDeTurno***REMOVED***
          />
        )***REMOVED***

        ***REMOVED***/* Sección de estadísticas de delivery - solo visible si está habilitado */***REMOVED***
        ***REMOVED***tieneDelivery && (
          <>
            ***REMOVED***ResumenDelivery && <ResumenDelivery deliveryStats=***REMOVED***deliveryStats***REMOVED*** />***REMOVED***
            
            ***REMOVED***/* Tarjetas horizontales una debajo de la otra */***REMOVED***
            <div className="space-y-6">
              ***REMOVED***EficienciaVehiculos && <EficienciaVehiculos deliveryStats=***REMOVED***deliveryStats***REMOVED*** />***REMOVED***
              ***REMOVED***SeguimientoCombustible && <SeguimientoCombustible deliveryStats=***REMOVED***deliveryStats***REMOVED*** />***REMOVED***
            </div>
            
            ***REMOVED***ComparacionPlataformas && <ComparacionPlataformas deliveryStats=***REMOVED***deliveryStats***REMOVED*** />***REMOVED***
          </>
        )***REMOVED***
      </div>
    </LoadingWrapper>
  );
***REMOVED***;

export default Estadisticas;