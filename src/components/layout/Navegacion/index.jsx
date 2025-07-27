// src/components/layout/Navegacion/index.jsx - Con logo en sidebar

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Briefcase, Calendar, BarChart2, CalendarDays, Settings, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../../contexts/AppContext';
import './index.css';

const Navegacion = ({ setVistaActual, abrirModalNuevoTrabajo, abrirModalNuevoTurno }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { thematicColors, trabajos, trabajosDelivery } = useApp();
  
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
      ? { color: thematicColors?.base || '#EC4899' } 
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
          backgroundColor: thematicColors?.base || '#EC4899',
          color: 'white'
        }
      : {
          backgroundColor: 'transparent',
          color: '#6B7280'
        };
  };
  
  const calendarButtonStyle = {
    backgroundColor: thematicColors?.base || '#EC4899',
    borderColor: currentView === 'calendario' 
      ? thematicColors?.dark || '#BE185D'
      : 'white'
  };

  // Manejar hover del botón de turnos
  const handleTurnosMouseEnter = () => {
    if (!hayTrabajos) {
      setShowTooltip(true);
    }
  };

  const handleTurnosMouseLeave = () => {
    setShowTooltip(false);
  };

  // Función para navegar al dashboard desde el logo
  const handleLogoClick = () => {
    navigateToView('dashboard');
  };
  
  return (
    <>
      {/* NAVEGACIÓN MÓVIL */}
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
                boxShadow: `0 8px 25px ${thematicColors?.transparent50 || 'rgba(236, 72, 153, 0.5)'}`
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

      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex md:flex-col w-72 bg-white border-r border-gray-200 shadow-sm h-screen fixed left-0 top-0 z-30">
        
        {/* HEADER DEL SIDEBAR - MEJORADO CON LOGO */}
        <div className="p-6 border-b border-gray-100">
          <button 
            onClick={handleLogoClick}
            className="flex items-center space-x-4 hover:opacity-80 transition-opacity w-full text-left"
          >
            {/* Logo en lugar del emoji */}
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: thematicColors?.base || '#EC4899' }}
            >
              <img 
                src="/assets/SVG/logo.svg" 
                alt="Logo" 
                className="w-12 h-12 filter brightness-0 invert"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
            
            {/* Solo el título, sin saludo */}
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Gestión de Turnos
              </h1>
              {/* Eliminado: Hola {userName} */}
            </div>
          </button>
        </div>

        {/* ACCIONES RÁPIDAS */}
        {(abrirModalNuevoTurno || abrirModalNuevoTrabajo) && (
          <div className="p-4 border-b border-gray-100">
            <div className="space-y-2">
              {abrirModalNuevoTurno && hayTrabajos && (
                <button
                  onClick={abrirModalNuevoTurno}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-lg transform hover:scale-105 btn-primary"
                  style={{ 
                    backgroundColor: thematicColors?.base || '#EC4899',
                    color: '#ffffff'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = thematicColors?.dark || '#BE185D';
                    e.target.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = thematicColors?.base || '#EC4899';
                    e.target.style.color = '#ffffff';
                  }}
                >
                  <PlusCircle size={20} style={{ color: '#ffffff' }} />
                  <span style={{ color: '#ffffff' }}>Nuevo Turno</span>
                </button>
              )}
              {abrirModalNuevoTrabajo && (
                <button
                  onClick={abrirModalNuevoTrabajo}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md"
                  style={{ 
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: thematicColors?.base || '#EC4899',
                    color: thematicColors?.base || '#EC4899',
                    backgroundColor: '#ffffff'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = thematicColors?.transparent10 || 'rgba(236, 72, 153, 0.1)';
                    e.target.style.color = thematicColors?.base || '#EC4899';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.color = thematicColors?.base || '#EC4899';
                  }}
                >
                  <Briefcase size={20} style={{ color: thematicColors?.base || '#EC4899' }} />
                  <span style={{ color: thematicColors?.base || '#EC4899' }}>Nuevo Trabajo</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* NAVEGACIÓN PRINCIPAL */}
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
                  backgroundColor: currentView === 'calendario' ? 'white' : thematicColors?.base 
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

        {/* FOOTER DEL SIDEBAR */}
        <div className="p-4 border-t border-gray-100">
          <motion.button
            onClick={() => navigateToView('ajustes')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:bg-gray-50"
            style={{
              backgroundColor: 'transparent',
              color: '#6B7280'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Settings size={20} style={{ color: '#6B7280' }} />
            <span style={{ color: '#6B7280' }}>Configuración</span>
          </motion.button>
        </div>
      </aside>
    </>
  );
};

export default Navegacion;