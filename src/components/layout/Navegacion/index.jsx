// src/components/layout/Navegacion/index.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** useNavigate, useLocation ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** Home, Briefcase, Calendar, BarChart2, CalendarDays, Settings, PlusCircle ***REMOVED*** from 'lucide-react';
import ***REMOVED*** motion ***REMOVED*** from 'framer-motion';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useAuth ***REMOVED*** from '../../../contexts/AuthContext';
import './index.css';

const Navegacion = (***REMOVED*** vistaActual, setVistaActual, abrirModalNuevoTrabajo, abrirModalNuevoTurno ***REMOVED***) => ***REMOVED***
  const navigate = useNavigate();
  const location = useLocation();
  const ***REMOVED*** coloresTemáticos, emojiUsuario, trabajos, trabajosDelivery ***REMOVED*** = useApp();
  const ***REMOVED*** currentUser ***REMOVED*** = useAuth();
  
  // Estado para el tooltip
  const [showTooltip, setShowTooltip] = useState(false);
  
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
  
  // Verificar si hay trabajos creados
  const totalTrabajos = (trabajos?.length || 0) + (trabajosDelivery?.length || 0);
  const hayTrabajos = totalTrabajos > 0;
  
  const navigateToView = (view) => ***REMOVED***
    // Si intenta ir a turnos pero no hay trabajos, no hacer nada en desktop
    if (view === 'turnos' && !hayTrabajos) ***REMOVED***
      return;
    ***REMOVED***
    
    const routes = ***REMOVED***
      'dashboard': '/dashboard',
      'trabajos': '/trabajos',
      'turnos': '/turnos',
      'estadisticas': '/estadisticas',
      'calendario': '/calendario',
      'ajustes': '/ajustes'
    ***REMOVED***;
    
    window.scrollTo(***REMOVED*** top: 0, behavior: 'smooth' ***REMOVED***);
    
    navigate(routes[view]);
    setVistaActual(view);
  ***REMOVED***;
  
  const getActiveTextStyle = (vista) => ***REMOVED***
    return currentView === vista 
      ? ***REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED*** 
      : ***REMOVED*** color: '#6B7280' ***REMOVED***;
  ***REMOVED***;

  const getActiveDesktopStyle = (vista) => ***REMOVED***
    // Estilo especial para turnos cuando no hay trabajos
    if (vista === 'turnos' && !hayTrabajos) ***REMOVED***
      return ***REMOVED***
        backgroundColor: 'transparent',
        color: '#9CA3AF',
        cursor: 'not-allowed',
        opacity: 0.5
      ***REMOVED***;
    ***REMOVED***

    return currentView === vista
      ? ***REMOVED***
          backgroundColor: coloresTemáticos?.base || '#EC4899',
          color: 'white'
        ***REMOVED***
      : ***REMOVED***
          backgroundColor: 'transparent',
          color: '#6B7280'
        ***REMOVED***;
  ***REMOVED***;
  
  const calendarButtonStyle = ***REMOVED***
    backgroundColor: coloresTemáticos?.base || '#EC4899',
    borderColor: currentView === 'calendario' 
      ? coloresTemáticos?.dark || '#BE185D'
      : 'white'
  ***REMOVED***;

  const userName = currentUser?.displayName || 
    (currentUser?.email ? currentUser.email.split('@')[0] : 'Usuario');

  // Manejar hover del botón de turnos
  const handleTurnosMouseEnter = () => ***REMOVED***
    if (!hayTrabajos) ***REMOVED***
      setShowTooltip(true);
    ***REMOVED***
  ***REMOVED***;

  const handleTurnosMouseLeave = () => ***REMOVED***
    setShowTooltip(false);
  ***REMOVED***;
  
  return (
    <>
      <nav className="navbar-container fixed bottom-0 left-0 right-0 bg-white px-4 py-6 md:hidden">
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

      <aside className="hidden md:flex md:flex-col w-72 bg-white border-r border-gray-200 shadow-sm h-screen fixed left-0 top-0 z-30">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg"
              style=***REMOVED******REMOVED*** backgroundColor: coloresTemáticos?.base ***REMOVED******REMOVED***
            >
              ***REMOVED***emojiUsuario***REMOVED***
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Gestión de Turnos
              </h1>
              <p className="text-sm text-gray-500">
                Hola ***REMOVED***userName***REMOVED***
              </p>
            </div>
          </div>
        </div>

        ***REMOVED***/* Acciones Rápidas */***REMOVED***
        ***REMOVED***(abrirModalNuevoTurno || abrirModalNuevoTrabajo) && (
          <div className="p-4 border-b border-gray-100">
            <div className="space-y-2">
              ***REMOVED***abrirModalNuevoTurno && hayTrabajos && (
                <button
                  onClick=***REMOVED***abrirModalNuevoTurno***REMOVED***
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-medium transition-all hover:shadow-lg transform hover:scale-105"
                  style=***REMOVED******REMOVED*** backgroundColor: coloresTemáticos?.base ***REMOVED******REMOVED***
                >
                  <PlusCircle size=***REMOVED***20***REMOVED*** />
                  Nuevo Turno
                </button>
              )***REMOVED***
              ***REMOVED***abrirModalNuevoTrabajo && (
                <button
                  onClick=***REMOVED***abrirModalNuevoTrabajo***REMOVED***
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium transition-all hover:shadow-md"
                  style=***REMOVED******REMOVED*** 
                    borderColor: coloresTemáticos?.base,
                    color: coloresTemáticos?.base 
                  ***REMOVED******REMOVED***
                >
                  <Briefcase size=***REMOVED***20***REMOVED*** />
                  Nuevo Trabajo
                </button>
              )***REMOVED***
            </div>
          </div>
        )***REMOVED***

        ***REMOVED***/* Navegación Principal */***REMOVED***
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <motion.button
              onClick=***REMOVED***() => navigateToView('dashboard')***REMOVED***
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md"
              style=***REMOVED***getActiveDesktopStyle('dashboard')***REMOVED***
              whileHover=***REMOVED******REMOVED*** scale: 1.02 ***REMOVED******REMOVED***
              whileTap=***REMOVED******REMOVED*** scale: 0.98 ***REMOVED******REMOVED***
            >
              <Home size=***REMOVED***20***REMOVED*** />
              <span>Dashboard</span>
            </motion.button>

            <motion.button
              onClick=***REMOVED***() => navigateToView('trabajos')***REMOVED***
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md"
              style=***REMOVED***getActiveDesktopStyle('trabajos')***REMOVED***
              whileHover=***REMOVED******REMOVED*** scale: 1.02 ***REMOVED******REMOVED***
              whileTap=***REMOVED******REMOVED*** scale: 0.98 ***REMOVED******REMOVED***
            >
              <Briefcase size=***REMOVED***20***REMOVED*** />
              <span>Trabajos</span>
            </motion.button>

            <motion.button
              onClick=***REMOVED***() => navigateToView('calendario')***REMOVED***
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md"
              style=***REMOVED***getActiveDesktopStyle('calendario')***REMOVED***
              whileHover=***REMOVED******REMOVED*** scale: 1.02 ***REMOVED******REMOVED***
              whileTap=***REMOVED******REMOVED*** scale: 0.98 ***REMOVED******REMOVED***
            >
              <CalendarDays size=***REMOVED***20***REMOVED*** />
              <span>Calendario</span>
              <div 
                className="w-2 h-2 rounded-full ml-auto"
                style=***REMOVED******REMOVED*** 
                  backgroundColor: currentView === 'calendario' ? 'white' : coloresTemáticos?.base 
                ***REMOVED******REMOVED***
              />
            </motion.button>

            ***REMOVED***/* Botón de Turnos con validación y tooltip */***REMOVED***
            <div className="relative">
              <motion.button
                onClick=***REMOVED***() => navigateToView('turnos')***REMOVED***
                onMouseEnter=***REMOVED***handleTurnosMouseEnter***REMOVED***
                onMouseLeave=***REMOVED***handleTurnosMouseLeave***REMOVED***
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all"
                style=***REMOVED***getActiveDesktopStyle('turnos')***REMOVED***
                whileHover=***REMOVED***hayTrabajos ? ***REMOVED*** scale: 1.02 ***REMOVED*** : ***REMOVED******REMOVED******REMOVED***
                whileTap=***REMOVED***hayTrabajos ? ***REMOVED*** scale: 0.98 ***REMOVED*** : ***REMOVED******REMOVED******REMOVED***
              >
                <Calendar size=***REMOVED***20***REMOVED*** />
                <span>Turnos</span>
                ***REMOVED***!hayTrabajos && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  </div>
                )***REMOVED***
              </motion.button>

              ***REMOVED***/* Tooltip para cuando no hay trabajos */***REMOVED***
              ***REMOVED***showTooltip && !hayTrabajos && (
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 z-50">
                  <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                    Primero crea un trabajo para agregar turnos
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800"></div>
                  </div>
                </div>
              )***REMOVED***
            </div>

            <motion.button
              onClick=***REMOVED***() => navigateToView('estadisticas')***REMOVED***
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md"
              style=***REMOVED***getActiveDesktopStyle('estadisticas')***REMOVED***
              whileHover=***REMOVED******REMOVED*** scale: 1.02 ***REMOVED******REMOVED***
              whileTap=***REMOVED******REMOVED*** scale: 0.98 ***REMOVED******REMOVED***
            >
              <BarChart2 size=***REMOVED***20***REMOVED*** />
              <span>Estadísticas</span>
            </motion.button>
          </div>
        </nav>

        ***REMOVED***/* Footer del Sidebar */***REMOVED***
        <div className="p-4 border-t border-gray-100">
          <motion.button
            onClick=***REMOVED***() => navigateToView('ajustes')***REMOVED***
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md"
            style=***REMOVED***getActiveDesktopStyle('ajustes')***REMOVED***
            whileHover=***REMOVED******REMOVED*** scale: 1.02 ***REMOVED******REMOVED***
            whileTap=***REMOVED******REMOVED*** scale: 0.98 ***REMOVED******REMOVED***
          >
            <Settings size=***REMOVED***20***REMOVED*** />
            <span>Configuración</span>
          </motion.button>
        </div>
      </aside>
    </>
  );
***REMOVED***;

export default Navegacion;