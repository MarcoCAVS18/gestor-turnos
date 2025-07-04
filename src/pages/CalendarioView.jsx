// src/pages/CalendarioView.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { useCalendar } from '../hooks/useCalendar';
import Calendario from '../components/calendar/Calendario';
import CalendarDaySummary from '../components/calendar/CalendarDaySummary';
import ModalTurno from '../components/modals/ModalTurno';

const CalendarioView = () => {
  const { turnosPorFecha, todosLosTrabajos, thematicColors } = useApp();
  const {
    fechaSeleccionada,
    modalAbierto,
    nuevoTurnoFecha,
    seleccionarDia,
    abrirModalNuevoTurno,
    cerrarModal,
    formatearFecha
  } = useCalendar();
  
  // Validar que tenemos trabajos antes de mostrar funcionalidades
  const hayTrabajos = todosLosTrabajos && todosLosTrabajos.length > 0;
  
  // Obtener los turnos para la fecha seleccionada
  const turnosSeleccionados = fechaSeleccionada ? turnosPorFecha[fechaSeleccionada] || [] : [];
  
  // Animaciones
  const calendarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const detailsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
  };
  
  return (
    <div className="px-4 py-6">
      <motion.h2 
        className="text-xl font-semibold mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        Calendario de Turnos
      </motion.h2>
      
      {/* Mostrar mensaje si no hay trabajos */}
      {!hayTrabajos && (
        <motion.div
          className="mb-4 p-4 rounded-lg border"
          style={{
            backgroundColor: thematicColors?.transparent10 || 'rgba(255, 193, 7, 0.1)',
            borderColor: thematicColors?.transparent20 || 'rgba(255, 193, 7, 0.2)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p style={{ color: thematicColors?.base || '#FFC107' }} className="text-sm font-medium">
            Para usar el calendario, primero necesitas crear al menos un trabajo en la sección "Trabajos".
          </p>
        </motion.div>
      )}
      
      <motion.div
        variants={calendarVariants}
        initial="hidden"
        animate="visible"
      >
        <Calendario onDiaSeleccionado={seleccionarDia} />
      </motion.div>
      
      <motion.div
        variants={detailsVariants}
        initial="hidden"
        animate="visible"
      >
        <CalendarDaySummary
          fechaSeleccionada={fechaSeleccionada}
          turnos={turnosSeleccionados}
          formatearFecha={formatearFecha}
          onNuevoTurno={abrirModalNuevoTurno}
        />
      </motion.div>
      
      <ModalTurno 
        isOpen={modalAbierto} 
        onClose={cerrarModal} 
        fechaInicial={nuevoTurnoFecha}
      />
    </div>
  );
};

export default CalendarioView;