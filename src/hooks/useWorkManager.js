// src/hooks/useWorkManager.js

import ***REMOVED*** useState ***REMOVED*** from 'react';

export const useWorkManager = (trabajos, borrarTrabajo) => ***REMOVED***
  const [modalAbierto, setModalAbierto] = useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null);
  const [modalCompartir, setModalCompartir] = useState(false);

  const abrirModalNuevo = () => ***REMOVED***
    setTrabajoSeleccionado(null);
    setModalAbierto(true);
  ***REMOVED***;

  const abrirModalEditar = (trabajo) => ***REMOVED***
    setTrabajoSeleccionado(trabajo);
    setModalAbierto(true);
  ***REMOVED***;

  const cerrarModal = () => ***REMOVED***
    setModalAbierto(false);
    setTrabajoSeleccionado(null);
  ***REMOVED***;

  const abrirModalCompartir = (trabajo) => ***REMOVED***
    setTrabajoSeleccionado(trabajo);
    setModalCompartir(true);
  ***REMOVED***;

  const cerrarModalCompartir = () => ***REMOVED***
    setModalCompartir(false);
    setTrabajoSeleccionado(null);
  ***REMOVED***;

  return ***REMOVED***
    modalAbierto,
    trabajoSeleccionado,
    modalCompartir,
    abrirModalNuevo,
    abrirModalEditar,
    cerrarModal,
    abrirModalCompartir,
    cerrarModalCompartir
  ***REMOVED***;
***REMOVED***;