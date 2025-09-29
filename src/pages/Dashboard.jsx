// src/pages/Dashboard.jsx

import React from 'react';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useApp } from '../contexts/AppContext';
import { generatePDFReport, generatePNGReport } from '../services/exportService';
import Loader from '../components/other/Loader';
import WelcomeCard from '../components/dashboard/WelcomeCard';
import QuickStatsGrid from '../components/dashboard/QuickStatsGrid';
import ThisWeekSummaryCard from '../components/dashboard/ThisWeekSummaryCard';
import RecentActivityCard from '../components/dashboard/RecentActivityCard';
import NextShiftCard from '../components/dashboard/NextShiftCard';
import TopWorkCard from '../components/dashboard/TopWorkCard';
import FavoriteWorksCard from '../components/dashboard/FavoriteWorksCard';
import ProjectionCard from '../components/dashboard/ProjectionCard';
import QuickActionsCard from '../components/dashboard/QuickActionsCard';
import ExportReportCard from '../components/dashboard/ExportReportCard';

const Dashboard = () => {
  const { loading } = useApp(); 
  const stats = useDashboardStats();
  
  // Función para manejar la exportación
  const handleExport = async (format) => {
    try {
      if (format === 'pdf') {
        await generatePDFReport(stats, stats.todosLosTurnos, stats.todosLosTrabajos);
      } else if (format === 'png') {
        await generatePNGReport(stats, stats.todosLosTurnos, stats.todosLosTrabajos);
      }
    } catch (error) {
      console.error('Error al exportar reporte:', error);
    }
  };
  
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
        
        {/* DESKTOP: Grid de 3 columnas principales */}
        <div className="hidden lg:grid lg:grid-cols-5 lg:gap-6">

          {/* CONTENEDOR 1: Stats + Acciones (4 columnas) */}
          <div className="lg:col-span-4 space-y-6">
            {/* QuickStatsGrid maneja su propio layout desktop */}
            <QuickStatsGrid stats={stats} />
            
            {/* Acciones rápidas debajo */}
            <QuickActionsCard />
          </div>
          
          {/* CONTENEDOR 2: Esta semana vertical (1 columna) */}
          <div className="lg:col-span-1">
            <ThisWeekSummaryCard stats={stats} />
          </div>
        </div>

        {/* MÓVIL: Stack vertical */}
        <div className="block lg:hidden space-y-4">
          {/* QuickStatsGrid maneja su propio layout móvil 2x2 */}
          <QuickStatsGrid stats={stats} />
          
          {/* Esta semana */}
          <ThisWeekSummaryCard stats={stats} />
          
          {/* Acciones rápidas */}
          <QuickActionsCard />
        </div>

        {/* Segunda fila: Recent Activity + Next Shift + Top Work + Favorite Works */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Recent Activity Card - 1 columna a la izquierda en desktop, full en móvil */}
          <div className="lg:col-span-1">
            <div className="h-full">
              <RecentActivityCard 
                stats={stats}
                todosLosTrabajos={stats.todosLosTrabajos}
                todosLosTurnos={stats.todosLosTurnos}
              />
            </div>
          </div>
          
          {/* Next Shift + Top Work + Favorite Works - 4 columnas con stack vertical */}
          <div className="lg:col-span-4 space-y-6">
            <NextShiftCard 
              proximoTurno={stats.proximoTurno} 
              formatearFecha={stats.formatearFecha} 
            />
            <TopWorkCard trabajoMasRentable={stats.trabajoMasRentable} />
            <FavoriteWorksCard trabajosFavoritos={stats.trabajosFavoritos} />
          </div>
        </div>

        {/* Tercera fila: Export Report + Projection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Export Report Card - izquierda */}
          <div>
            <ExportReportCard onExport={handleExport} />
          </div>
          
          {/* Projection Card - derecha */}
          <div>
            <ProjectionCard 
              proyeccionMensual={stats.proyeccionMensual}
              horasTrabajadas={stats.horasTrabajadas}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;