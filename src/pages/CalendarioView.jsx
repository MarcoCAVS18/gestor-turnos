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
  
  console.log('📅 CalendarioView - Estado:', ***REMOVED***
    fechaSeleccionada,
    turnosPorFecha: Object.keys(turnosPorFecha || ***REMOVED******REMOVED***).length,
    todosLosTrabajos: todosLosTrabajos?.length || 0
  ***REMOVED***);
  
  // Obtener los turnos para la fecha seleccionada
  const turnosSeleccionados = fechaSeleccionada ? turnosPorFecha[fechaSeleccionada] || [] : [];
  
  console.log('📅 Turnos para fecha seleccionada:', ***REMOVED***
    fecha: fechaSeleccionada,
    cantidad: turnosSeleccionados.length,
    turnos: turnosSeleccionados.map(t => (***REMOVED***
      id: t.id,
      tipo: t.tipo,
      trabajoId: t.trabajoId,
      gananciaTotal: t.gananciaTotal
    ***REMOVED***))
  ***REMOVED***);
  
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