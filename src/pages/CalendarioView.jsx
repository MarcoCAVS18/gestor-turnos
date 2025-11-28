// src/pages/CalendarioView.jsx - Versión mejorada

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** motion ***REMOVED*** from 'framer-motion';
import ***REMOVED*** CalendarDays, Plus ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../hooks/useThemeColors';
import ***REMOVED*** fechaLocalAISO ***REMOVED*** from '../utils/calendarUtils';
import ***REMOVED*** createSafeDate ***REMOVED*** from '../utils/time';
import Calendario from '../components/calendar/Calendario';
import CalendarDaySummary from '../components/calendar/CalendarDaySummary';
import ModalTurno from '../components/modals/shift/ModalTurno';
import Button from '../components/ui/Button';

const CalendarioView = () => ***REMOVED***
  const ***REMOVED*** turnosPorFecha, todosLosTrabajos, thematicColors ***REMOVED*** = useApp();
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
  const headerVariants = ***REMOVED***
    hidden: ***REMOVED*** opacity: 0, y: -20 ***REMOVED***,
    visible: ***REMOVED*** opacity: 1, y: 0, transition: ***REMOVED*** duration: 0.3 ***REMOVED*** ***REMOVED***
  ***REMOVED***;

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
      ***REMOVED***/* Header consistente con otras páginas */***REMOVED***
      <motion.div
        className="flex justify-between items-center"
        variants=***REMOVED***headerVariants***REMOVED***
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center space-x-3">
          <div 
            className="p-2 rounded-lg"
            style=***REMOVED******REMOVED*** backgroundColor: colors.transparent10 ***REMOVED******REMOVED***
          >
            <CalendarDays 
              className="w-6 h-6" 
              style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
            />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Calendario de Turnos</h1>
            ***REMOVED***hayTrabajos && (
              <p className="text-sm text-gray-600">
                Visualiza y gestiona tus turnos por fecha
              </p>
            )***REMOVED***
          </div>
        </div>

        ***REMOVED***/* Botón de agregar turno - solo si hay trabajos */***REMOVED***
        ***REMOVED***hayTrabajos && fechaSeleccionada && (
          <Button
            onClick=***REMOVED***() => abrirModalNuevoTurno(createSafeDate(fechaSeleccionada))***REMOVED***
            className="flex items-center space-x-2 shadow-sm hover:shadow-md"
            icon=***REMOVED***Plus***REMOVED***
            themeColor=***REMOVED***colors.primary***REMOVED***
          >
            <span className="hidden sm:inline">Nuevo Turno</span>
            <span className="sm:hidden">Nuevo</span>
          </Button>
        )***REMOVED***
      </motion.div>
      
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