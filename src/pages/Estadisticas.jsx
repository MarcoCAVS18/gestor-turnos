import React, ***REMOVED*** useMemo ***REMOVED*** from 'react'; // <--- Asegúrate de importar useMemo
import PageHeader from '../components/layout/PageHeader';
import ***REMOVED*** Truck, BarChart ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useStats ***REMOVED*** from '../contexts/StatsContext';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import WeekNavigator from '../components/stats/WeekNavigator';
import StatsProgressBar from '../components/stats/StatsProgressBar';
import WeeklyStatsGrid from '../components/stats/WeeklyStatsGrid';
import WeeklyComparison from '../components/stats/WeeklyComparison';
import DailyDistribution from '../components/stats/DailyDistribution';
import ShiftTypeStats from '../components/stats/ShiftTypeStats';
import InteractiveCharts from '../components/stats/InteractiveCharts';
import ***REMOVED*** useIsMobile ***REMOVED*** from '../hooks/useIsMobile';
import MostProductiveDay from '../components/stats/MostProductiveDay';

// Cards de Smoko
import SmokoStatusCard from '../components/stats/SmokoStatusCard';
import SmokoTimeCard from '../components/stats/SmokoTimeCard';

// Componentes de Delivery
import ResumenDelivery from '../components/stats/ResumenDelivery';
import EficienciaVehiculos from '../components/stats/EficienciaVehiculos';
import SeguimientoCombustible from '../components/stats/SeguimientoCombustible';
import ComparacionPlataformas from '../components/stats/ComparacionPlataformas';
import AnalisisHorarioDelivery from '../components/stats/AanalisisHorarioDelivery';

const Estadisticas = () => ***REMOVED***
  const ***REMOVED***
    loading,
    datosActuales,
    datosAnteriores,
    offsetSemana,
    setOffsetSemana,
    deliveryEnabled,
    deliveryStats,
    weeklyHoursGoal,
    thematicColors,
    smokoEnabled,
    smokoMinutes,
    allTurnos,
  ***REMOVED*** = useStats();

  const isMobile = useIsMobile();
  const tieneDelivery = deliveryEnabled && deliveryStats.turnosRealizados > 0;

  // --- SOLUCIÓN: Filtrar los turnos reales de la semana seleccionada ---
  const turnosSemanaActual = useMemo(() => ***REMOVED***
    if (!datosActuales.fechaInicio || !datosActuales.fechaFin || !allTurnos) return [];

    // Convertir fechas de inicio y fin de la semana a objetos Date
    const start = new Date(datosActuales.fechaInicio);
    start.setHours(0, 0, 0, 0);

    const end = new Date(datosActuales.fechaFin);
    end.setHours(23, 59, 59, 999);

    // Filtrar los turnos que caen en este rango
    return allTurnos.filter(turno => ***REMOVED***
      const fechaTurno = new Date(turno.fechaInicio || turno.fecha);
      return fechaTurno >= start && fechaTurno <= end;
    ***REMOVED***);
  ***REMOVED***, [allTurnos, datosActuales.fechaInicio, datosActuales.fechaFin]);
  // ------------------------------------------------------------------

  const weekNavigatorComponent = (
    <WeekNavigator
      offsetSemana=***REMOVED***offsetSemana***REMOVED***
      onSemanaChange=***REMOVED***setOffsetSemana***REMOVED***
      fechaInicio=***REMOVED***datosActuales.fechaInicio***REMOVED***
      fechaFin=***REMOVED***datosActuales.fechaFin***REMOVED***
    />
  );

  return (
    <LoadingWrapper loading=***REMOVED***loading***REMOVED***>
      <div className="px-4 py-6 space-y-6">
        <PageHeader
          title="Estadísticas"
          subtitle="Analiza tu rendimiento y proyecciones"
          icon=***REMOVED***BarChart***REMOVED***
          rightContent=***REMOVED***
            !isMobile ? (
              <div className="lg:w-2/5 lg:max-w-md">***REMOVED***weekNavigatorComponent***REMOVED***</div>
            ) : undefined
          ***REMOVED***
        />

        ***REMOVED***isMobile && (
          <div className="lg:hidden -mt-4">
            <WeekNavigator
              offsetSemana=***REMOVED***offsetSemana***REMOVED***
              onSemanaChange=***REMOVED***setOffsetSemana***REMOVED***
              fechaInicio=***REMOVED***datosActuales.fechaInicio***REMOVED***
              fechaFin=***REMOVED***datosActuales.fechaFin***REMOVED***
              variant="transparent"
            />
          </div>
        )***REMOVED***

        ***REMOVED***/* --- LAYOUT PRINCIPAL (GENERAL) --- */***REMOVED***
        <div className="space-y-6">

          ***REMOVED***/* DESKTOP: Grid de 3 columnas */***REMOVED***
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
            ***REMOVED***/* COLUMNA 1 */***REMOVED***
            <div className="lg:col-span-1 flex flex-col gap-6">
              <StatsProgressBar className="flex-grow" datosActuales=***REMOVED***datosActuales***REMOVED*** weeklyHoursGoal=***REMOVED***weeklyHoursGoal***REMOVED*** />
              <ShiftTypeStats className="flex-grow" datosActuales=***REMOVED***datosActuales***REMOVED*** loading=***REMOVED***loading***REMOVED*** />
            </div>

            ***REMOVED***/* COLUMNA 2 */***REMOVED***
            <div className="lg:col-span-1">
              <WeeklyComparison className="h-full" datosActuales=***REMOVED***datosActuales***REMOVED*** datosAnteriores=***REMOVED***datosAnteriores***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** />
            </div>

            ***REMOVED***/* COLUMNA 3 */***REMOVED***
            <div className="lg:col-span-1 flex flex-col gap-6">
              <WeeklyStatsGrid className="flex-grow" datosActuales=***REMOVED***datosActuales***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** loading=***REMOVED***loading***REMOVED*** />
              <MostProductiveDay className="flex-grow" datosActuales=***REMOVED***datosActuales***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** loading=***REMOVED***loading***REMOVED*** />
              <div className="flex-grow grid grid-cols-2 gap-4">
                <SmokoStatusCard className="h-full" smokoEnabled=***REMOVED***smokoEnabled***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** loading=***REMOVED***loading***REMOVED*** />
                <SmokoTimeCard className="h-full" smokoEnabled=***REMOVED***smokoEnabled***REMOVED*** smokoMinutes=***REMOVED***smokoMinutes***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** loading=***REMOVED***loading***REMOVED*** />
              </div>
            </div>
          </div>

          ***REMOVED***/* MÓVIL */***REMOVED***
          <div className="block lg:hidden space-y-6">
            <StatsProgressBar datosActuales=***REMOVED***datosActuales***REMOVED*** weeklyHoursGoal=***REMOVED***weeklyHoursGoal***REMOVED*** />
            <WeeklyStatsGrid datosActuales=***REMOVED***datosActuales***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** loading=***REMOVED***loading***REMOVED*** />
            <MostProductiveDay datosActuales=***REMOVED***datosActuales***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** loading=***REMOVED***loading***REMOVED*** />
            <div className="grid grid-cols-2 gap-4">
              <SmokoStatusCard smokoEnabled=***REMOVED***smokoEnabled***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** loading=***REMOVED***loading***REMOVED*** />
              <SmokoTimeCard smokoEnabled=***REMOVED***smokoEnabled***REMOVED*** smokoMinutes=***REMOVED***smokoMinutes***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** loading=***REMOVED***loading***REMOVED*** />
            </div>
            <WeeklyComparison datosActuales=***REMOVED***datosActuales***REMOVED*** datosAnteriores=***REMOVED***datosAnteriores***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** />
            <ShiftTypeStats datosActuales=***REMOVED***datosActuales***REMOVED*** loading=***REMOVED***loading***REMOVED*** />
          </div>
        </div>

        ***REMOVED***/* GRÁFICOS */***REMOVED***
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96">
            <InteractiveCharts datosActuales=***REMOVED***datosActuales***REMOVED*** gananciaPorTrabajo=***REMOVED***datosActuales.gananciaPorTrabajo || []***REMOVED*** />
          </div>
          <DailyDistribution datosActuales=***REMOVED***datosActuales***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** loading=***REMOVED***loading***REMOVED*** />
        </div>

        ***REMOVED***/* --- SECCIÓN DELIVERY --- */***REMOVED***
        ***REMOVED***tieneDelivery && (
          <>
            <PageHeader
              title="Estadísticas de Delivery"
              subtitle="Analiza tus ganancias y eficiencia en repartos"
              icon=***REMOVED***Truck***REMOVED***
              className="pt-8"
            />

            <div className="space-y-6">
              ***REMOVED***/* DESKTOP */***REMOVED***
              <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6 items-stretch">
                <div className="flex flex-col gap-6 h-full">
                  <div className="flex-none">
                    <ResumenDelivery deliveryStats=***REMOVED***deliveryStats***REMOVED*** />
                  </div>
                  <div className="flex-grow flex flex-col">
                    ***REMOVED***/* AQUÍ ESTÁ EL CAMBIO CLAVE: Pasamos turnosSemanaActual */***REMOVED***
                    <AnalisisHorarioDelivery
                      turnos=***REMOVED***datosActuales.turnos || []***REMOVED***
                      className="h-full"
                    />
                  </div>
                  <div className="flex-none">
                    <SeguimientoCombustible deliveryStats=***REMOVED***deliveryStats***REMOVED*** />
                  </div>
                </div>
                <div className="flex flex-col gap-6 h-full">
                  <EficienciaVehiculos deliveryStats=***REMOVED***deliveryStats***REMOVED*** />
                  <ComparacionPlataformas deliveryStats=***REMOVED***deliveryStats***REMOVED*** />
                </div>
              </div>

              ***REMOVED***/* MÓVIL */***REMOVED***
              <div className="block lg:hidden space-y-6">
                <ResumenDelivery deliveryStats=***REMOVED***deliveryStats***REMOVED*** />
                <AnalisisHorarioDelivery turnos=***REMOVED***turnosSemanaActual***REMOVED*** />
                <EficienciaVehiculos deliveryStats=***REMOVED***deliveryStats***REMOVED*** />
                <ComparacionPlataformas deliveryStats=***REMOVED***deliveryStats***REMOVED*** />
                <SeguimientoCombustible deliveryStats=***REMOVED***deliveryStats***REMOVED*** />
              </div>
            </div>
          </>
        )***REMOVED***
      </div>
    </LoadingWrapper>
  );
***REMOVED***;

export default Estadisticas;