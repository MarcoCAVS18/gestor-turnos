// src/pages/Estadisticas.jsx - Layout actualizado con cards de Smoko

import React, { useState } from 'react';
import { Truck } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useWeeklyStats } from '../hooks/useWeeklyStats';
import { useDeliveryStats } from '../hooks/useDeliveryStats';
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

const Estadisticas = () => {
  const { cargando, weeklyHoursGoal, deliveryEnabled } = useApp();
  const [offsetSemana, setOffsetSemana] = useState(0);

  const datosActuales = useWeeklyStats(offsetSemana);
  const datosAnteriores = useWeeklyStats(offsetSemana - 1);

  const deliveryStats = useDeliveryStats('mes');
  const tieneDelivery = deliveryEnabled && deliveryStats.totalPedidos > 0;

  return (
    <LoadingWrapper loading={cargando}>
      <div className="px-4 py-6 space-y-6">

        {/* NAVEGADOR SEMANAL - Siempre full width */}
        <WeekNavigator
          offsetSemana={offsetSemana}
          onSemanaChange={setOffsetSemana}
          fechaInicio={datosActuales.fechaInicio}
          fechaFin={datosActuales.fechaFin}
        />

        {/* LAYOUT RESPONSIVO PRINCIPAL */}
        <div className="space-y-6">

          {/* DESKTOP: Grid de 3 columnas principales */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">

            {/* CONTENEDOR 1: Progreso Semanal + Tipos de Turno */}
            <div className="lg:col-span-1 space-y-6">
              <StatsProgressBar
                horasSemanales={datosActuales.horasTrabajadas}
                metaHoras={weeklyHoursGoal || 40}
                gananciaTotal={datosActuales.totalGanado}
                className={!weeklyHoursGoal ? 'opacity-60' : ''}
              />

              {/* CAMBIO: Siempre mostrar ShiftTypeStats */}
              <ShiftTypeStats tiposDeTurno={datosActuales.tiposDeTurno} />
            </div>

            {/* CONTENEDOR 2: Comparación Semanal (expandida con 4 estadísticas) */}
            <div className="lg:col-span-1">
              <WeeklyComparison
                datosActuales={datosActuales}
                datosAnteriores={datosAnteriores}
              />
            </div>

            {/* CONTENEDOR 3: Stats Grid + Día más productivo + NUEVAS CARDS SMOKO */}
            <div className="lg:col-span-1 space-y-6">
              <WeeklyStatsGrid datos={datosActuales} />

              {/* Día más productivo */}
              <div className="bg-white rounded-xl shadow-md p-3">
                <MostProductiveDay diaMasProductivo={datosActuales.diaMasProductivo} />
              </div>

              {/* NUEVAS CARDS SMOKO - Grid de 2 columnas en el espacio señalado */}
              <div className="grid grid-cols-2 gap-4">
                <SmokoStatusCard />
                <SmokoTimeCard />
              </div>
            </div>
          </div>

          {/* MÓVIL Y TABLET: Stack vertical reorganizado */}
          <div className="block lg:hidden space-y-6">
            {/* Progreso semanal */}
            <StatsProgressBar
              horasSemanales={datosActuales.horasTrabajadas}
              metaHoras={weeklyHoursGoal || 40}
              gananciaTotal={datosActuales.totalGanado}
              className={!weeklyHoursGoal ? 'opacity-60' : ''}
            />

            {/* Stats grid */}
            <WeeklyStatsGrid datos={datosActuales} />

            {/* Día más productivo en móvil */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <MostProductiveDay diaMasProductivo={datosActuales.diaMasProductivo} />
            </div>

            {/* NUEVAS CARDS SMOKO en móvil - Grid de 2 columnas */}
            <div className="grid grid-cols-2 gap-4">
              <SmokoStatusCard />
              <SmokoTimeCard />
            </div>

            {/* Comparación semanal */}
            <WeeklyComparison
              datosActuales={datosActuales}
              datosAnteriores={datosAnteriores}
            />

            {/* CAMBIO: Tipos de turno - SIEMPRE se muestra */}
            <ShiftTypeStats tiposDeTurno={datosActuales.tiposDeTurno} />
          </div>

        </div>

        {/* NUEVO CONTENEDOR: InteractiveCharts + DailyDistribution en dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna izquierda: InteractiveCharts */}
          <div>
            <InteractiveCharts
              datosActuales={datosActuales}
              gananciaPorTrabajo={datosActuales.gananciaPorTrabajo || []}
            />
          </div>

          {/* Columna derecha: DailyDistribution */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <DailyDistribution gananciaPorDia={datosActuales.gananciaPorDia} />
          </div>
        </div>

        {/* SECCIÓN DELIVERY - Solo si está habilitado */}
        {tieneDelivery && (
          <>
            {/* Header de delivery */}
            <div className="pt-8">
              <div className="flex items-center justify-center mb-6">
                <Truck className="mr-2" size={20} />
                <h2 className="text-xl font-semibold">
                  Estadísticas de Delivery
                </h2>
              </div>
            </div>

            {/* Layout responsivo para delivery */}
            <div className="space-y-6">

              {/* DESKTOP: Grid de 2 columnas para delivery */}
              <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
                {/* Columna 1: Resumen + Combustible */}
                <div className="space-y-6">
                  <ResumenDelivery deliveryStats={deliveryStats} />
                  <SeguimientoCombustible deliveryStats={deliveryStats} />
                </div>

                {/* Columna 2: Eficiencia + Plataformas */}
                <div className="space-y-6">
                  <EficienciaVehiculos deliveryStats={deliveryStats} />
                  <ComparacionPlataformas deliveryStats={deliveryStats} />
                </div>
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