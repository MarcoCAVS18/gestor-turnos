// src/hooks/useTurnManager.js

import { useState } from 'react';

export const useTurnManager = () => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);

  const abrirModalNuevo = () => {
    setTurnoSeleccionado(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (turno) => {
    setTurnoSeleccionado(turno);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setTurnoSeleccionado(null);
  };

  return {
    modalAbierto,
    turnoSeleccionado,
    abrirModalNuevo,
    abrirModalEditar,
    cerrarModal
  };
};