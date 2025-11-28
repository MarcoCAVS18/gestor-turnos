// src/components/modals/work/ModalTrabajo/index.jsx - Refactorizado con BaseModal

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../../contexts/AppContext';
import ***REMOVED*** useIsMobile ***REMOVED*** from '../../../../hooks/useIsMobile';
import BaseModal from '../../base/BaseModal';
import TrabajoForm from '../../../forms/work/TrabajoForm';
import SelectorTipoTrabajo from '../../base/SelectorTipoTrabajo';
import ModalTrabajoDelivery from '../ModalTrabajoDelivery';

const ModalTrabajo = (***REMOVED*** isOpen, onClose, trabajo ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** addJob, editJob, deliveryEnabled ***REMOVED*** = useApp();
  const isMobile = useIsMobile();
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);

  // Determinar si mostrar selector
  useEffect(() => ***REMOVED***
    if (isOpen && !trabajo && deliveryEnabled) ***REMOVED***
      setMostrarSelector(true);
      setTipoSeleccionado(null);
    ***REMOVED*** else ***REMOVED***
      setMostrarSelector(false);
      if (isOpen && !trabajo && !deliveryEnabled) ***REMOVED***
        setTipoSeleccionado('tradicional');
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***, [isOpen, trabajo, deliveryEnabled]);

  const manejarSeleccionTipo = (tipo) => ***REMOVED***
    setTipoSeleccionado(tipo);
    setMostrarSelector(false);
  ***REMOVED***;

  const manejarGuardado = async (datosTrabajo) => ***REMOVED***
    try ***REMOVED***
      setLoading(true);

      if (trabajo) ***REMOVED***
        await editJob(trabajo.id, datosTrabajo);
      ***REMOVED*** else ***REMOVED***
        await addJob(datosTrabajo);
      ***REMOVED***

      setTipoSeleccionado(null);
      setMostrarSelector(false);
      setLoading(false);
      onClose();
    ***REMOVED*** catch (error) ***REMOVED***
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;

  const manejarCerrar = () => ***REMOVED***
    setTipoSeleccionado(null);
    setMostrarSelector(false);
    setLoading(false);
    onClose();
  ***REMOVED***;

  if (!isOpen) return null;

  // Si es un trabajo de delivery existente, usar el modal de delivery directamente
  if (trabajo && trabajo.tipo === 'delivery') ***REMOVED***
    return (
      <ModalTrabajoDelivery
        isOpen=***REMOVED***true***REMOVED***
        onClose=***REMOVED***manejarCerrar***REMOVED***
        trabajo=***REMOVED***trabajo***REMOVED***
      />
    );
  ***REMOVED***

  // Si se seleccionó delivery como tipo
  if (tipoSeleccionado === 'delivery') ***REMOVED***
    return (
      <ModalTrabajoDelivery
        isOpen=***REMOVED***true***REMOVED***
        onClose=***REMOVED***manejarCerrar***REMOVED***
        trabajo=***REMOVED***null***REMOVED***
      />
    );
  ***REMOVED***

  return (
    <BaseModal
      isOpen=***REMOVED***isOpen***REMOVED***
      onClose=***REMOVED***manejarCerrar***REMOVED***
      title=***REMOVED***trabajo ? 'Editar Trabajo' : 'Nuevo Trabajo'***REMOVED***
      loading=***REMOVED***loading***REMOVED***
      loadingText="Guardando..."
      showFooter=***REMOVED***!mostrarSelector***REMOVED***
      maxWidth="lg"
    >
      ***REMOVED***mostrarSelector ? (
        <SelectorTipoTrabajo
          onSelectTipo=***REMOVED***manejarSeleccionTipo***REMOVED***
          isMobile=***REMOVED***isMobile***REMOVED***
        />
      ) : (
        <TrabajoForm
          trabajo=***REMOVED***trabajo***REMOVED***
          onSubmit=***REMOVED***manejarGuardado***REMOVED***
          onCancel=***REMOVED***manejarCerrar***REMOVED***
          loading=***REMOVED***loading***REMOVED***
          isMobile=***REMOVED***isMobile***REMOVED***
        />
      )***REMOVED***
    </BaseModal>
  );
***REMOVED***;

export default ModalTrabajo;
