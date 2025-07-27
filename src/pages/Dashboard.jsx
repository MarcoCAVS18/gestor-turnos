// src/pages/Dashboard.jsx - Versión limpia final

import React from 'react';
import { useDashboardStats } from '../hooks/useDashboardStats';
import Loader from '../components/other/Loader';
import WelcomeCard from '../components/dashboard/WelcomeCard';
import QuickStatsGrid from '../components/dashboard/QuickStatsGrid';
import WeeklyStatsCard from '../components/dashboard/WeeklyStatsCard';
import NextShiftCard from '../components/dashboard/NextShiftCard';
import TopWorkCard from '../components/dashboard/TopWorkCard';
import FavoriteWorksCard from '../components/dashboard/FavoriteWorksCard';
import ProjectionCard from '../components/dashboard/ProjectionCard';
import QuickActionsCard from '../components/dashboard/QuickActionsCard';
import { useApp } from '../contexts/AppContext';

const Dashboard = () => {
  const { loading } = useApp(); 
  const stats = useDashboardStats();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6 pb-32 space-y-6">
      {/* Welcome Card - siempre full width */}
      <WelcomeCard totalGanado={stats.totalGanado} />

      {/* Layout responsivo principal */}
      <div className="space-y-6">
        
        {/* DESKTOP: Contenedor izquierdo + derecho */}
        <div className="hidden lg:grid lg:grid-cols-5 lg:gap-6">
          {/* CONTENEDOR IZQUIERDO: Stats + Acciones (4 columnas) */}
          <div className="lg:col-span-4 space-y-6">
            {/* QuickStatsGrid maneja su propio layout desktop */}
            <QuickStatsGrid stats={stats} />
            
            {/* Acciones rápidas debajo */}
            <QuickActionsCard />
          </div>
          
          {/* CONTENEDOR DERECHO: Esta semana vertical (1 columna) */}
          <div className="lg:col-span-1">
            <WeeklyStatsCard stats={stats} />
          </div>
        </div>

        {/* MÓVIL: Stack vertical */}
        <div className="block lg:hidden space-y-4">
          {/* QuickStatsGrid maneja su propio layout móvil 2x2 */}
          <QuickStatsGrid stats={stats} />
          
          {/* Esta semana */}
          <WeeklyStatsCard stats={stats} />
          
          {/* Acciones rápidas */}
          <QuickActionsCard />
        </div>

        {/* Segunda fila: Projection + Top Work + Favorites */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Projection Card - 1 columna vertical a la izquierda en desktop, full en móvil */}
          <div className="lg:col-span-1">
            <div className="h-full">
              <ProjectionCard 
                proyeccionMensual={stats.proyeccionMensual}
                horasTrabajadas={stats.horasTrabajadas}
              />
            </div>
          </div>
          
          {/* Top Work + Favorites - 4 columnas con stack vertical */}
          <div className="lg:col-span-4 space-y-6">
            <TopWorkCard trabajoMasRentable={stats.trabajoMasRentable} />
            <FavoriteWorksCard trabajosFavoritos={stats.trabajosFavoritos} />
          </div>
        </div>

        {/* Tercera fila: Next Shift */}
        <NextShiftCard 
          proximoTurno={stats.proximoTurno} 
          formatearFecha={stats.formatearFecha} 
        />
      </div>
    </div>
  );
};

export default Dashboard;