// src/components/modals/work/ModalTrabajo/index.jsx - Refactorizado con BaseModal

import React, { useState, useEffect, useId } from 'react';
import { Pen, Plus } from 'lucide-react';
import { useApp } from '../../../../contexts/AppContext';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import BaseModal from '../../base/BaseModal';
import TrabajoForm from '../../../forms/work/TrabajoForm';
import SelectorTipoTrabajo from '../../base/SelectorTipoTrabajo';
import ModalTrabajoDelivery from '../ModalTrabajoDelivery';

const ModalTrabajo = ({ isOpen, onClose, trabajo }) => {
  const { addJob, editJob, deliveryEnabled } = useApp();
  const isMobile = useIsMobile();
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const formId = useId();

  // Determinar si mostrar selector
  useEffect(() => {
    if (isOpen && !trabajo && deliveryEnabled) {
      setMostrarSelector(true);
      setTipoSeleccionado(null);
    } else {
      setMostrarSelector(false);
      if (isOpen && !trabajo && !deliveryEnabled) {
        setTipoSeleccionado('tradicional');
      }
    }
  }, [isOpen, trabajo, deliveryEnabled]);

  const manejarSeleccionTipo = (tipo) => {
    setTipoSeleccionado(tipo);
    setMostrarSelector(false);
  };

  const manejarGuardado = async (datosTrabajo) => {
    try {
      setLoading(true);

      if (trabajo) {
        await editJob(trabajo.id, datosTrabajo);
      } else {
        await addJob(datosTrabajo);
      }

      setTipoSeleccionado(null);
      setMostrarSelector(false);
      setLoading(false);
      onClose();
    } catch (error) {
      setLoading(false);
    }
  };

  const manejarCerrar = () => {
    setTipoSeleccionado(null);
    setMostrarSelector(false);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  // Si es un trabajo de delivery existente, usar el modal de delivery directamente
  if (trabajo && trabajo.tipo === 'delivery') {
    return (
      <ModalTrabajoDelivery
        isOpen={true}
        onClose={manejarCerrar}
        trabajo={trabajo}
      />
    );
  }

  // Si se seleccionó delivery como tipo
  if (tipoSeleccionado === 'delivery') {
    return (
      <ModalTrabajoDelivery
        isOpen={true}
        onClose={manejarCerrar}
        trabajo={null}
      />
    );
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={manejarCerrar}
      title={trabajo ? 'Editar Trabajo' : 'Nuevo Trabajo'}
      icon={trabajo ? Pen : Plus}
      loading={loading}
      maxWidth="lg"
      showActions={!mostrarSelector}
      onCancel={manejarCerrar}
      formId={formId}
      saveText={trabajo ? 'Guardar Cambios' : 'Crear Trabajo'}
    >
      {mostrarSelector ? (
        <SelectorTipoTrabajo
          onSelectTipo={manejarSeleccionTipo}
          isMobile={isMobile}
        />
      ) : (
        <TrabajoForm
          id={formId}
          trabajo={trabajo}
          onSubmit={manejarGuardado}
          isMobile={isMobile}
        />
      )}
    </BaseModal>
  );
};

export default ModalTrabajo;
