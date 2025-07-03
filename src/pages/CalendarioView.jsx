// src/pages/CalendarioView.jsx

import React from 'react';
import ***REMOVED*** motion ***REMOVED*** from 'framer-motion';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** useCalendar ***REMOVED*** from '../hooks/useCalendar';
import Calendario from '../components/calendar/Calendario';
import CalendarDaySummary from '../components/calendar/CalendarDaySummary';
import ModalTurno from '../components/modals/ModalTurno';

const CalendarioView = () => ***REMOVED***
  const ***REMOVED*** turnosPorFecha, todosLosTrabajos ***REMOVED*** = useApp();
  const ***REMOVED***
    fechaSeleccionada,
    modalAbierto,
    nuevoTurnoFecha,
    seleccionarDia,
    abrirModalNuevoTurno,
    cerrarModal,
    formatearFecha
  ***REMOVED*** = useCalendar();
  
  // Validar que tenemos trabajos antes de mostrar funcionalidades
  const hayTrabajos = todosLosTrabajos && todosLosTrabajos.length > 0;
  
  // Obtener los turnos para la fecha seleccionada
  const turnosSeleccionados = fechaSeleccionada ? turnosPorFecha[fechaSeleccionada] || [] : [];
  
  // Animaciones
  const calendarVariants = ***REMOVED***
    hidden: ***REMOVED*** opacity: 0, y: -20 ***REMOVED***,
    visible: ***REMOVED*** opacity: 1, y: 0, transition: ***REMOVED*** duration: 0.5 ***REMOVED*** ***REMOVED***
  ***REMOVED***;
  
  const detailsVariants = ***REMOVED***
    hidden: ***REMOVED*** opacity: 0, y: 20 ***REMOVED***,
    visible: ***REMOVED*** opacity: 1, y: 0, transition: ***REMOVED*** duration: 0.5, delay: 0.2 ***REMOVED*** ***REMOVED***
  ***REMOVED***;
  
  return (
    <div className="px-4 py-6">
      <motion.h2 
        className="text-xl font-semibold mb-4"
        initial=***REMOVED******REMOVED*** opacity: 0, x: -20 ***REMOVED******REMOVED***
        animate=***REMOVED******REMOVED*** opacity: 1, x: 0 ***REMOVED******REMOVED***
        transition=***REMOVED******REMOVED*** duration: 0.3 ***REMOVED******REMOVED***
      >
        Calendario de Turnos
      </motion.h2>
      
      ***REMOVED***/* Mostrar mensaje si no hay trabajos */***REMOVED***
      ***REMOVED***!hayTrabajos && (
        <motion.div
          className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg"
          initial=***REMOVED******REMOVED*** opacity: 0 ***REMOVED******REMOVED***
          animate=***REMOVED******REMOVED*** opacity: 1 ***REMOVED******REMOVED***
        >
          <p className="text-amber-800 text-sm">
            Para usar el calendario, primero necesitas crear al menos un trabajo en la sección "Trabajos".
          </p>
        </motion.div>
      )***REMOVED***
      
      <motion.div
        variants=***REMOVED***calendarVariants***REMOVED***
        initial="hidden"
        animate="visible"
      >
        <Calendario onDiaSeleccionado=***REMOVED***seleccionarDia***REMOVED*** />
      </motion.div>
      
      <motion.div
        variants=***REMOVED***detailsVariants***REMOVED***
        initial="hidden"
        animate="visible"
      >
        <CalendarDaySummary
          fechaSeleccionada=***REMOVED***fechaSeleccionada***REMOVED***
          turnos=***REMOVED***turnosSeleccionados***REMOVED***
          formatearFecha=***REMOVED***formatearFecha***REMOVED***
          onNuevoTurno=***REMOVED***abrirModalNuevoTurno***REMOVED***
        />
      </motion.div>
      
      <ModalTurno 
        isOpen=***REMOVED***modalAbierto***REMOVED*** 
        onClose=***REMOVED***cerrarModal***REMOVED*** 
        fechaInicial=***REMOVED***nuevoTurnoFecha***REMOVED***
      />
    </div>
  );
***REMOVED***;

export default CalendarioView;