import { useState, useCallback } from 'react';

const useModalManager = () => {
  const [modalTrabajoAbierto, setModalTrabajoAbierto] = useState(false);
  const [modalTurnoAbierto, setModalTurnoAbierto] = useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);

  const abrirModalNuevoTrabajo = useCallback(() => {
    setTrabajoSeleccionado(null);
    setModalTrabajoAbierto(true);
  }, []);

  const abrirModalNuevoTurno = useCallback(() => {
    setTurnoSeleccionado(null);
    setModalTurnoAbierto(true);
  }, []);

  const abrirModalEditarTrabajo = useCallback((trabajo) => {
    setTrabajoSeleccionado(trabajo);
    setModalTrabajoAbierto(true);
  }, []);

  const abrirModalEditarTurno = useCallback((turno) => {
    setTurnoSeleccionado(turno);
    setModalTurnoAbierto(true);
  }, []);

  const cerrarModalTrabajo = useCallback(() => {
    setModalTrabajoAbierto(false);
    setTrabajoSeleccionado(null);
  }, []);

  const cerrarModalTurno = useCallback(() => {
    setModalTurnoAbierto(false);
    setTurnoSeleccionado(null);
  }, []);

  return {
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
  };
};

export default useModalManager;