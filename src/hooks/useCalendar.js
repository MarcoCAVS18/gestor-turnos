// src/hooks/useCalendar.js

import ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** createSafeDate ***REMOVED*** from '../utils/time';

export const useCalendar = () => ***REMOVED***
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoTurnoFecha, setNuevoTurnoFecha] = useState(null);

  // Función para convertir fecha local a ISO
  const fechaLocalAISO = (fecha) => ***REMOVED***
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `$***REMOVED***year***REMOVED***-$***REMOVED***month***REMOVED***-$***REMOVED***day***REMOVED***`;
  ***REMOVED***;

  // Formatear fecha para mostrar
  const formatearFecha = (fechaStr) => ***REMOVED***
    const fecha = createSafeDate(fechaStr);
    return fecha.toLocaleDateString('es-ES', ***REMOVED***
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    ***REMOVED***);
  ***REMOVED***;

  const seleccionarDia = (fecha) => ***REMOVED***
    const fechaStr = fechaLocalAISO(fecha);
    setFechaSeleccionada(fechaStr);
  ***REMOVED***;

  const abrirModalNuevoTurno = (fecha) => ***REMOVED***
    const fechaISO = fechaLocalAISO(fecha);
    setNuevoTurnoFecha(fechaISO);
    setModalAbierto(true);
  ***REMOVED***;

  const cerrarModal = () => ***REMOVED***
    setModalAbierto(false);
    setNuevoTurnoFecha(null);
  ***REMOVED***;

  return ***REMOVED***
    fechaSeleccionada,
    modalAbierto,
    nuevoTurnoFecha,
    seleccionarDia,
    abrirModalNuevoTurno,
    cerrarModal,
    formatearFecha,
    fechaLocalAISO
  ***REMOVED***;
***REMOVED***;