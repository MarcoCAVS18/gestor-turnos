// src/pages/CalendarioView.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** motion ***REMOVED*** from 'framer-motion';
import ***REMOVED*** CalendarDays, Plus ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../hooks/useThemeColors';
import PageHeader from '../components/layout/PageHeader';
import ***REMOVED*** fechaLocalAISO ***REMOVED*** from '../utils/calendarUtils';
import ***REMOVED*** createSafeDate ***REMOVED*** from '../utils/time';
import Calendario from '../components/calendar/Calendario';
import CalendarDaySummary from '../components/calendar/CalendarDaySummary';
import ModalTurno from '../components/modals/shift/ModalTurno';

import Loader from '../components/other/Loader';

const CalendarioView = () => ***REMOVED***
  const ***REMOVED*** turnosPorFecha, todosLosTrabajos, thematicColors, loading ***REMOVED*** = useApp();
  const colors = useThemeColors();
  
  // Estados para el calendario
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [fechaInicialModal, setFechaInicialModal] = useState(null);
  
  // Seleccionar automáticamente el día actual al cargar
  useEffect(() => ***REMOVED***
    const hoy = new Date();
    const fechaHoyStr = fechaLocalAISO(hoy);
    setFechaSeleccionada(fechaHoyStr);
  ***REMOVED***, []);

  if (loading) ***REMOVED***
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  ***REMOVED***
  
  // Validar que tenemos trabajos antes de mostrar funcionalidades
  const hayTrabajos = todosLosTrabajos && todosLosTrabajos.length > 0;
  
  // Obtener los turnos para la fecha seleccionada
  const turnosSeleccionados = fechaSeleccionada ? turnosPorFecha[fechaSeleccionada] || [] : [];
  
  // Función para formatear fecha
  const formatearFecha = (fechaStr) => ***REMOVED***
    const fecha = createSafeDate(fechaStr);
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    
    // Comparar fechas
    if (fecha.toDateString() === hoy.toDateString()) ***REMOVED***
      return 'Hoy';
    ***REMOVED*** else if (fecha.toDateString() === ayer.toDateString()) ***REMOVED***
      return 'Ayer';
    ***REMOVED*** else ***REMOVED***
      return fecha.toLocaleDateString('es-ES', ***REMOVED***
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***;

  // Función para seleccionar día en el calendario
  const seleccionarDia = (fecha) => ***REMOVED***
    // Convertir fecha a string formato YYYY-MM-DD
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    const fechaStr = `$***REMOVED***year***REMOVED***-$***REMOVED***month***REMOVED***-$***REMOVED***day***REMOVED***`;
    
    setFechaSeleccionada(fechaStr);
  ***REMOVED***;

  // Función mejorada para abrir modal con fecha
  const abrirModalNuevoTurno = (fecha) => ***REMOVED***
    setFechaInicialModal(fecha); 
    setModalAbierto(true);
  ***REMOVED***;

  const cerrarModal = () => ***REMOVED***
    setModalAbierto(false);
    setFechaInicialModal(null);
  ***REMOVED***;
  
  // Animaciones
  const calendarVariants = ***REMOVED***
    hidden: ***REMOVED*** opacity: 0, y: -20 ***REMOVED***,
    visible: ***REMOVED*** opacity: 1, y: 0, transition: ***REMOVED*** duration: 0.5, delay: 0.1 ***REMOVED*** ***REMOVED***
  ***REMOVED***;
  
  const detailsVariants = ***REMOVED***
    hidden: ***REMOVED*** opacity: 0, y: 20 ***REMOVED***,
    visible: ***REMOVED*** opacity: 1, y: 0, transition: ***REMOVED*** duration: 0.5, delay: 0.2 ***REMOVED*** ***REMOVED***
  ***REMOVED***;
  
  return (
    <div className="px-4 py-6 pb-32 space-y-6">
      <PageHeader
        title="Calendario de Turnos"
        subtitle=***REMOVED***hayTrabajos ? "Visualiza y gestiona tus turnos por fecha" : null***REMOVED***
        icon=***REMOVED***CalendarDays***REMOVED***
        action=***REMOVED***hayTrabajos && fechaSeleccionada && ***REMOVED***
          onClick: () => abrirModalNuevoTurno(createSafeDate(fechaSeleccionada)),
          icon: Plus,
          label: "Nuevo Turno",
          mobileLabel: "Nuevo",
          themeColor: colors.primary,
        ***REMOVED******REMOVED***
      />
      
      ***REMOVED***/* Mostrar mensaje si no hay trabajos */***REMOVED***
      ***REMOVED***!hayTrabajos && (
        <motion.div
          className="mb-4 p-4 rounded-lg border"
          style=***REMOVED******REMOVED***
            backgroundColor: thematicColors?.transparent10 || 'rgba(255, 193, 7, 0.1)',
            borderColor: thematicColors?.transparent20 || 'rgba(255, 193, 7, 0.2)'
          ***REMOVED******REMOVED***
          initial=***REMOVED******REMOVED*** opacity: 0 ***REMOVED******REMOVED***
          animate=***REMOVED******REMOVED*** opacity: 1 ***REMOVED******REMOVED***
        >
          <p style=***REMOVED******REMOVED*** color: thematicColors?.base || '#FFC107' ***REMOVED******REMOVED*** className="text-sm font-medium">
            Para usar el calendario, primero necesitas crear al menos un trabajo en la sección "Trabajos".
          </p>
        </motion.div>
      )***REMOVED***
      
      ***REMOVED***/* Calendario SIN CalendarSummary */***REMOVED***
      <motion.div
        variants=***REMOVED***calendarVariants***REMOVED***
        initial="hidden"
        animate="visible"
      >
        <Calendario onDiaSeleccionado=***REMOVED***seleccionarDia***REMOVED*** />
      </motion.div>
      
      ***REMOVED***/* Resumen del día seleccionado */***REMOVED***
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
      
      ***REMOVED***/* Modal para crear/editar turnos */***REMOVED***
      <ModalTurno 
        isOpen=***REMOVED***modalAbierto***REMOVED*** 
        onClose=***REMOVED***cerrarModal***REMOVED*** 
        fechaInicial=***REMOVED***fechaInicialModal***REMOVED***
      />
    </div>
  );
***REMOVED***;

export default CalendarioView;