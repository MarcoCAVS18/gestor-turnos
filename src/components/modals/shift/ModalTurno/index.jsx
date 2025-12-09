// src/components/modals/shift/ModalTurno/index.jsx - Refactorizado con BaseModal

import React, ***REMOVED*** useState, useEffect, useMemo, useId ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../../contexts/AppContext';
import ***REMOVED*** useIsMobile ***REMOVED*** from '../../../../hooks/useIsMobile';
import ***REMOVED*** createSafeDate ***REMOVED*** from '../../../../utils/time';
import BaseModal from '../../base/BaseModal';
import TurnoForm from '../../../forms/shift/TurnoForm';
import TurnoDeliveryForm from '../../../forms/shift/TurnoDeliveryForm';

const ModalTurno = (***REMOVED*** isOpen, onClose, turno, trabajoId, fechaInicial ***REMOVED***) => ***REMOVED***
  const ***REMOVED***
    addShift,
    editShift,
    addDeliveryShift,
    editDeliveryShift,
    trabajos,
    trabajosDelivery
  ***REMOVED*** = useApp();

  const [trabajoSeleccionadoId, setTrabajoSeleccionadoId] = useState(trabajoId || '');
  const [formularioTipo, setFormularioTipo] = useState('tradicional');
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();
  const formId = useId();

  // Combinar todos los trabajos para el selector
  const todosLosTrabajos = useMemo(() => ***REMOVED***
    return [...trabajos, ...trabajosDelivery];
  ***REMOVED***, [trabajos, trabajosDelivery]);

  // Determinar el tipo de formulario basado en el trabajo
  useEffect(() => ***REMOVED***
    if (turno?.tipo === 'delivery') ***REMOVED***
      setFormularioTipo('delivery');
      return;
    ***REMOVED***

    if (trabajoSeleccionadoId) ***REMOVED***
      const trabajo = todosLosTrabajos.find(t => t.id === trabajoSeleccionadoId);

      if (trabajo) ***REMOVED***
        const esDelivery = trabajo.tipo === 'delivery' || trabajo.type === 'delivery';
        const nuevoTipo = esDelivery ? 'delivery' : 'tradicional';

        if (formularioTipo !== nuevoTipo) ***REMOVED***
          setFormularioTipo(nuevoTipo);
        ***REMOVED***
      ***REMOVED*** else ***REMOVED***
        setFormularioTipo('tradicional');
      ***REMOVED***
    ***REMOVED*** else ***REMOVED***
      setFormularioTipo('tradicional');
    ***REMOVED***
  ***REMOVED***, [trabajoSeleccionadoId, todosLosTrabajos, turno, formularioTipo]);

  // Reset cuando se abre/cierra el modal
  useEffect(() => ***REMOVED***
    if (!isOpen) ***REMOVED***
      setTrabajoSeleccionadoId('');
      setFormularioTipo('tradicional');
      setLoading(false);
    ***REMOVED*** else if (turno) ***REMOVED***
      setTrabajoSeleccionadoId(turno.trabajoId || '');
    ***REMOVED*** else if (trabajoId) ***REMOVED***
      setTrabajoSeleccionadoId(trabajoId);
    ***REMOVED***
  ***REMOVED***, [isOpen, turno, trabajoId]);

  const manejarGuardado = async (datosTurno) => ***REMOVED***
    try ***REMOVED***
      setLoading(true);

      // Si fechaInicial está disponible y no hay turno (es nuevo), usar fechaInicial
      let datosFinales = ***REMOVED*** ...datosTurno ***REMOVED***;

      if (fechaInicial && !turno) ***REMOVED***
        let fechaStr;
        if (fechaInicial instanceof Date) ***REMOVED***
          const year = fechaInicial.getFullYear();
          const month = String(fechaInicial.getMonth() + 1).padStart(2, '0');
          const day = String(fechaInicial.getDate()).padStart(2, '0');
          fechaStr = `$***REMOVED***year***REMOVED***-$***REMOVED***month***REMOVED***-$***REMOVED***day***REMOVED***`;
        ***REMOVED*** else ***REMOVED***
          fechaStr = fechaInicial;
        ***REMOVED***

        if (!datosFinales.fechaInicio && !datosFinales.fecha) ***REMOVED***
          datosFinales.fechaInicio = fechaStr;
        ***REMOVED***
      ***REMOVED***

      if (formularioTipo === 'delivery') ***REMOVED***
        if (turno) ***REMOVED***
          await editDeliveryShift(turno.id, datosFinales);
        ***REMOVED*** else ***REMOVED***
          await addDeliveryShift(datosFinales);
        ***REMOVED*** 
      ***REMOVED*** else ***REMOVED***
        if (turno) ***REMOVED***
          await editShift(turno.id, datosFinales);
        ***REMOVED*** else ***REMOVED***
          await addShift(datosFinales);
        ***REMOVED***
      ***REMOVED***

      setLoading(false);
      onClose();
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error al guardar turno:', error);
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;

  const manejarCambioTrabajo = (nuevoTrabajoId) => ***REMOVED***
    setTrabajoSeleccionadoId(nuevoTrabajoId);
  ***REMOVED***;

  const manejarCerrar = () => ***REMOVED***
    setTrabajoSeleccionadoId('');
    setFormularioTipo('tradicional');
    setLoading(false);
    onClose();
  ***REMOVED***;

  if (!isOpen) return null;

  // Construir título
  const titulo = turno ? 'Editar Turno' : 'Nuevo Turno';
  const subtitulo = formularioTipo === 'delivery' ? '• Delivery' : null;

  // Formatear fecha inicial si existe
  let fechaSubtitle = null;
  if (fechaInicial && !turno) ***REMOVED***
    fechaSubtitle = fechaInicial instanceof Date
      ? fechaInicial.toLocaleDateString('es-ES', ***REMOVED***
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        ***REMOVED***)
      : createSafeDate(fechaInicial).toLocaleDateString('es-ES', ***REMOVED***
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        ***REMOVED***);
  ***REMOVED***

  const subtituloFinal = [subtitulo, fechaSubtitle].filter(Boolean).join(' ');

  return (
    <BaseModal
      isOpen=***REMOVED***isOpen***REMOVED***
      onClose=***REMOVED***manejarCerrar***REMOVED***
      title=***REMOVED***titulo***REMOVED***
      subtitle=***REMOVED***subtituloFinal || undefined***REMOVED***
      loading=***REMOVED***loading***REMOVED***
      maxWidth="md"
      showActions=***REMOVED***true***REMOVED***
      onCancel=***REMOVED***manejarCerrar***REMOVED***
      formId=***REMOVED***formId***REMOVED***
      saveText=***REMOVED***turno ? 'Guardar Cambios' : 'Crear Turno'***REMOVED***
    >
      ***REMOVED***formularioTipo === 'delivery' ? (
        <TurnoDeliveryForm
          id=***REMOVED***formId***REMOVED***
          turno=***REMOVED***turno***REMOVED***
          trabajoId=***REMOVED***trabajoSeleccionadoId***REMOVED***
          trabajos=***REMOVED***todosLosTrabajos***REMOVED***
          onSubmit=***REMOVED***manejarGuardado***REMOVED***
          onTrabajoChange=***REMOVED***manejarCambioTrabajo***REMOVED***
          isMobile=***REMOVED***isMobile***REMOVED***
          fechaInicial=***REMOVED***fechaInicial***REMOVED***
        />
      ) : (
        <TurnoForm
          id=***REMOVED***formId***REMOVED***
          turno=***REMOVED***turno***REMOVED***
          trabajoId=***REMOVED***trabajoSeleccionadoId***REMOVED***
          trabajos=***REMOVED***todosLosTrabajos***REMOVED***
          onSubmit=***REMOVED***manejarGuardado***REMOVED***
          onTrabajoChange=***REMOVED***manejarCambioTrabajo***REMOVED***
          isMobile=***REMOVED***isMobile***REMOVED***
          fechaInicial=***REMOVED***fechaInicial***REMOVED***
        />
      )***REMOVED***
    </BaseModal>
  );
***REMOVED***;

export default ModalTurno;
