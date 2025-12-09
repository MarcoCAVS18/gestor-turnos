// src/hooks/useTurnManager.js

import { useState } from 'react';

export const useTurnManager = () => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [fechaInicial, setFechaInicial] = useState(null);

  const abrirModalNuevo = () => {
    setTurnoSeleccionado(null);
    setFechaInicial(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (turno) => {
    setTurnoSeleccionado(turno);
    setFechaInicial(null);
    setModalAbierto(true);
  };

  const abrirModalConFecha = (fecha) => {
    setTurnoSeleccionado(null);
    setFechaInicial(fecha);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setTurnoSeleccionado(null);
    setFechaInicial(null);
  };

  return {
    modalAbierto,
    turnoSeleccionado,
    fechaInicial,
    abrirModalNuevo,
    abrirModalEditar,
    abrirModalConFecha,
    cerrarModal
  };
};