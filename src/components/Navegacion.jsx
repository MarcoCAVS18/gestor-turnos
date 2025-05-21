// src/components/Navegacion.jsx

import React from 'react';
import { Home, Briefcase, Calendar, BarChart2, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext'; 

const Navegacion = ({ vistaActual, setVistaActual }) => {
    // Obtener el color principal del contexto
    const { colorPrincipal } = useApp();
    
    // Función para generar estilos dinámicos basados en el estado activo
    const getActiveTextStyle = (vista) => {
        return vistaActual === vista ? { color: colorPrincipal } : { color: '#6B7280' }; // gray-500
    };
    
    // Estilos dinámicos para el botón central
    const calendarButtonStyle = {
        backgroundColor: colorPrincipal,
        borderColor: vistaActual === 'calendario' ? colorPrincipal + '80' : 'white' // Añadir transparencia al color para el borde
    };
    
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg px-4 py-6 z-10">
            <div className="grid grid-cols-5 items-center max-w-md mx-auto">
                <button
                    onClick={() => setVistaActual('dashboard')}
                    className="flex flex-col items-center justify-center"
                    style={getActiveTextStyle('dashboard')}
                >
                    <Home size={20} />
                    <span className="text-xs mt-1">Inicio</span>
                </button>

                <button
                    onClick={() => setVistaActual('trabajos')}
                    className="flex flex-col items-center justify-center"
                    style={getActiveTextStyle('trabajos')}
                >
                    <Briefcase size={20} />
                    <span className="text-xs mt-1">Trabajos</span>
                </button>

                <div className="flex justify-center items-start -mt-6">
                    <motion.button
                        onClick={() => setVistaActual('calendario')}
                        className="text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4"
                        style={calendarButtonStyle}
                        whileTap={{ scale: 0.95 }}
                    >
                        <CalendarDays size={28} />
                    </motion.button>
                </div>

                <button
                    onClick={() => setVistaActual('turnos')}
                    className="flex flex-col items-center justify-center"
                    style={getActiveTextStyle('turnos')}
                >
                    <Calendar size={20} />
                    <span className="text-xs mt-1">Turnos</span>
                </button>

                <button
                    onClick={() => setVistaActual('estadisticas')}
                    className="flex flex-col items-center justify-center"
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