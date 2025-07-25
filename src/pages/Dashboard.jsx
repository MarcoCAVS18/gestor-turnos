// src/pages/Dashboard.jsx - Versión responsiva mejorada

import React from 'react';
import ***REMOVED*** useDashboardStats ***REMOVED*** from '../hooks/useDashboardStats';
import Loader from '../components/other/Loader';
import WelcomeCard from '../components/dashboard/WelcomeCard';
import QuickStatsGrid from '../components/dashboard/QuickStatsGrid';
import WeeklyStatsCard from '../components/dashboard/WeeklyStatsCard';
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
        ***REMOVED***/* Primera fila: Stats cuadradas + Acciones + Weekly Stats vertical */***REMOVED***
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          ***REMOVED***/* Stats Grid + Acciones - 4 columnas en pantallas grandes */***REMOVED***
          <div className="lg:col-span-4 space-y-6">
            <QuickStatsGrid stats=***REMOVED***stats***REMOVED*** />
            <QuickActionsCard />
          </div>
          
          ***REMOVED***/* Weekly Stats - 1 columna vertical */***REMOVED***
          <div className="lg:col-span-1">
            <div className="h-full">
              <WeeklyStatsCard stats=***REMOVED***stats***REMOVED*** />
            </div>
          </div>
        </div>

        ***REMOVED***/* Segunda fila: Projection + Top Work + Favorites */***REMOVED***
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          ***REMOVED***/* Projection Card - 1 columna vertical a la izquierda */***REMOVED***
          <div className="lg:col-span-1">
            <div className="h-full">
              <ProjectionCard 
                proyeccionMensual=***REMOVED***stats.proyeccionMensual***REMOVED***
                horasTrabajadas=***REMOVED***stats.horasTrabajadas***REMOVED***
              />
            </div>
          </div>
          
          ***REMOVED***/* Top Work + Favorites - 4 columnas con stack vertical */***REMOVED***
          <div className="lg:col-span-4 space-y-6">
            <TopWorkCard trabajoMasRentable=***REMOVED***stats.trabajoMasRentable***REMOVED*** />
            <FavoriteWorksCard trabajosFavoritos=***REMOVED***stats.trabajosFavoritos***REMOVED*** />
          </div>
        </div>

        ***REMOVED***/* Segunda fila: Next Shift */***REMOVED***
        <NextShiftCard 
          proximoTurno=***REMOVED***stats.proximoTurno***REMOVED*** 
          formatearFecha=***REMOVED***stats.formatearFecha***REMOVED*** 
        />
      </div>
    </div>
  );
***REMOVED***;

export default Dashboard;