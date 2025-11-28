import ***REMOVED*** useState, useCallback ***REMOVED*** from 'react';

const useModalManager = () => ***REMOVED***
  const [modalTrabajoAbierto, setModalTrabajoAbierto] = useState(false);
  const [modalTurnoAbierto, setModalTurnoAbierto] = useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);

  const abrirModalNuevoTrabajo = useCallback(() => ***REMOVED***
    setTrabajoSeleccionado(null);
    setModalTrabajoAbierto(true);
  ***REMOVED***, []);

  const abrirModalNuevoTurno = useCallback(() => ***REMOVED***
    setTurnoSeleccionado(null);
    setModalTurnoAbierto(true);
  ***REMOVED***, []);

  const abrirModalEditarTrabajo = useCallback((trabajo) => ***REMOVED***
    setTrabajoSeleccionado(trabajo);
    setModalTrabajoAbierto(true);
  ***REMOVED***, []);

  const abrirModalEditarTurno = useCallback((turno) => ***REMOVED***
    setTurnoSeleccionado(turno);
    setModalTurnoAbierto(true);
  ***REMOVED***, []);

  const cerrarModalTrabajo = useCallback(() => ***REMOVED***
    setModalTrabajoAbierto(false);
    setTrabajoSeleccionado(null);
  ***REMOVED***, []);

  const cerrarModalTurno = useCallback(() => ***REMOVED***
    setModalTurnoAbierto(false);
    setTurnoSeleccionado(null);
  ***REMOVED***, []);

  return ***REMOVED***
    modalTrabajoAbierto,
    modalTurnoAbierto,
    trabajoSeleccionado,
    turnoSeleccionado,
    abrirModalNuevoTrabajo,
    abrirModalNuevoTurno,
    abrirModalEditarTrabajo,
    abrirModalEditarTurno,
    cerrarModalTrabajo,
    cerrarModalTurno,
  ***REMOVED***;
***REMOVED***;

export default useModalManager;