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
import ***REMOVED*** useTurnManager ***REMOVED*** from '../hooks/useTurnManager';
import ***REMOVED*** useDeleteManager ***REMOVED*** from '../hooks/useDeleteManager';
import AlertaEliminacion from '../components/alerts/AlertaEliminacion';

import Loader from '../components/other/Loader';

const CalendarioView = () => ***REMOVED***
  const ***REMOVED*** turnosPorFecha, todosLosTrabajos, thematicColors, loading, eliminarTurno ***REMOVED*** = useApp();
  const colors = useThemeColors();
  
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  const ***REMOVED*** 
    modalAbierto, 
    turnoSeleccionado, 
    fechaInicial,
    abrirModalEditar,
    abrirModalConFecha,
    cerrarModal 
  ***REMOVED*** = useTurnManager();
  
  const ***REMOVED*** 
    showDeleteModal,
    deleting,
    startDeletion,
    cancelDeletion,
    confirmDeletion
  ***REMOVED*** = useDeleteManager(eliminarTurno);
  
  useEffect(() => ***REMOVED***
    const hoy = new Date();
    setFechaSeleccionada(fechaLocalAISO(hoy));
  ***REMOVED***, []);

  if (loading) ***REMOVED***
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  ***REMOVED***
  
  const hayTrabajos = todosLosTrabajos && todosLosTrabajos.length > 0;
  const turnosSeleccionados = fechaSeleccionada ? turnosPorFecha[fechaSeleccionada] || [] : [];
  
  const formatearFecha = (fechaStr) => ***REMOVED***
    const fecha = createSafeDate(fechaStr);
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    
    if (fecha.toDateString() === hoy.toDateString()) return 'Hoy';
    if (fecha.toDateString() === ayer.toDateString()) return 'Ayer';
    
    return fecha.toLocaleDateString('es-ES', ***REMOVED***
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    ***REMOVED***);
  ***REMOVED***;

  const seleccionarDia = (fecha) => ***REMOVED***
    setFechaSeleccionada(fechaLocalAISO(fecha));
  ***REMOVED***;

  const onNuevoTurno = (fecha) => ***REMOVED***
    abrirModalConFecha(fecha);
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
      <PageHeader
        title="Calendario"
        subtitle=***REMOVED***hayTrabajos ? "Visualiza y gestiona tus turnos por fecha" : null***REMOVED***
        icon=***REMOVED***CalendarDays***REMOVED***
        action=***REMOVED***hayTrabajos && fechaSeleccionada && ***REMOVED***
          onClick: () => onNuevoTurno(createSafeDate(fechaSeleccionada)),
          icon: Plus,
          label: "Nuevo Turno",
          mobileLabel: "Nuevo",
          themeColor: colors.primary,
        ***REMOVED******REMOVED***
      />
      
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
          onNuevoTurno=***REMOVED***onNuevoTurno***REMOVED***
          onEdit=***REMOVED***abrirModalEditar***REMOVED***
          onDelete=***REMOVED***startDeletion***REMOVED***
        />
      </motion.div>
      
      <ModalTurno 
        isOpen=***REMOVED***modalAbierto***REMOVED*** 
        onClose=***REMOVED***cerrarModal***REMOVED*** 
        turno=***REMOVED***turnoSeleccionado***REMOVED***
        fechaInicial=***REMOVED***fechaInicial***REMOVED***
      />
      
      <AlertaEliminacion
        visible=***REMOVED***showDeleteModal***REMOVED***
        onCancel=***REMOVED***cancelDeletion***REMOVED***
        onConfirm=***REMOVED***confirmDeletion***REMOVED***
        eliminando=***REMOVED***deleting***REMOVED***
        tipo="turno"
      />
    </div>
  );
***REMOVED***;
export default CalendarioView;