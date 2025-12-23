import React, { useMemo } from 'react'; // <--- Asegúrate de importar useMemo
import PageHeader from '../components/layout/PageHeader';
import { Truck, BarChart } from 'lucide-react';
import { useStats } from '../contexts/StatsContext';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import WeekNavigator from '../components/stats/WeekNavigator';
import StatsProgressBar from '../components/stats/StatsProgressBar';
import WeeklyStatsGrid from '../components/stats/WeeklyStatsGrid';
import WeeklyComparison from '../components/stats/WeeklyComparison';
import DailyDistribution from '../components/stats/DailyDistribution';
import ShiftTypeStats from '../components/stats/ShiftTypeStats';
import InteractiveCharts from '../components/stats/InteractiveCharts';
import { useIsMobile } from '../hooks/useIsMobile';
import MostProductiveDay from '../components/stats/MostProductiveDay';

// Cards de Smoko
import SmokoStatusCard from '../components/stats/SmokoStatusCard';
import SmokoTimeCard from '../components/stats/SmokoTimeCard';

// Componentes de Delivery
import ResumenDelivery from '../components/stats/ResumenDelivery';
import EficienciaVehiculos from '../components/stats/EficienciaVehiculos';
import SeguimientoCombustible from '../components/stats/SeguimientoCombustible';
import ComparacionPlataformas from '../components/stats/ComparacionPlataformas';
import AnalisisHorarioDelivery from '../components/stats/AnalisisHorarioDelivery';

const Estadisticas = () => {
  const {
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
    allTurnos, // <--- IMPORTANTE: Necesitamos todos los turnos del contexto
  } = useStats();

  const isMobile = useIsMobile();
  const tieneDelivery = deliveryEnabled && deliveryStats.turnosRealizados > 0;

  // --- SOLUCIÓN: Filtrar los turnos reales de la semana seleccionada ---
  const turnosSemanaActual = useMemo(() => {
    if (!datosActuales.fechaInicio || !datosActuales.fechaFin || !allTurnos) return [];

    // Convertir fechas de inicio y fin de la semana a objetos Date
    const start = new Date(datosActuales.fechaInicio);
    start.setHours(0, 0, 0, 0);

    const end = new Date(datosActuales.fechaFin);
    end.setHours(23, 59, 59, 999);

    // Filtrar los turnos que caen en este rango
    return allTurnos.filter(turno => {
      const fechaTurno = new Date(turno.fechaInicio || turno.fecha);
      return fechaTurno >= start && fechaTurno <= end;
    });
  }, [allTurnos, datosActuales.fechaInicio, datosActuales.fechaFin]);
  // ------------------------------------------------------------------

  const weekNavigatorComponent = (
    <WeekNavigator
      offsetSemana={offsetSemana}
      onSemanaChange={setOffsetSemana}
      fechaInicio={datosActuales.fechaInicio}
      fechaFin={datosActuales.fechaFin}
    />
  );

  return (
    <LoadingWrapper loading={loading}>
      <div className="px-4 py-6 space-y-6">
        <PageHeader
          title="Estadísticas"
          subtitle="Analiza tu rendimiento y proyecciones"
          icon={BarChart}
          rightContent={
            !isMobile ? (
              <div className="lg:w-2/5 lg:max-w-md">{weekNavigatorComponent}</div>
            ) : undefined
          }
        />

        {isMobile && (
          <div className="lg:hidden -mt-4">
            <WeekNavigator
              offsetSemana={offsetSemana}
              onSemanaChange={setOffsetSemana}
              fechaInicio={datosActuales.fechaInicio}
              fechaFin={datosActuales.fechaFin}
              variant="transparent"
            />
          </div>
        )}

        {/* --- LAYOUT PRINCIPAL (GENERAL) --- */}
        <div className="space-y-6">

          {/* DESKTOP: Grid de 3 columnas */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
            {/* COLUMNA 1 */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <StatsProgressBar className="flex-grow" datosActuales={datosActuales} weeklyHoursGoal={weeklyHoursGoal} />
              <ShiftTypeStats className="flex-grow" datosActuales={datosActuales} loading={loading} />
            </div>

            {/* COLUMNA 2 */}
            <div className="lg:col-span-1">
              <WeeklyComparison className="h-full" datosActuales={datosActuales} datosAnteriores={datosAnteriores} thematicColors={thematicColors} />
            </div>

            {/* COLUMNA 3 */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <WeeklyStatsGrid className="flex-grow" datosActuales={datosActuales} thematicColors={thematicColors} loading={loading} />
              <MostProductiveDay className="flex-grow" datosActuales={datosActuales} thematicColors={thematicColors} loading={loading} />
              <div className="flex-grow grid grid-cols-2 gap-4">
                <SmokoStatusCard className="h-full" smokoEnabled={smokoEnabled} thematicColors={thematicColors} loading={loading} />
                <SmokoTimeCard className="h-full" smokoEnabled={smokoEnabled} smokoMinutes={smokoMinutes} thematicColors={thematicColors} loading={loading} />
              </div>
            </div>
          </div>

          {/* MÓVIL */}
          <div className="block lg:hidden space-y-6">
            <StatsProgressBar datosActuales={datosActuales} weeklyHoursGoal={weeklyHoursGoal} />
            <WeeklyStatsGrid datosActuales={datosActuales} thematicColors={thematicColors} loading={loading} />
            <MostProductiveDay datosActuales={datosActuales} thematicColors={thematicColors} loading={loading} />
            <div className="grid grid-cols-2 gap-4">
              <SmokoStatusCard smokoEnabled={smokoEnabled} thematicColors={thematicColors} loading={loading} />
              <SmokoTimeCard smokoEnabled={smokoEnabled} smokoMinutes={smokoMinutes} thematicColors={thematicColors} loading={loading} />
            </div>
            <WeeklyComparison datosActuales={datosActuales} datosAnteriores={datosAnteriores} thematicColors={thematicColors} />
            <ShiftTypeStats datosActuales={datosActuales} loading={loading} />
          </div>
        </div>

        {/* GRÁFICOS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96">
            <InteractiveCharts datosActuales={datosActuales} gananciaPorTrabajo={datosActuales.gananciaPorTrabajo || []} />
          </div>
          <DailyDistribution datosActuales={datosActuales} thematicColors={thematicColors} loading={loading} />
        </div>

        {/* --- SECCIÓN DELIVERY --- */}
        {tieneDelivery && (
          <>
            <PageHeader
              title="Estadísticas de Delivery"
              subtitle="Analiza tus ganancias y eficiencia en repartos"
              icon={Truck}
              className="pt-8"
            />

            <div className="space-y-6">
              {/* DESKTOP */}
              <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6 items-stretch">
                <div className="flex flex-col gap-6 h-full">
                  <div className="flex-none">
                    <ResumenDelivery deliveryStats={deliveryStats} />
                  </div>
                  <div className="flex-grow flex flex-col">
                    {/* AQUÍ ESTÁ EL CAMBIO CLAVE: Pasamos turnosSemanaActual */}
                    <AnalisisHorarioDelivery
                      turnos={datosActuales.turnos || []}
                      className="h-full"
                    />
                  </div>
                  <div className="flex-none">
                    <SeguimientoCombustible deliveryStats={deliveryStats} />
                  </div>
                </div>
                <div className="flex flex-col gap-6 h-full">
                  <EficienciaVehiculos deliveryStats={deliveryStats} />
                  <ComparacionPlataformas deliveryStats={deliveryStats} />
                </div>
              </div>

              {/* MÓVIL */}
              <div className="block lg:hidden space-y-6">
                <ResumenDelivery deliveryStats={deliveryStats} />
                <AnalisisHorarioDelivery turnos={turnosSemanaActual} />
                <EficienciaVehiculos deliveryStats={deliveryStats} />
                <ComparacionPlataformas deliveryStats={deliveryStats} />
                <SeguimientoCombustible deliveryStats={deliveryStats} />
              </div>
            </div>
          </>
        )}
      </div>
    </LoadingWrapper>
  );
};

export default Estadisticas;