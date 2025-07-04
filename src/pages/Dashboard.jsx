// src/pages/Dashboard.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useDashboardStats ***REMOVED*** from '../hooks/useDashboardStats';
import Loader from '../components/other/Loader';
import WelcomeCard from '../components/dashboard/WelcomeCard';
import QuickStatsGrid from '../components/dashboard/QuickStatsGrid';
import WeeklyStatsCard from '../components/dashboard/WeeklyStatsCard';
import NextShiftCard from '../components/dashboard/NextShiftCard';
import TopWorkCard from '../components/dashboard/TopWorkCard';
import FavoriteWorksCard from '../components/dashboard/FavoriteWorksCard';
import ProjectionCard from '../components/dashboard/ProjectionCard';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

const Dashboard = () => ***REMOVED***
  const ***REMOVED*** cargando ***REMOVED*** = useApp();
  const stats = useDashboardStats();
  const [showLoading, setShowLoading] = useState(true);
  
  useEffect(() => ***REMOVED***
    let timer;
    if (cargando) ***REMOVED***
      setShowLoading(true);
    ***REMOVED*** else ***REMOVED***
      timer = setTimeout(() => setShowLoading(false), 3000);
    ***REMOVED***
    return () => timer && clearTimeout(timer);
  ***REMOVED***, [cargando]);

  if (showLoading) ***REMOVED***
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  ***REMOVED***
  
  return (
    <div className="px-4 py-6 space-y-6">
      <WelcomeCard totalGanado=***REMOVED***stats.totalGanado***REMOVED*** />
      
      <QuickStatsGrid stats=***REMOVED***stats***REMOVED*** />

      <WeeklyStatsCard stats=***REMOVED***stats***REMOVED*** />

      <NextShiftCard 
        proximoTurno=***REMOVED***stats.proximoTurno***REMOVED*** 
        formatearFecha=***REMOVED***stats.formatearFecha***REMOVED*** 
      />

      <TopWorkCard trabajoMasRentable=***REMOVED***stats.trabajoMasRentable***REMOVED*** />

      <FavoriteWorksCard trabajosFavoritos=***REMOVED***stats.trabajosFavoritos***REMOVED*** />

      <ProjectionCard 
        proyeccionMensual=***REMOVED***stats.proyeccionMensual***REMOVED***
        horasTrabajadas=***REMOVED***stats.horasTrabajadas***REMOVED***
      />
    </div>
  );
***REMOVED***;

export default Dashboard;