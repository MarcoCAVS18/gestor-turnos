// src/pages/Estadisticas.jsx - Layout actualizado con cards de Smoko

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** Truck ***REMOVED*** from 'lucide-react';
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
import InteractiveCharts from '../components/stats/InteractiveCharts';
import MostProductiveDay from '../components/stats/MostProductiveDay';

// NUEVAS IMPORTACIONES - Cards de Smoko
import SmokoStatusCard from '../components/stats/SmokoStatusCard';
import SmokoTimeCard from '../components/stats/SmokoTimeCard';

import ResumenDelivery from '../components/stats/ResumenDelivery';
import EficienciaVehiculos from '../components/stats/EficienciaVehiculos';
import SeguimientoCombustible from '../components/stats/SeguimientoCombustible';
import ComparacionPlataformas from '../components/stats/ComparacionPlataformas';

const Estadisticas = () => ***REMOVED***
  const ***REMOVED*** cargando, weeklyHoursGoal, deliveryEnabled ***REMOVED*** = useApp();
  const [offsetSemana, setOffsetSemana] = useState(0);

  const datosActuales = useWeeklyStats(offsetSemana);
  const datosAnteriores = useWeeklyStats(offsetSemana - 1);

  const deliveryStats = useDeliveryStats('mes');
  const tieneDelivery = deliveryEnabled && deliveryStats.totalPedidos > 0;

  return (
    <LoadingWrapper loading=***REMOVED***cargando***REMOVED***>
      <div className="px-4 py-6 space-y-6">

        ***REMOVED***/* NAVEGADOR SEMANAL - Siempre full width */***REMOVED***
        <WeekNavigator
          offsetSemana=***REMOVED***offsetSemana***REMOVED***
          onSemanaChange=***REMOVED***setOffsetSemana***REMOVED***
          fechaInicio=***REMOVED***datosActuales.fechaInicio***REMOVED***
          fechaFin=***REMOVED***datosActuales.fechaFin***REMOVED***
        />

        ***REMOVED***/* LAYOUT RESPONSIVO PRINCIPAL */***REMOVED***
        <div className="space-y-6">

          ***REMOVED***/* DESKTOP: Grid de 3 columnas principales */***REMOVED***
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">

            ***REMOVED***/* CONTENEDOR 1: Progreso Semanal + Tipos de Turno */***REMOVED***
            <div className="lg:col-span-1 space-y-6">
              <StatsProgressBar
                horasSemanales=***REMOVED***datosActuales.horasTrabajadas***REMOVED***
                metaHoras=***REMOVED***weeklyHoursGoal || 40***REMOVED***
                gananciaTotal=***REMOVED***datosActuales.totalGanado***REMOVED***
                className=***REMOVED***!weeklyHoursGoal ? 'opacity-60' : ''***REMOVED***
              />

              ***REMOVED***/* CAMBIO: Siempre mostrar ShiftTypeStats */***REMOVED***
              <ShiftTypeStats tiposDeTurno=***REMOVED***datosActuales.tiposDeTurno***REMOVED*** />
            </div>

            ***REMOVED***/* CONTENEDOR 2: Comparación Semanal (expandida con 4 estadísticas) */***REMOVED***
            <div className="lg:col-span-1">
              <WeeklyComparison
                datosActuales=***REMOVED***datosActuales***REMOVED***
                datosAnteriores=***REMOVED***datosAnteriores***REMOVED***
              />
            </div>

            ***REMOVED***/* CONTENEDOR 3: Stats Grid + Día más productivo + NUEVAS CARDS SMOKO */***REMOVED***
            <div className="lg:col-span-1 space-y-6">
              <WeeklyStatsGrid datos=***REMOVED***datosActuales***REMOVED*** />

              ***REMOVED***/* Día más productivo */***REMOVED***
              <div className="bg-white rounded-xl shadow-md p-3">
                <MostProductiveDay diaMasProductivo=***REMOVED***datosActuales.diaMasProductivo***REMOVED*** />
              </div>

              ***REMOVED***/* NUEVAS CARDS SMOKO - Grid de 2 columnas en el espacio señalado */***REMOVED***
              <div className="grid grid-cols-2 gap-4">
                <SmokoStatusCard />
                <SmokoTimeCard />
              </div>
            </div>
          </div>

          ***REMOVED***/* MÓVIL Y TABLET: Stack vertical reorganizado */***REMOVED***
          <div className="block lg:hidden space-y-6">
            ***REMOVED***/* Progreso semanal */***REMOVED***
            <StatsProgressBar
              horasSemanales=***REMOVED***datosActuales.horasTrabajadas***REMOVED***
              metaHoras=***REMOVED***weeklyHoursGoal || 40***REMOVED***
              gananciaTotal=***REMOVED***datosActuales.totalGanado***REMOVED***
              className=***REMOVED***!weeklyHoursGoal ? 'opacity-60' : ''***REMOVED***
            />

            ***REMOVED***/* Stats grid */***REMOVED***
            <WeeklyStatsGrid datos=***REMOVED***datosActuales***REMOVED*** />

            ***REMOVED***/* Día más productivo en móvil */***REMOVED***
            <div className="bg-white rounded-xl shadow-md p-4">
              <MostProductiveDay diaMasProductivo=***REMOVED***datosActuales.diaMasProductivo***REMOVED*** />
            </div>

            ***REMOVED***/* NUEVAS CARDS SMOKO en móvil - Grid de 2 columnas */***REMOVED***
            <div className="grid grid-cols-2 gap-4">
              <SmokoStatusCard />
              <SmokoTimeCard />
            </div>

            ***REMOVED***/* Comparación semanal */***REMOVED***
            <WeeklyComparison
              datosActuales=***REMOVED***datosActuales***REMOVED***
              datosAnteriores=***REMOVED***datosAnteriores***REMOVED***
            />

            ***REMOVED***/* CAMBIO: Tipos de turno - SIEMPRE se muestra */***REMOVED***
            <ShiftTypeStats tiposDeTurno=***REMOVED***datosActuales.tiposDeTurno***REMOVED*** />
          </div>

        </div>

        ***REMOVED***/* NUEVO CONTENEDOR: InteractiveCharts + DailyDistribution en dos columnas */***REMOVED***
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          ***REMOVED***/* Columna izquierda: InteractiveCharts */***REMOVED***
          <div>
            <InteractiveCharts
              datosActuales=***REMOVED***datosActuales***REMOVED***
              gananciaPorTrabajo=***REMOVED***datosActuales.gananciaPorTrabajo || []***REMOVED***
            />
          </div>

          ***REMOVED***/* Columna derecha: DailyDistribution */***REMOVED***
          <div className="bg-white rounded-xl shadow-md p-4">
            <DailyDistribution gananciaPorDia=***REMOVED***datosActuales.gananciaPorDia***REMOVED*** />
          </div>
        </div>

        ***REMOVED***/* SECCIÓN DELIVERY - Solo si está habilitado */***REMOVED***
        ***REMOVED***tieneDelivery && (
          <>
            ***REMOVED***/* Header de delivery */***REMOVED***
            <div className="pt-8">
              <div className="flex items-center justify-center mb-6">
                <Truck className="mr-2" size=***REMOVED***20***REMOVED*** />
                <h2 className="text-xl font-semibold">
                  Estadísticas de Delivery
                </h2>
              </div>
            </div>

            ***REMOVED***/* Layout responsivo para delivery */***REMOVED***
            <div className="space-y-6">

              ***REMOVED***/* DESKTOP: Grid de 2 columnas para delivery */***REMOVED***
              <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
                ***REMOVED***/* Columna 1: Resumen + Combustible */***REMOVED***
                <div className="space-y-6">
                  <ResumenDelivery deliveryStats=***REMOVED***deliveryStats***REMOVED*** />
                  <SeguimientoCombustible deliveryStats=***REMOVED***deliveryStats***REMOVED*** />
                </div>

                ***REMOVED***/* Columna 2: Eficiencia + Plataformas */***REMOVED***
                <div className="space-y-6">
                  <EficienciaVehiculos deliveryStats=***REMOVED***deliveryStats***REMOVED*** />
                  <ComparacionPlataformas deliveryStats=***REMOVED***deliveryStats***REMOVED*** />
                </div>
              </div>

              ***REMOVED***/* MÓVIL: Stack vertical para delivery */***REMOVED***
              <div className="block lg:hidden space-y-6">
                <ResumenDelivery deliveryStats=***REMOVED***deliveryStats***REMOVED*** />
                <EficienciaVehiculos deliveryStats=***REMOVED***deliveryStats***REMOVED*** />
                <SeguimientoCombustible deliveryStats=***REMOVED***deliveryStats***REMOVED*** />
                <ComparacionPlataformas deliveryStats=***REMOVED***deliveryStats***REMOVED*** />
              </div>

            </div>
          </>
        )***REMOVED***
      </div>
    </LoadingWrapper>
  );
***REMOVED***;

export default Estadisticas;