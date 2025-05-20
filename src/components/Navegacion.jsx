// src/components/Navegacion.jsx

import React from 'react';
import ***REMOVED*** Home, Briefcase, Calendar, BarChart2, CalendarDays ***REMOVED*** from 'lucide-react';
import ***REMOVED*** motion ***REMOVED*** from 'framer-motion';

const Navegacion = (***REMOVED*** vistaActual, setVistaActual ***REMOVED***) => ***REMOVED***
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg px-4 py-6 z-10">
            <div className="grid grid-cols-5 items-center max-w-md mx-auto">
                <button
                    onClick=***REMOVED***() => setVistaActual('dashboard')***REMOVED***
                    className=***REMOVED***`flex flex-col items-center justify-center $***REMOVED***vistaActual === 'dashboard' ? 'text-pink-500' : 'text-gray-500'***REMOVED***`***REMOVED***
                >
                    <Home size=***REMOVED***20***REMOVED*** />
                    <span className="text-xs mt-1">Inicio</span>
                </button>

                <button
                    onClick=***REMOVED***() => setVistaActual('trabajos')***REMOVED***
                    className=***REMOVED***`flex flex-col items-center justify-center $***REMOVED***vistaActual === 'trabajos' ? 'text-pink-500' : 'text-gray-500'***REMOVED***`***REMOVED***
                >
                    <Briefcase size=***REMOVED***20***REMOVED*** />
                    <span className="text-xs mt-1">Trabajos</span>
                </button>

                <div className="flex justify-center items-start -mt-6">
                    <motion.button
                        onClick=***REMOVED***() => setVistaActual('calendario')***REMOVED***
                        className=***REMOVED***`
              bg-pink-500 text-white w-16 h-16 rounded-full 
              flex items-center justify-center shadow-lg 
              border-4 border-white
              $***REMOVED***vistaActual === 'calendario' ? 'border-pink-300' : 'border-white'***REMOVED***
            `***REMOVED***
                        whileTap=***REMOVED******REMOVED*** scale: 0.95 ***REMOVED******REMOVED***
                    >
                        <CalendarDays size=***REMOVED***28***REMOVED*** />
                    </motion.button>
                </div>

                <button
                    onClick=***REMOVED***() => setVistaActual('turnos')***REMOVED***
                    className=***REMOVED***`flex flex-col items-center justify-center $***REMOVED***vistaActual === 'turnos' ? 'text-pink-500' : 'text-gray-500'***REMOVED***`***REMOVED***
                >
                    <Calendar size=***REMOVED***20***REMOVED*** />
                    <span className="text-xs mt-1">Turnos</span>
                </button>

                <button
                    onClick=***REMOVED***() => setVistaActual('estadisticas')***REMOVED***
                    className=***REMOVED***`flex flex-col items-center justify-center $***REMOVED***vistaActual === 'estadisticas' ? 'text-pink-500' : 'text-gray-500'***REMOVED***`***REMOVED***
                >
                    <BarChart2 size=***REMOVED***20***REMOVED*** />
                    <span className="text-xs mt-1">Estadísticas</span>
                </button>
            </div>
        </nav>
    );
***REMOVED***;

export default Navegacion;