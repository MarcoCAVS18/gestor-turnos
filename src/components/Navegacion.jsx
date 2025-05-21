// src/components/Navegacion.jsx

import React from 'react';
import ***REMOVED*** Home, Briefcase, Calendar, BarChart2, CalendarDays ***REMOVED*** from 'lucide-react';
import ***REMOVED*** motion ***REMOVED*** from 'framer-motion';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext'; 

const Navegacion = (***REMOVED*** vistaActual, setVistaActual ***REMOVED***) => ***REMOVED***
    // Obtener el color principal del contexto
    const ***REMOVED*** colorPrincipal ***REMOVED*** = useApp();
    
    // Función para generar estilos dinámicos basados en el estado activo
    const getActiveTextStyle = (vista) => ***REMOVED***
        return vistaActual === vista ? ***REMOVED*** color: colorPrincipal ***REMOVED*** : ***REMOVED*** color: '#6B7280' ***REMOVED***; // gray-500
    ***REMOVED***;
    
    // Estilos dinámicos para el botón central
    const calendarButtonStyle = ***REMOVED***
        backgroundColor: colorPrincipal,
        borderColor: vistaActual === 'calendario' ? colorPrincipal + '80' : 'white' // Añadir transparencia al color para el borde
    ***REMOVED***;
    
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg px-4 py-6 z-10">
            <div className="grid grid-cols-5 items-center max-w-md mx-auto">
                <button
                    onClick=***REMOVED***() => setVistaActual('dashboard')***REMOVED***
                    className="flex flex-col items-center justify-center"
                    style=***REMOVED***getActiveTextStyle('dashboard')***REMOVED***
                >
                    <Home size=***REMOVED***20***REMOVED*** />
                    <span className="text-xs mt-1">Inicio</span>
                </button>

                <button
                    onClick=***REMOVED***() => setVistaActual('trabajos')***REMOVED***
                    className="flex flex-col items-center justify-center"
                    style=***REMOVED***getActiveTextStyle('trabajos')***REMOVED***
                >
                    <Briefcase size=***REMOVED***20***REMOVED*** />
                    <span className="text-xs mt-1">Trabajos</span>
                </button>

                <div className="flex justify-center items-start -mt-6">
                    <motion.button
                        onClick=***REMOVED***() => setVistaActual('calendario')***REMOVED***
                        className="text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4"
                        style=***REMOVED***calendarButtonStyle***REMOVED***
                        whileTap=***REMOVED******REMOVED*** scale: 0.95 ***REMOVED******REMOVED***
                    >
                        <CalendarDays size=***REMOVED***28***REMOVED*** />
                    </motion.button>
                </div>

                <button
                    onClick=***REMOVED***() => setVistaActual('turnos')***REMOVED***
                    className="flex flex-col items-center justify-center"
                    style=***REMOVED***getActiveTextStyle('turnos')***REMOVED***
                >
                    <Calendar size=***REMOVED***20***REMOVED*** />
                    <span className="text-xs mt-1">Turnos</span>
                </button>

                <button
                    onClick=***REMOVED***() => setVistaActual('estadisticas')***REMOVED***
                    className="flex flex-col items-center justify-center"
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