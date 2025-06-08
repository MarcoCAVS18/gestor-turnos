// src/hooks/useTurnManager.js

import ***REMOVED*** useState ***REMOVED*** from 'react';

export const useTurnManager = () => ***REMOVED***
  const [modalAbierto, setModalAbierto] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);

  const abrirModalNuevo = () => ***REMOVED***
    setTurnoSeleccionado(null);
    setModalAbierto(true);
  ***REMOVED***;

  const abrirModalEditar = (turno) => ***REMOVED***
    setTurnoSeleccionado(turno);
    setModalAbierto(true);
  ***REMOVED***;

  const cerrarModal = () => ***REMOVED***
    setModalAbierto(false);
    setTurnoSeleccionado(null);
  ***REMOVED***;

  return ***REMOVED***
    modalAbierto,
    turnoSeleccionado,
    abrirModalNuevo,
    abrirModalEditar,
    cerrarModal
  ***REMOVED***;
***REMOVED***;