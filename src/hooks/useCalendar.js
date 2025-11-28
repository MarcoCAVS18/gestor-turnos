// src/hooks/useCalendar.js

import { useState } from 'react';
import { createSafeDate } from '../utils/time';

export const useCalendar = () => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoTurnoFecha, setNuevoTurnoFecha] = useState(null);

  // Función para convertir fecha local a ISO
  const fechaLocalAISO = (fecha) => {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Formatear fecha para mostrar
  const formatearFecha = (fechaStr) => {
    const fecha = createSafeDate(fechaStr);
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const seleccionarDia = (fecha) => {
    const fechaStr = fechaLocalAISO(fecha);
    setFechaSeleccionada(fechaStr);
  };

  const abrirModalNuevoTurno = (fecha) => {
    const fechaISO = fechaLocalAISO(fecha);
    setNuevoTurnoFecha(fechaISO);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setNuevoTurnoFecha(null);
  };

  return {
    fechaSeleccionada,
    modalAbierto,
    nuevoTurnoFecha,
    seleccionarDia,
    abrirModalNuevoTurno,
    cerrarModal,
    formatearFecha,
    fechaLocalAISO
  };
};