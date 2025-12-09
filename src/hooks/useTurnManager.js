// src/hooks/useTurnManager.js

import ***REMOVED*** useState ***REMOVED*** from 'react';

export const useTurnManager = () => ***REMOVED***
  const [modalAbierto, setModalAbierto] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [fechaInicial, setFechaInicial] = useState(null);

  const abrirModalNuevo = () => ***REMOVED***
    setTurnoSeleccionado(null);
    setFechaInicial(null);
    setModalAbierto(true);
  ***REMOVED***;

  const abrirModalEditar = (turno) => ***REMOVED***
    setTurnoSeleccionado(turno);
    setFechaInicial(null);
    setModalAbierto(true);
  ***REMOVED***;

  const abrirModalConFecha = (fecha) => ***REMOVED***
    setTurnoSeleccionado(null);
    setFechaInicial(fecha);
    setModalAbierto(true);
  ***REMOVED***;

  const cerrarModal = () => ***REMOVED***
    setModalAbierto(false);
    setTurnoSeleccionado(null);
    setFechaInicial(null);
  ***REMOVED***;

  return ***REMOVED***
    modalAbierto,
    turnoSeleccionado,
    fechaInicial,
    abrirModalNuevo,
    abrirModalEditar,
    abrirModalConFecha,
    cerrarModal
  ***REMOVED***;
***REMOVED***;