// src/pages/CalendarioView.jsx

import React, { useState, useEffect } from 'react';
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

import Loader from '../components/other/Loader';

const CalendarioView = () => {
  const { turnosPorFecha, todosLosTrabajos, thematicColors, loading } = useApp();
  const colors = useThemeColors();
  
  // Estados para el calendario
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [fechaInicialModal, setFechaInicialModal] = useState(null);
  
  // Seleccionar automáticamente el día actual al cargar
  useEffect(() => {
    const hoy = new Date();
    const fechaHoyStr = fechaLocalAISO(hoy);
    setFechaSeleccionada(fechaHoyStr);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }
  
  // Validar que tenemos trabajos antes de mostrar funcionalidades
  const hayTrabajos = todosLosTrabajos && todosLosTrabajos.length > 0;
  
  // Obtener los turnos para la fecha seleccionada
  const turnosSeleccionados = fechaSeleccionada ? turnosPorFecha[fechaSeleccionada] || [] : [];
  
  // Función para formatear fecha
  const formatearFecha = (fechaStr) => {
    const fecha = createSafeDate(fechaStr);
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    
    // Comparar fechas
    if (fecha.toDateString() === hoy.toDateString()) {
      return 'Hoy';
    } else if (fecha.toDateString() === ayer.toDateString()) {
      return 'Ayer';
    } else {
      return fecha.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  // Función para seleccionar día en el calendario
  const seleccionarDia = (fecha) => {
    // Convertir fecha a string formato YYYY-MM-DD
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    const fechaStr = `${year}-${month}-${day}`;
    
    setFechaSeleccionada(fechaStr);
  };

  // Función mejorada para abrir modal con fecha
  const abrirModalNuevoTurno = (fecha) => {
    setFechaInicialModal(fecha); 
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setFechaInicialModal(null);
  };
  
  // Animaciones
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
      <PageHeader
        title="Calendario de Turnos"
        subtitle={hayTrabajos ? "Visualiza y gestiona tus turnos por fecha" : null}
        icon={CalendarDays}
        action={hayTrabajos && fechaSeleccionada && {
          onClick: () => abrirModalNuevoTurno(createSafeDate(fechaSeleccionada)),
          icon: Plus,
          label: "Nuevo Turno",
          mobileLabel: "Nuevo",
          themeColor: colors.primary,
        }}
      />
      
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
      
      {/* Calendario SIN CalendarSummary */}
      <motion.div
        variants={calendarVariants}
        initial="hidden"
        animate="visible"
      >
        <Calendario onDiaSeleccionado={seleccionarDia} />
      </motion.div>
      
      {/* Resumen del día seleccionado */}
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
      
      {/* Modal para crear/editar turnos */}
      <ModalTurno 
        isOpen={modalAbierto} 
        onClose={cerrarModal} 
        fechaInicial={fechaInicialModal}
      />
    </div>
  );
};

export default CalendarioView;