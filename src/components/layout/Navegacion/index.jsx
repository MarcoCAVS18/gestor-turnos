// src/components/layout/Navegacion/index.jsx

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Briefcase, Calendar, BarChart2, CalendarDays, Settings, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../../contexts/AppContext';
import { useAuth } from '../../../contexts/AuthContext';
import './index.css';

const Navegacion = ({ vistaActual, setVistaActual, abrirModalNuevoTrabajo, abrirModalNuevoTurno }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { coloresTemáticos, emojiUsuario, trabajos, trabajosDelivery } = useApp();
  const { currentUser } = useAuth();
  
  // Estado para el tooltip
  const [showTooltip, setShowTooltip] = useState(false);
  
  const getCurrentView = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/') return 'dashboard';
    if (path === '/trabajos') return 'trabajos';
    if (path === '/turnos') return 'turnos';
    if (path === '/estadisticas') return 'estadisticas';
    if (path === '/calendario') return 'calendario';
    if (path === '/ajustes') return 'ajustes';
    return 'dashboard';
  };
  
  const currentView = getCurrentView();
  
  // Verificar si hay trabajos creados
  const totalTrabajos = (trabajos?.length || 0) + (trabajosDelivery?.length || 0);
  const hayTrabajos = totalTrabajos > 0;
  
  const navigateToView = (view) => {
    // Si intenta ir a turnos pero no hay trabajos, no hacer nada en desktop
    if (view === 'turnos' && !hayTrabajos) {
      return;
    }
    
    const routes = {
      'dashboard': '/dashboard',
      'trabajos': '/trabajos',
      'turnos': '/turnos',
      'estadisticas': '/estadisticas',
      'calendario': '/calendario',
      'ajustes': '/ajustes'
    };
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    navigate(routes[view]);
    setVistaActual(view);
  };
  
  const getActiveTextStyle = (vista) => {
    return currentView === vista 
      ? { color: coloresTemáticos?.base || '#EC4899' } 
      : { color: '#6B7280' };
  };

  const getActiveDesktopStyle = (vista) => {
    // Estilo especial para turnos cuando no hay trabajos
    if (vista === 'turnos' && !hayTrabajos) {
      return {
        backgroundColor: 'transparent',
        color: '#9CA3AF',
        cursor: 'not-allowed',
        opacity: 0.5
      };
    }

    return currentView === vista
      ? {
          backgroundColor: coloresTemáticos?.base || '#EC4899',
          color: 'white'
        }
      : {
          backgroundColor: 'transparent',
          color: '#6B7280'
        };
  };
  
  const calendarButtonStyle = {
    backgroundColor: coloresTemáticos?.base || '#EC4899',
    borderColor: currentView === 'calendario' 
      ? coloresTemáticos?.dark || '#BE185D'
      : 'white'
  };

  const userName = currentUser?.displayName || 
    (currentUser?.email ? currentUser.email.split('@')[0] : 'Usuario');

  // Manejar hover del botón de turnos
  const handleTurnosMouseEnter = () => {
    if (!hayTrabajos) {
      setShowTooltip(true);
    }
  };

  const handleTurnosMouseLeave = () => {
    setShowTooltip(false);
  };
  
  return (
    <>
      <nav className="navbar-container fixed bottom-0 left-0 right-0 bg-white px-4 py-6 md:hidden">
        <div className="grid grid-cols-5 items-center max-w-md mx-auto">
          <button
            onClick={() => navigateToView('dashboard')}
            className="flex flex-col items-center justify-center transition-colors duration-200"
            style={getActiveTextStyle('dashboard')}
          >
            <Home size={20} />
            <span className="text-xs mt-1">Inicio</span>
          </button>

          <button
            onClick={() => navigateToView('trabajos')}
            className="flex flex-col items-center justify-center transition-colors duration-200"
            style={getActiveTextStyle('trabajos')}
          >
            <Briefcase size={20} />
            <span className="text-xs mt-1">Trabajos</span>
          </button>

          <div className="flex justify-center items-start -mt-6">
            <motion.button
              onClick={() => navigateToView('calendario')}
              className="text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 transition-all duration-200"
              style={calendarButtonStyle}
              whileTap={{ scale: 0.95 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: `0 8px 25px ${coloresTemáticos?.transparent50 || 'rgba(236, 72, 153, 0.5)'}`
              }}
            >
              <CalendarDays size={28} />
            </motion.button>
          </div>

          <button
            onClick={() => navigateToView('turnos')}
            className="flex flex-col items-center justify-center transition-colors duration-200"
            style={getActiveTextStyle('turnos')}
          >
            <Calendar size={20} />
            <span className="text-xs mt-1">Turnos</span>
          </button>

          <button
            onClick={() => navigateToView('estadisticas')}
            className="flex flex-col items-center justify-center transition-colors duration-200"
            style={getActiveTextStyle('estadisticas')}
          >
            <BarChart2 size={20} />
            <span className="text-xs mt-1">Estadísticas</span>
          </button>
        </div>
      </nav>

      <aside className="hidden md:flex md:flex-col w-72 bg-white border-r border-gray-200 shadow-sm h-screen fixed left-0 top-0 z-30">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg"
              style={{ backgroundColor: coloresTemáticos?.base }}
            >
              {emojiUsuario}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Gestión de Turnos
              </h1>
              <p className="text-sm text-gray-500">
                Hola {userName}
              </p>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        {(abrirModalNuevoTurno || abrirModalNuevoTrabajo) && (
          <div className="p-4 border-b border-gray-100">
            <div className="space-y-2">
              {abrirModalNuevoTurno && hayTrabajos && (
                <button
                  onClick={abrirModalNuevoTurno}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-medium transition-all hover:shadow-lg transform hover:scale-105"
                  style={{ backgroundColor: coloresTemáticos?.base }}
                >
                  <PlusCircle size={20} />
                  Nuevo Turno
                </button>
              )}
              {abrirModalNuevoTrabajo && (
                <button
                  onClick={abrirModalNuevoTrabajo}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium transition-all hover:shadow-md"
                  style={{ 
                    borderColor: coloresTemáticos?.base,
                    color: coloresTemáticos?.base 
                  }}
                >
                  <Briefcase size={20} />
                  Nuevo Trabajo
                </button>
              )}
            </div>
          </div>
        )}

        {/* Navegación Principal */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <motion.button
              onClick={() => navigateToView('dashboard')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md"
              style={getActiveDesktopStyle('dashboard')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Home size={20} />
              <span>Dashboard</span>
            </motion.button>

            <motion.button
              onClick={() => navigateToView('trabajos')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md"
              style={getActiveDesktopStyle('trabajos')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Briefcase size={20} />
              <span>Trabajos</span>
            </motion.button>

            <motion.button
              onClick={() => navigateToView('calendario')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md"
              style={getActiveDesktopStyle('calendario')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CalendarDays size={20} />
              <span>Calendario</span>
              <div 
                className="w-2 h-2 rounded-full ml-auto"
                style={{ 
                  backgroundColor: currentView === 'calendario' ? 'white' : coloresTemáticos?.base 
                }}
              />
            </motion.button>

            {/* Botón de Turnos con validación y tooltip */}
            <div className="relative">
              <motion.button
                onClick={() => navigateToView('turnos')}
                onMouseEnter={handleTurnosMouseEnter}
                onMouseLeave={handleTurnosMouseLeave}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all"
                style={getActiveDesktopStyle('turnos')}
                whileHover={hayTrabajos ? { scale: 1.02 } : {}}
                whileTap={hayTrabajos ? { scale: 0.98 } : {}}
              >
                <Calendar size={20} />
                <span>Turnos</span>
                {!hayTrabajos && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  </div>
                )}
              </motion.button>

              {/* Tooltip para cuando no hay trabajos */}
              {showTooltip && !hayTrabajos && (
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 z-50">
                  <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                    Primero crea un trabajo para agregar turnos
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800"></div>
                  </div>
                </div>
              )}
            </div>

            <motion.button
              onClick={() => navigateToView('estadisticas')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md"
              style={getActiveDesktopStyle('estadisticas')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <BarChart2 size={20} />
              <span>Estadísticas</span>
            </motion.button>
          </div>
        </nav>

        {/* Footer del Sidebar */}
        <div className="p-4 border-t border-gray-100">
          <motion.button
            onClick={() => navigateToView('ajustes')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md"
            style={getActiveDesktopStyle('ajustes')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Settings size={20} />
            <span>Configuración</span>
          </motion.button>
        </div>
      </aside>
    </>
  );
};

export default Navegacion;