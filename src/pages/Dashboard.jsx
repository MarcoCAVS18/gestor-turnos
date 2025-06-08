// src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
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
  const { cargando } = useApp();
  const stats = useDashboardStats();
  const [showLoading, setShowLoading] = useState(true);
  
  useEffect(() => {
    let timer;
    if (cargando) {
      setShowLoading(true);
    } else {
      timer = setTimeout(() => setShowLoading(false), 3000);
    }
    return () => timer && clearTimeout(timer);
  }, [cargando]);

  if (showLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6 space-y-6">
      <WelcomeCard totalGanado={stats.totalGanado} />
      
      <QuickStatsGrid stats={stats} />

      <WeeklyStatsCard stats={stats} />

      <NextShiftCard 
        proximoTurno={stats.proximoTurno} 
        formatearFecha={stats.formatearFecha} 
      />

      <TopWorkCard trabajoMasRentable={stats.trabajoMasRentable} />

      <FavoriteWorksCard trabajosFavoritos={stats.trabajosFavoritos} />

      <ProjectionCard 
        proyeccionMensual={stats.proyeccionMensual}
        horasTrabajadas={stats.horasTrabajadas}
      />

      <QuickActionsCard />
    </div>
  );
};

export default Dashboard;