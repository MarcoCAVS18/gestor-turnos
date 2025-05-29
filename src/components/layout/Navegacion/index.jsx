import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Briefcase, Calendar, BarChart2, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../../contexts/AppContext';

const Navegacion = ({ vistaActual, setVistaActual }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { coloresTemáticos } = useApp();
  
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
  
  const navigateToView = (view) => {
    const routes = {
      'dashboard': '/dashboard',
      'trabajos': '/trabajos',
      'turnos': '/turnos',
      'estadisticas': '/estadisticas',
      'calendario': '/calendario',
      'ajustes': '/ajustes'
    };
    
    navigate(routes[view]);
    setVistaActual(view);
  };
  
  const getActiveTextStyle = (vista) => {
    return currentView === vista 
      ? { color: coloresTemáticos?.base || '#EC4899' } 
      : { color: '#6B7280' };
  };
  
  const calendarButtonStyle = {
    backgroundColor: coloresTemáticos?.base || '#EC4899',
    borderColor: currentView === 'calendario' 
      ? coloresTemáticos?.dark || '#BE185D'
      : 'white'
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg px-4 py-6 z-10">
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
  );
};

export default Navegacion;
