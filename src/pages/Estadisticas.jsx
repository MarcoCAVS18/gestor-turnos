// src/pages/Estadisticas.jsx

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

// Componentes de delivery
import ResumenDelivery from '../components/stats/ResumenDelivery';
import EficienciaVehiculos from '../components/stats/EficienciaVehiculos';
import ComparacionPlataformas from '../components/stats/ComparacionPlataformas';
import SeguimientoCombustible from '../components/stats/SeguimientoCombustible';

const Estadisticas = () => ***REMOVED***
  const ***REMOVED*** cargando, metaHorasSemanales, deliveryEnabled ***REMOVED*** = useApp();
  const [offsetSemana, setOffsetSemana] = useState(0);
  
  // Usar el hook corregido sin pasar parámetros innecesarios
  const datosActuales = useWeeklyStats(offsetSemana);
  const datosAnteriores = useWeeklyStats(offsetSemana - 1);
  
  // Obtener estadísticas de delivery si está habilitado
  const deliveryStats = useDeliveryStats('mes');
  const tieneDelivery = deliveryEnabled && deliveryStats.totalPedidos > 0;

  console.log('📊 Estado de estadísticas:', ***REMOVED***
    cargando,
    deliveryEnabled,
    tieneDelivery,
    datosActuales: ***REMOVED***
      totalGanado: datosActuales.totalGanado,
      totalTurnos: datosActuales.totalTurnos,
      horasTrabajadas: datosActuales.horasTrabajadas
    ***REMOVED***,
    deliveryStats: ***REMOVED***
      totalPedidos: deliveryStats.totalPedidos,
      totalGanado: deliveryStats.totalGanado
    ***REMOVED***
  ***REMOVED***);

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
            <div className="pt-4">
              <h2 className="text-xl font-semibold mb-4 text-center">
                📦 Estadísticas de Delivery
              </h2>
            </div>
            
            <ResumenDelivery deliveryStats=***REMOVED***deliveryStats***REMOVED*** />
            
            ***REMOVED***/* Tarjetas horizontales una debajo de la otra */***REMOVED***
            <div className="space-y-6">
              <EficienciaVehiculos deliveryStats=***REMOVED***deliveryStats***REMOVED*** />
              <SeguimientoCombustible deliveryStats=***REMOVED***deliveryStats***REMOVED*** />
            </div>
            
            <ComparacionPlataformas deliveryStats=***REMOVED***deliveryStats***REMOVED*** />
          </>
        )***REMOVED***

        ***REMOVED***/* Debug info para desarrollo */***REMOVED***
        ***REMOVED***process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs">
            <h3 className="font-bold mb-2">🔧 Debug Info:</h3>
            <pre className="whitespace-pre-wrap">
              ***REMOVED***JSON.stringify(***REMOVED***
                deliveryEnabled,
                tieneDelivery,
                totalTurnosActuales: datosActuales.totalTurnos,
                totalGanadoActual: datosActuales.totalGanado,
                deliveryPedidos: deliveryStats.totalPedidos,
                deliveryGanado: deliveryStats.totalGanado
              ***REMOVED***, null, 2)***REMOVED***
            </pre>
          </div>
        )***REMOVED***
      </div>
    </LoadingWrapper>
  );
***REMOVED***;

export default Estadisticas;