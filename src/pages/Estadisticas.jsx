// src/pages/Estadisticas.jsx - Refactorizado con StatsContext

import React from 'react';
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
import { useIsMobile } from '../hooks/useIsMobile'; // Importar hook
import MostProductiveDay from '../components/stats/MostProductiveDay';

// NUEVAS IMPORTACIONES - Cards de Smoko
import SmokoStatusCard from '../components/stats/SmokoStatusCard';
import SmokoTimeCard from '../components/stats/SmokoTimeCard';

import ResumenDelivery from '../components/stats/ResumenDelivery';
import EficienciaVehiculos from '../components/stats/EficienciaVehiculos';
import SeguimientoCombustible from '../components/stats/SeguimientoCombustible';
import ComparacionPlataformas from '../components/stats/ComparacionPlataformas';

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
  } = useStats();

  const isMobile = useIsMobile(); // Usar hook

  const tieneDelivery = deliveryEnabled && deliveryStats.turnosRealizados > 0;

  // Crear componente WeekNavigator para reutilizar
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

        {/* LAYOUT RESPONSIVO PRINCIPAL */}

        <div className="space-y-6">



          {/* DESKTOP: Grid de 3 columnas principales */}

          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">



            {/* CONTENEDOR 1: Progreso Semanal + Tipos de Turno */}

            <div className="lg:col-span-1 flex flex-col gap-6">

              <StatsProgressBar className="flex-grow" datosActuales={datosActuales} weeklyHoursGoal={weeklyHoursGoal} />



              {/* CAMBIO: Siempre mostrar ShiftTypeStats */}

              <ShiftTypeStats className="flex-grow" datosActuales={datosActuales} loading={loading} />

            </div>



            {/* CONTENEDOR 2: Comparación Semanal (expandida con 4 estadísticas) */}

            <div className="lg:col-span-1">

                          <WeeklyComparison className="h-full" datosActuales={datosActuales} datosAnteriores={datosAnteriores} thematicColors={thematicColors} />

                        </div>

            

                        {/* CONTENEDOR 3: Stats Grid + Día más productivo + NUEVAS CARDS SMOKO */}

                        <div className="lg:col-span-1 flex flex-col gap-6">

                          <WeeklyStatsGrid className="flex-grow" datosActuales={datosActuales} thematicColors={thematicColors} loading={loading} />

            

                          {/* Día más productivo */}

                          <MostProductiveDay className="flex-grow" datosActuales={datosActuales} thematicColors={thematicColors} loading={loading} />

            

                          {/* NUEVAS CARDS SMOKO - Grid de 2 columnas en el espacio señalado */}
                          <div className="flex-grow grid grid-cols-2 gap-4">
                            <SmokoStatusCard className="h-full" smokoEnabled={smokoEnabled} thematicColors={thematicColors} loading={loading} />
                            <SmokoTimeCard className="h-full" smokoEnabled={smokoEnabled} smokoMinutes={smokoMinutes} thematicColors={thematicColors} loading={loading} />
                          </div>

                        </div>

                      </div>

            

                      {/* MÓVIL Y TABLET: Stack vertical reorganizado */}

                      <div className="block lg:hidden space-y-6">

                        {/* Progreso semanal */}

                        <StatsProgressBar datosActuales={datosActuales} weeklyHoursGoal={weeklyHoursGoal} />

            

                        {/* Stats grid */}

                        <WeeklyStatsGrid datosActuales={datosActuales} thematicColors={thematicColors} loading={loading} />

            

                        {/* Día más productivo en móvil */}

                        <MostProductiveDay datosActuales={datosActuales} thematicColors={thematicColors} loading={loading} />

            

                        {/* NUEVAS CARDS SMOKO en móvil - Grid de 2 columnas */}

                        <div className="grid grid-cols-2 gap-4">

                          <SmokoStatusCard smokoEnabled={smokoEnabled} thematicColors={thematicColors} loading={loading} />

                          <SmokoTimeCard smokoEnabled={smokoEnabled} smokoMinutes={smokoMinutes} thematicColors={thematicColors} loading={loading} />

                        </div>

            

                        {/* Comparación semanal */}

                        <WeeklyComparison datosActuales={datosActuales} datosAnteriores={datosAnteriores} thematicColors={thematicColors} />

            

                        {/* CAMBIO: Tipos de turno - SIEMPRE se muestra */}

                        <ShiftTypeStats datosActuales={datosActuales} loading={loading} />

                      </div>



        </div>

        {/* NUEVO CONTENEDOR: InteractiveCharts + DailyDistribution en dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna izquierda: InteractiveCharts */}
          <div className="h-96">
            <InteractiveCharts
              datosActuales={datosActuales}
              gananciaPorTrabajo={datosActuales.gananciaPorTrabajo || []}
            />
          </div>

          {/* Columna derecha: DailyDistribution */}
          <DailyDistribution datosActuales={datosActuales} thematicColors={thematicColors} loading={loading} />

        </div>

        {/* SECCIÓN DELIVERY - Solo si está habilitado */}
        {tieneDelivery && (
          <>
            <PageHeader
              title="Estadísticas de Delivery"
              subtitle="Analiza tus ganancias y eficiencia en repartos"
              icon={Truck}
              className="pt-8"
            />

            {/* Layout responsivo para delivery */}
            <div className="space-y-6">

              {/* DESKTOP: Grid de 2x2 para delivery */}
              <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
                <ResumenDelivery deliveryStats={deliveryStats} />
                <EficienciaVehiculos deliveryStats={deliveryStats} />
                <SeguimientoCombustible deliveryStats={deliveryStats} />
                <ComparacionPlataformas deliveryStats={deliveryStats} />
              </div>

              {/* MÓVIL: Stack vertical para delivery */}
              <div className="block lg:hidden space-y-6">
                <ResumenDelivery deliveryStats={deliveryStats} />
                <EficienciaVehiculos deliveryStats={deliveryStats} />
                <SeguimientoCombustible deliveryStats={deliveryStats} />
                <ComparacionPlataformas deliveryStats={deliveryStats} />
              </div>

            </div>
          </>
        )}
      </div>
    </LoadingWrapper>
  );
};

export default Estadisticas;