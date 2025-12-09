// src/pages/CalendarioView.jsx

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Plus } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useThemeColors } from '../hooks/useThemeColors';
import PageHeader from '../components/layout/PageHeader';
import { fechaLocalAISO } from '../utils/calendarUtils';
import { createSafeDate } from '../utils/time';
import Calendario from '../components/calendar/Calendario';
import CalendarDaySummary from '../components/calendar/CalendarDaySummary';
import ModalTurno from '../components/modals/shift/ModalTurno';
import { useTurnManager } from '../hooks/useTurnManager';
import { useDeleteManager } from '../hooks/useDeleteManager';
import AlertaEliminacion from '../components/alerts/AlertaEliminacion';
import Loader from '../components/other/Loader';

const CalendarioView = () => {
  const { turnosPorFecha, todosLosTrabajos, thematicColors, loading, eliminarTurno } = useApp();
  const colors = useThemeColors();
  
  const hayTrabajos = todosLosTrabajos && todosLosTrabajos.length > 0;
  
  const [fechaSeleccionada, setFechaSeleccionada] = useState(fechaLocalAISO(createSafeDate(new Date())));

  const turnosSeleccionados = useMemo(() => 
    fechaSeleccionada ? (turnosPorFecha[fechaSeleccionada] || []) : [], 
    [turnosPorFecha, fechaSeleccionada]
  );

  const { 
    modalAbierto, 
    turnoSeleccionado, 
    fechaInicial,
    abrirModalEditar,
    abrirModalConFecha,
    cerrarModal 
  } = useTurnManager();
  
  const { 
    showDeleteModal,
    itemToDelete, // NEW: Get itemToDelete for summary
    deleting,
    startDeletion,
    cancelDeletion,
    confirmDeletion
  } = useDeleteManager(eliminarTurno);
  
  const formatearFecha = useCallback((fechaStr) => {
    const fecha = createSafeDate(fechaStr);
    
    // Explicitly check for invalid date object
    if (isNaN(fecha.getTime())) {
      console.error('Invalid Date object created by createSafeDate for input:', fechaStr);
      return 'Fecha no válida'; // Fallback for genuinely invalid dates
    }
    
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    
    const baseFormattedDate = fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (fecha.toDateString() === hoy.toDateString()) {
      return `Hoy, ${baseFormattedDate}`;
    }
    if (fecha.toDateString() === ayer.toDateString()) {
      return `Ayer, ${baseFormattedDate}`;
    }
    
    return baseFormattedDate;
  }, []);
  
  // NEW: Format itemToDelete for summary display
  const detallesEliminacion = useMemo(() => {
    if (!itemToDelete) return [];
    
    const trabajo = todosLosTrabajos.find(t => t.id === itemToDelete.trabajoId);
    const nombreTrabajo = trabajo ? trabajo.nombre : 'Trabajo desconocido';
    
    return [
      `Turno de ${nombreTrabajo}`,
      `Fecha: ${formatearFecha(itemToDelete.fechaInicio)}`,
      `Horario: ${itemToDelete.horaInicio} - ${itemToDelete.horaFin}`
    ];
  }, [itemToDelete, todosLosTrabajos, formatearFecha]);

  const seleccionarDia = (fecha) => {
    setFechaSeleccionada(fechaLocalAISO(fecha));
  };

  const onNuevoTurno = (fecha) => {
    abrirModalConFecha(fecha);
  };
  
  const calendarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } }
  };
  
  const detailsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
  };
  
  return (
    <div className="px-4 py-6 pb-32 space-y-6">
      {loading && <Loader />}
      <PageHeader
        title="Calendario"
        subtitle={hayTrabajos ? "Visualiza y gestiona tus turnos por fecha" : null}
        icon={CalendarDays}
        action={hayTrabajos && fechaSeleccionada && {
          onClick: () => onNuevoTurno(createSafeDate(fechaSeleccionada)),
          icon: Plus,
          label: "Nuevo Turno",
          mobileLabel: "Nuevo",
          themeColor: colors.primary,
        }}
      />
      
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
          onNuevoTurno={onNuevoTurno}
          onEdit={abrirModalEditar}
          onDelete={startDeletion}
        />
      </motion.div>
      
      <ModalTurno 
        isOpen={modalAbierto} 
        onClose={cerrarModal} 
        turno={turnoSeleccionado}
        fechaInicial={fechaInicial}
      />
      
      <AlertaEliminacion
        visible={showDeleteModal}
        onCancel={cancelDeletion}
        onConfirm={confirmDeletion}
        eliminando={deleting}
        tipo="turno"
        detalles={detallesEliminacion} // NEW: Pass formatted details
      />
    </div>
  );
};
export default CalendarioView;