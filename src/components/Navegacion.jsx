// src/components/Navegacion.jsx

import React from 'react';
import { Home, Briefcase, Calendar, BarChart2, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';

const Navegacion = ({ vistaActual, setVistaActual }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg px-4 py-6 z-10">
            <div className="grid grid-cols-5 items-center max-w-md mx-auto">
                <button
                    onClick={() => setVistaActual('dashboard')}
                    className={`flex flex-col items-center justify-center ${vistaActual === 'dashboard' ? 'text-pink-500' : 'text-gray-500'}`}
                >
                    <Home size={20} />
                    <span className="text-xs mt-1">Inicio</span>
                </button>

                <button
                    onClick={() => setVistaActual('trabajos')}
                    className={`flex flex-col items-center justify-center ${vistaActual === 'trabajos' ? 'text-pink-500' : 'text-gray-500'}`}
                >
                    <Briefcase size={20} />
                    <span className="text-xs mt-1">Trabajos</span>
                </button>

                <div className="flex justify-center items-start -mt-6">
                    <motion.button
                        onClick={() => setVistaActual('calendario')}
                        className={`
              bg-pink-500 text-white w-16 h-16 rounded-full 
              flex items-center justify-center shadow-lg 
              border-4 border-white
              ${vistaActual === 'calendario' ? 'border-pink-300' : 'border-white'}
            `}
                        whileTap={{ scale: 0.95 }}
                    >
                        <CalendarDays size={28} />
                    </motion.button>
                </div>

                <button
                    onClick={() => setVistaActual('turnos')}
                    className={`flex flex-col items-center justify-center ${vistaActual === 'turnos' ? 'text-pink-500' : 'text-gray-500'}`}
                >
                    <Calendar size={20} />
                    <span className="text-xs mt-1">Turnos</span>
                </button>

                <button
                    onClick={() => setVistaActual('estadisticas')}
                    className={`flex flex-col items-center justify-center ${vistaActual === 'estadisticas' ? 'text-pink-500' : 'text-gray-500'}`}
                >
                    <BarChart2 size={20} />
                    <span className="text-xs mt-1">Estadísticas</span>
                </button>
            </div>
        </nav>
    );
};

export default Navegacion;