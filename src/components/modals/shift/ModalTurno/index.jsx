// src/components/modals/shift/ModalTurno/index.jsx - Refactorizado con BaseModal

import React, { useState, useEffect, useMemo, useId } from 'react';
import { useApp } from '../../../../contexts/AppContext';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { createSafeDate } from '../../../../utils/time';
import BaseModal from '../../base/BaseModal';
import TurnoForm from '../../../forms/shift/TurnoForm';
import TurnoDeliveryForm from '../../../forms/shift/TurnoDeliveryForm';

const ModalTurno = ({ isOpen, onClose, turno, trabajoId, fechaInicial }) => {
  const {
    addShift,
    editShift,
    addDeliveryShift,
    editDeliveryShift,
    trabajos,
    trabajosDelivery
  } = useApp();

  const [trabajoSeleccionadoId, setTrabajoSeleccionadoId] = useState(trabajoId || '');
  const [formularioTipo, setFormularioTipo] = useState('tradicional');
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();
  const formId = useId();

  // Combinar todos los trabajos para el selector
  const todosLosTrabajos = useMemo(() => {
    return [...trabajos, ...trabajosDelivery];
  }, [trabajos, trabajosDelivery]);

  // Determinar el tipo de formulario basado en el trabajo
  useEffect(() => {
    if (turno?.tipo === 'delivery') {
      setFormularioTipo('delivery');
      return;
    }

    if (trabajoSeleccionadoId) {
      const trabajo = todosLosTrabajos.find(t => t.id === trabajoSeleccionadoId);

      if (trabajo) {
        const esDelivery = trabajo.tipo === 'delivery' || trabajo.type === 'delivery';
        const nuevoTipo = esDelivery ? 'delivery' : 'tradicional';

        if (formularioTipo !== nuevoTipo) {
          setFormularioTipo(nuevoTipo);
        }
      } else {
        setFormularioTipo('tradicional');
      }
    } else {
      setFormularioTipo('tradicional');
    }
  }, [trabajoSeleccionadoId, todosLosTrabajos, turno, formularioTipo]);

  // Reset cuando se abre/cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setTrabajoSeleccionadoId('');
      setFormularioTipo('tradicional');
      setLoading(false);
    } else if (turno) {
      setTrabajoSeleccionadoId(turno.trabajoId || '');
    } else if (trabajoId) {
      setTrabajoSeleccionadoId(trabajoId);
    }
  }, [isOpen, turno, trabajoId]);

  const manejarGuardado = async (datosTurno) => {
    try {
      setLoading(true);

      // Si fechaInicial está disponible y no hay turno (es nuevo), usar fechaInicial
      let datosFinales = { ...datosTurno };

      if (fechaInicial && !turno) {
        let fechaStr;
        if (fechaInicial instanceof Date) {
          const year = fechaInicial.getFullYear();
          const month = String(fechaInicial.getMonth() + 1).padStart(2, '0');
          const day = String(fechaInicial.getDate()).padStart(2, '0');
          fechaStr = `${year}-${month}-${day}`;
        } else {
          fechaStr = fechaInicial;
        }

        if (!datosFinales.fechaInicio && !datosFinales.fecha) {
          datosFinales.fechaInicio = fechaStr;
        }
      }

      if (formularioTipo === 'delivery') {
        if (turno) {
          await editDeliveryShift(turno.id, datosFinales);
        } else {
          await addDeliveryShift(datosFinales);
        } 
      } else {
        if (turno) {
          await editShift(turno.id, datosFinales);
        } else {
          await addShift(datosFinales);
        }
      }

      setLoading(false);
      onClose();
    } catch (error) {
      console.error('Error al guardar turno:', error);
      setLoading(false);
    }
  };

  const manejarCambioTrabajo = (nuevoTrabajoId) => {
    setTrabajoSeleccionadoId(nuevoTrabajoId);
  };

  const manejarCerrar = () => {
    setTrabajoSeleccionadoId('');
    setFormularioTipo('tradicional');
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  // Construir título
  const titulo = turno ? 'Editar Turno' : 'Nuevo Turno';
  const subtitulo = formularioTipo === 'delivery' ? '• Delivery' : null;

  // Formatear fecha inicial si existe
  let fechaSubtitle = null;
  if (fechaInicial && !turno) {
    fechaSubtitle = fechaInicial instanceof Date
      ? fechaInicial.toLocaleDateString('es-ES', {
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        })
      : createSafeDate(fechaInicial).toLocaleDateString('es-ES', {
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        });
  }

  const subtituloFinal = [subtitulo, fechaSubtitle].filter(Boolean).join(' ');

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={manejarCerrar}
      title={titulo}
      subtitle={subtituloFinal || undefined}
      loading={loading}
      maxWidth="md"
      showActions={true}
      onCancel={manejarCerrar}
      formId={formId}
      saveText={turno ? 'Guardar Cambios' : 'Crear Turno'}
    >
      {formularioTipo === 'delivery' ? (
        <TurnoDeliveryForm
          id={formId}
          turno={turno}
          trabajoId={trabajoSeleccionadoId}
          trabajos={todosLosTrabajos}
          onSubmit={manejarGuardado}
          onTrabajoChange={manejarCambioTrabajo}
          isMobile={isMobile}
          fechaInicial={fechaInicial}
        />
      ) : (
        <TurnoForm
          id={formId}
          turno={turno}
          trabajoId={trabajoSeleccionadoId}
          trabajos={todosLosTrabajos}
          onSubmit={manejarGuardado}
          onTrabajoChange={manejarCambioTrabajo}
          isMobile={isMobile}
          fechaInicial={fechaInicial}
        />
      )}
    </BaseModal>
  );
};

export default ModalTurno;
