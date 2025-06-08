// src/hooks/useWorkManager.js

import { useState } from 'react';

export const useWorkManager = (trabajos, borrarTrabajo) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null);
  const [modalCompartir, setModalCompartir] = useState(false);

  const abrirModalNuevo = () => {
    setTrabajoSeleccionado(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (trabajo) => {
    setTrabajoSeleccionado(trabajo);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setTrabajoSeleccionado(null);
  };

  const abrirModalCompartir = (trabajo) => {
    setTrabajoSeleccionado(trabajo);
    setModalCompartir(true);
  };

  const cerrarModalCompartir = () => {
    setModalCompartir(false);
    setTrabajoSeleccionado(null);
  };

  return {
    modalAbierto,
    trabajoSeleccionado,
    modalCompartir,
    abrirModalNuevo,
    abrirModalEditar,
    cerrarModal,
    abrirModalCompartir,
    cerrarModalCompartir
  };
};