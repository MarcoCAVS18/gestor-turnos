// src/pages/Dashboard.jsx - Versión responsiva mejorada

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
        {/* Primera fila: Stats cuadradas + Acciones + Weekly Stats vertical */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Stats Grid + Acciones - 4 columnas en pantallas grandes */}
          <div className="lg:col-span-4 space-y-6">
            <QuickStatsGrid stats={stats} />
            <QuickActionsCard />
          </div>
          
          {/* Weekly Stats - 1 columna vertical */}
          <div className="lg:col-span-1">
            <div className="h-full">
              <WeeklyStatsCard stats={stats} />
            </div>
          </div>
        </div>

        {/* Segunda fila: Projection + Top Work + Favorites */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Projection Card - 1 columna vertical a la izquierda */}
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

        {/* Segunda fila: Next Shift */}
        <NextShiftCard 
          proximoTurno={stats.proximoTurno} 
          formatearFecha={stats.formatearFecha} 
        />
      </div>
    </div>
  );
};

export default Dashboard;