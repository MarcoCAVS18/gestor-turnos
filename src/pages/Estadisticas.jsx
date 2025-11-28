// src/pages/Estadisticas.jsx - Refactorizado con StatsContext

import React from 'react';
import ***REMOVED*** motion ***REMOVED*** from 'framer-motion';
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
import MostProductiveDay from '../components/stats/MostProductiveDay';

// NUEVAS IMPORTACIONES - Cards de Smoko
import SmokoStatusCard from '../components/stats/SmokoStatusCard';
import SmokoTimeCard from '../components/stats/SmokoTimeCard';

import ResumenDelivery from '../components/stats/ResumenDelivery';
import EficienciaVehiculos from '../components/stats/EficienciaVehiculos';
import SeguimientoCombustible from '../components/stats/SeguimientoCombustible';
import ComparacionPlataformas from '../components/stats/ComparacionPlataformas';

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

  ***REMOVED*** = useStats();

  

  const tieneDelivery = deliveryEnabled && deliveryStats.turnosRealizados > 0;

  const headerVariants = ***REMOVED***
    hidden: ***REMOVED*** opacity: 0, y: -20 ***REMOVED***,
    visible: ***REMOVED*** opacity: 1, y: 0, transition: ***REMOVED*** duration: 0.3 ***REMOVED*** ***REMOVED***
  ***REMOVED***;

  return (
    <LoadingWrapper loading=***REMOVED***loading***REMOVED***>
      <div className="px-4 py-6 space-y-6">

        <div className="lg:flex lg:justify-between lg:items-center">
          <motion.div
            className="flex justify-between items-center mb-4 lg:mb-0"
            variants=***REMOVED***headerVariants***REMOVED***
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center space-x-3">
              <div 
                className="p-2 rounded-lg"
                style=***REMOVED******REMOVED*** backgroundColor: thematicColors.transparent10 ***REMOVED******REMOVED***
              >
                <BarChart 
                  className="w-6 h-6" 
                  style=***REMOVED******REMOVED*** color: thematicColors.primary ***REMOVED******REMOVED***
                />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Estadísticas</h1>
                <p className="text-sm text-gray-600">
                  Analiza tu rendimiento y proyecciones
                </p>
              </div>
            </div>
          </motion.div>

          <div className="lg:w-2/5 lg:max-w-md">
            <WeekNavigator
              offsetSemana=***REMOVED***offsetSemana***REMOVED***
              onSemanaChange=***REMOVED***setOffsetSemana***REMOVED***
              fechaInicio=***REMOVED***datosActuales.fechaInicio***REMOVED***
              fechaFin=***REMOVED***datosActuales.fechaFin***REMOVED***
            />
          </div>
        </div>

        ***REMOVED***/* LAYOUT RESPONSIVO PRINCIPAL */***REMOVED***

        <div className="space-y-6">



          ***REMOVED***/* DESKTOP: Grid de 3 columnas principales */***REMOVED***

          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">



            ***REMOVED***/* CONTENEDOR 1: Progreso Semanal + Tipos de Turno */***REMOVED***

            <div className="lg:col-span-1 flex flex-col gap-6">

              <StatsProgressBar className="flex-grow" datosActuales=***REMOVED***datosActuales***REMOVED*** weeklyHoursGoal=***REMOVED***weeklyHoursGoal***REMOVED*** />



              ***REMOVED***/* CAMBIO: Siempre mostrar ShiftTypeStats */***REMOVED***

              <ShiftTypeStats className="flex-grow" datosActuales=***REMOVED***datosActuales***REMOVED*** loading=***REMOVED***loading***REMOVED*** />

            </div>



            ***REMOVED***/* CONTENEDOR 2: Comparación Semanal (expandida con 4 estadísticas) */***REMOVED***

            <div className="lg:col-span-1">

                          <WeeklyComparison className="h-full" datosActuales=***REMOVED***datosActuales***REMOVED*** datosAnteriores=***REMOVED***datosAnteriores***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** />

                        </div>

            

                        ***REMOVED***/* CONTENEDOR 3: Stats Grid + Día más productivo + NUEVAS CARDS SMOKO */***REMOVED***

                        <div className="lg:col-span-1 flex flex-col gap-6">

                          <WeeklyStatsGrid className="flex-grow" datosActuales=***REMOVED***datosActuales***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** loading=***REMOVED***loading***REMOVED*** />

            

                          ***REMOVED***/* Día más productivo */***REMOVED***

                          <MostProductiveDay className="flex-grow" datosActuales=***REMOVED***datosActuales***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** loading=***REMOVED***loading***REMOVED*** />

            

                          ***REMOVED***/* NUEVAS CARDS SMOKO - Grid de 2 columnas en el espacio señalado */***REMOVED***
                          <div className="flex-grow grid grid-cols-2 gap-4">
                            <SmokoStatusCard className="h-full" smokoEnabled=***REMOVED***smokoEnabled***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** loading=***REMOVED***loading***REMOVED*** />
                            <SmokoTimeCard className="h-full" smokoEnabled=***REMOVED***smokoEnabled***REMOVED*** smokoMinutes=***REMOVED***smokoMinutes***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** loading=***REMOVED***loading***REMOVED*** />
                          </div>

                        </div>

                      </div>

            

                      ***REMOVED***/* MÓVIL Y TABLET: Stack vertical reorganizado */***REMOVED***

                      <div className="block lg:hidden space-y-6">

                        ***REMOVED***/* Progreso semanal */***REMOVED***

                        <StatsProgressBar datosActuales=***REMOVED***datosActuales***REMOVED*** weeklyHoursGoal=***REMOVED***weeklyHoursGoal***REMOVED*** />

            

                        ***REMOVED***/* Stats grid */***REMOVED***

                        <WeeklyStatsGrid datosActuales=***REMOVED***datosActuales***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** loading=***REMOVED***loading***REMOVED*** />

            

                        ***REMOVED***/* Día más productivo en móvil */***REMOVED***

                        <MostProductiveDay datosActuales=***REMOVED***datosActuales***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** loading=***REMOVED***loading***REMOVED*** />

            

                        ***REMOVED***/* NUEVAS CARDS SMOKO en móvil - Grid de 2 columnas */***REMOVED***

                        <div className="grid grid-cols-2 gap-4">

                          <SmokoStatusCard smokoEnabled=***REMOVED***smokoEnabled***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** loading=***REMOVED***loading***REMOVED*** />

                          <SmokoTimeCard smokoEnabled=***REMOVED***smokoEnabled***REMOVED*** smokoMinutes=***REMOVED***smokoMinutes***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** loading=***REMOVED***loading***REMOVED*** />

                        </div>

            

                        ***REMOVED***/* Comparación semanal */***REMOVED***

                        <WeeklyComparison datosActuales=***REMOVED***datosActuales***REMOVED*** datosAnteriores=***REMOVED***datosAnteriores***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** />

            

                        ***REMOVED***/* CAMBIO: Tipos de turno - SIEMPRE se muestra */***REMOVED***

                        <ShiftTypeStats datosActuales=***REMOVED***datosActuales***REMOVED*** loading=***REMOVED***loading***REMOVED*** />

                      </div>



        </div>

        ***REMOVED***/* NUEVO CONTENEDOR: InteractiveCharts + DailyDistribution en dos columnas */***REMOVED***
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          ***REMOVED***/* Columna izquierda: InteractiveCharts */***REMOVED***
          <div className="h-96">
            <InteractiveCharts
              datosActuales=***REMOVED***datosActuales***REMOVED***
              gananciaPorTrabajo=***REMOVED***datosActuales.gananciaPorTrabajo || []***REMOVED***
            />
          </div>

          ***REMOVED***/* Columna derecha: DailyDistribution */***REMOVED***
          <DailyDistribution datosActuales=***REMOVED***datosActuales***REMOVED*** thematicColors=***REMOVED***thematicColors***REMOVED*** loading=***REMOVED***loading***REMOVED*** />

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