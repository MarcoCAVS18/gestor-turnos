// src/components/layout/Navegacion/index.jsx

import React from 'react';
import ***REMOVED*** useNavigate, useLocation ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** Home, Briefcase, Calendar, BarChart2, CalendarDays ***REMOVED*** from 'lucide-react';
import ***REMOVED*** motion ***REMOVED*** from 'framer-motion';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import './index.css';

const Navegacion = (***REMOVED*** vistaActual, setVistaActual ***REMOVED***) => ***REMOVED***
  const navigate = useNavigate();
  const location = useLocation();
  const ***REMOVED*** coloresTemáticos ***REMOVED*** = useApp();
  
  const getCurrentView = () => ***REMOVED***
    const path = location.pathname;
    if (path === '/dashboard' || path === '/') return 'dashboard';
    if (path === '/trabajos') return 'trabajos';
    if (path === '/turnos') return 'turnos';
    if (path === '/estadisticas') return 'estadisticas';
    if (path === '/calendario') return 'calendario';
    if (path === '/ajustes') return 'ajustes';
    return 'dashboard';
  ***REMOVED***;
  
  const currentView = getCurrentView();
  
  const navigateToView = (view) => ***REMOVED***
    const routes = ***REMOVED***
      'dashboard': '/dashboard',
      'trabajos': '/trabajos',
      'turnos': '/turnos',
      'estadisticas': '/estadisticas',
      'calendario': '/calendario',
      'ajustes': '/ajustes'
    ***REMOVED***;
    
    navigate(routes[view]);
    setVistaActual(view);
  ***REMOVED***;
  
  const getActiveTextStyle = (vista) => ***REMOVED***
    return currentView === vista 
      ? ***REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED*** 
      : ***REMOVED*** color: '#6B7280' ***REMOVED***;
  ***REMOVED***;
  
  const calendarButtonStyle = ***REMOVED***
    backgroundColor: coloresTemáticos?.base || '#EC4899',
    borderColor: currentView === 'calendario' 
      ? coloresTemáticos?.dark || '#BE185D'
      : 'white'
  ***REMOVED***;
  
  return (
    <nav className="navbar-container fixed bottom-0 left-0 right-0 bg-white px-4 py-6">
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        <button
          onClick=***REMOVED***() => navigateToView('dashboard')***REMOVED***
          className="flex flex-col items-center justify-center transition-colors duration-200"
          style=***REMOVED***getActiveTextStyle('dashboard')***REMOVED***
        >
          <Home size=***REMOVED***20***REMOVED*** />
          <span className="text-xs mt-1">Inicio</span>
        </button>

        <button
          onClick=***REMOVED***() => navigateToView('trabajos')***REMOVED***
          className="flex flex-col items-center justify-center transition-colors duration-200"
          style=***REMOVED***getActiveTextStyle('trabajos')***REMOVED***
        >
          <Briefcase size=***REMOVED***20***REMOVED*** />
          <span className="text-xs mt-1">Trabajos</span>
        </button>

        <div className="flex justify-center items-start -mt-6">
          <motion.button
            onClick=***REMOVED***() => navigateToView('calendario')***REMOVED***
            className="text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 transition-all duration-200"
            style=***REMOVED***calendarButtonStyle***REMOVED***
            whileTap=***REMOVED******REMOVED*** scale: 0.95 ***REMOVED******REMOVED***
            whileHover=***REMOVED******REMOVED*** 
              scale: 1.05,
              boxShadow: `0 8px 25px $***REMOVED***coloresTemáticos?.transparent50 || 'rgba(236, 72, 153, 0.5)'***REMOVED***`
            ***REMOVED******REMOVED***
          >
            <CalendarDays size=***REMOVED***28***REMOVED*** />
          </motion.button>
        </div>

        <button
          onClick=***REMOVED***() => navigateToView('turnos')***REMOVED***
          className="flex flex-col items-center justify-center transition-colors duration-200"
          style=***REMOVED***getActiveTextStyle('turnos')***REMOVED***
        >
          <Calendar size=***REMOVED***20***REMOVED*** />
          <span className="text-xs mt-1">Turnos</span>
        </button>

        <button
          onClick=***REMOVED***() => navigateToView('estadisticas')***REMOVED***
          className="flex flex-col items-center justify-center transition-colors duration-200"
          style=***REMOVED***getActiveTextStyle('estadisticas')***REMOVED***
        >
          <BarChart2 size=***REMOVED***20***REMOVED*** />
          <span className="text-xs mt-1">Estadísticas</span>
        </button>
      </div>
    </nav>
  );
***REMOVED***;

export default Navegacion;