// src/pages/Dashboard.jsx - Versión Completa Corregida

import React from 'react';
import ***REMOVED*** useDashboardStats ***REMOVED*** from '../hooks/useDashboardStats';
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
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

const Dashboard = () => ***REMOVED***
  const ***REMOVED*** loading ***REMOVED*** = useApp(); 
  const stats = useDashboardStats();
  
  if (loading) ***REMOVED***
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  ***REMOVED***
  
  return (
    <div className="px-4 py-6 pb-32 space-y-6">
      ***REMOVED***/* Welcome Card - siempre full width */***REMOVED***
      <WelcomeCard totalGanado=***REMOVED***stats.totalGanado***REMOVED*** />

      ***REMOVED***/* Layout responsivo principal */***REMOVED***
      <div className="space-y-6">
        
        ***REMOVED***/* DESKTOP: Contenedor izquierdo + derecho */***REMOVED***
        <div className="hidden lg:grid lg:grid-cols-5 lg:gap-6">
          ***REMOVED***/* CONTENEDOR IZQUIERDO: Stats + Acciones (4 columnas) */***REMOVED***
          <div className="lg:col-span-4 space-y-6">
            ***REMOVED***/* QuickStatsGrid maneja su propio layout desktop */***REMOVED***
            <QuickStatsGrid stats=***REMOVED***stats***REMOVED*** />
            
            ***REMOVED***/* Acciones rápidas debajo */***REMOVED***
            <QuickActionsCard />
          </div>
          
          ***REMOVED***/* CONTENEDOR DERECHO: Esta semana vertical (1 columna) */***REMOVED***
          <div className="lg:col-span-1">
            <ThisWeekSummaryCard stats=***REMOVED***stats***REMOVED*** />
          </div>
        </div>

        ***REMOVED***/* MÓVIL: Stack vertical */***REMOVED***
        <div className="block lg:hidden space-y-4">
          ***REMOVED***/* QuickStatsGrid maneja su propio layout móvil 2x2 */***REMOVED***
          <QuickStatsGrid stats=***REMOVED***stats***REMOVED*** />
          
          ***REMOVED***/* Esta semana */***REMOVED***
          <ThisWeekSummaryCard stats=***REMOVED***stats***REMOVED*** />
          
          ***REMOVED***/* Acciones rápidas */***REMOVED***
          <QuickActionsCard />
        </div>

        ***REMOVED***/* Segunda fila: Recent Activity + Next Shift + Top Work + Favorite Works */***REMOVED***
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          ***REMOVED***/* Recent Activity Card - 1 columna a la izquierda en desktop, full en móvil */***REMOVED***
          <div className="lg:col-span-1">
            <div className="h-full">
              <RecentActivityCard 
                stats=***REMOVED***stats***REMOVED***
                todosLosTrabajos=***REMOVED***stats.todosLosTrabajos***REMOVED***
                todosLosTurnos=***REMOVED***stats.todosLosTurnos***REMOVED***
              />
            </div>
          </div>
          
          ***REMOVED***/* Next Shift + Top Work + Favorite Works - 4 columnas con stack vertical */***REMOVED***
          <div className="lg:col-span-4 space-y-6">
            <NextShiftCard 
              proximoTurno=***REMOVED***stats.proximoTurno***REMOVED*** 
              formatearFecha=***REMOVED***stats.formatearFecha***REMOVED*** 
            />
            <TopWorkCard trabajoMasRentable=***REMOVED***stats.trabajoMasRentable***REMOVED*** />
            <FavoriteWorksCard trabajosFavoritos=***REMOVED***stats.trabajosFavoritos***REMOVED*** />
          </div>
        </div>

        ***REMOVED***/* Tercera fila: Solo Projection */***REMOVED***
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          ***REMOVED***/* Projection Card - centrado */***REMOVED***
          <div className="lg:col-span-5">
            <div className="max-w-md mx-auto">
              <ProjectionCard 
                proyeccionMensual=***REMOVED***stats.proyeccionMensual***REMOVED***
                horasTrabajadas=***REMOVED***stats.horasTrabajadas***REMOVED***
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
***REMOVED***;

export default Dashboard;