// src/components/modals/ModalTurno.jsx

import React, ***REMOVED*** useState, useEffect, useMemo ***REMOVED*** from 'react'; // Added useMemo
import ***REMOVED*** X ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import TurnoForm from '../../forms/TurnoForm';
import TurnoDeliveryForm from '../../forms/TurnoDeliveryForm';

const ModalTurno = (***REMOVED*** isOpen, onClose, turno, trabajoId ***REMOVED***) => ***REMOVED***
  const ***REMOVED***
    agregarTurno,
    editarTurno,
    agregarTurnoDelivery,
    editarTurnoDelivery,
    trabajos,
    trabajosDelivery
  ***REMOVED*** = useApp();

  const [trabajoSeleccionadoId, setTrabajoSeleccionadoId] = useState(trabajoId || '');
  const [formularioTipo, setFormularioTipo] = useState('tradicional');

  // Combinar todos los trabajos para el selector usando useMemo
  const todosLosTrabajos = useMemo(() => ***REMOVED***
    return [...trabajos, ...trabajosDelivery];
  ***REMOVED***, [trabajos, trabajosDelivery]); // Dependencies for useMemo

  // Determinar el tipo de formulario basado en el trabajo
  useEffect(() => ***REMOVED***
    if (turno?.tipo === 'delivery') ***REMOVED***
      setFormularioTipo('delivery');
    ***REMOVED*** else if (trabajoSeleccionadoId) ***REMOVED***
      const trabajo = todosLosTrabajos.find(t => t.id === trabajoSeleccionadoId);
      setFormularioTipo(trabajo?.tipo === 'delivery' ? 'delivery' : 'tradicional');
    ***REMOVED*** else ***REMOVED***
      setFormularioTipo('tradicional');
    ***REMOVED***
  ***REMOVED***, [trabajoSeleccionadoId, todosLosTrabajos, turno]);

  // Reset cuando se abre/cierra el modal
  useEffect(() => ***REMOVED***
    if (!isOpen) ***REMOVED***
      setTrabajoSeleccionadoId('');
      setFormularioTipo('tradicional');
    ***REMOVED*** else if (turno) ***REMOVED***
      setTrabajoSeleccionadoId(turno.trabajoId || '');
    ***REMOVED*** else if (trabajoId) ***REMOVED***
      setTrabajoSeleccionadoId(trabajoId);
    ***REMOVED***
  ***REMOVED***, [isOpen, turno, trabajoId]);

  const manejarGuardado = async (datosTurno) => ***REMOVED***
    try ***REMOVED***
      if (formularioTipo === 'delivery') ***REMOVED***
        if (turno) ***REMOVED***
          await editarTurnoDelivery(turno.id, datosTurno);
        ***REMOVED*** else ***REMOVED***
          await agregarTurnoDelivery(datosTurno);
        ***REMOVED***
      ***REMOVED*** else ***REMOVED***
        if (turno) ***REMOVED***
          await editarTurno(turno.id, datosTurno);
        ***REMOVED*** else ***REMOVED***
          await agregarTurno(datosTurno);
        ***REMOVED***
      ***REMOVED***
      onClose();
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error al guardar turno:', error);
      // Aquí podrías mostrar una notificación de error
    ***REMOVED***
  ***REMOVED***;

  const manejarCambioTrabajo = (nuevoTrabajoId) => ***REMOVED***
    setTrabajoSeleccionadoId(nuevoTrabajoId);
  ***REMOVED***;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            ***REMOVED***turno ? 'Editar Turno' : 'Nuevo Turno'***REMOVED***
            ***REMOVED***formularioTipo === 'delivery' && ' de Delivery'***REMOVED***
          </h2>
          <button
            onClick=***REMOVED***onClose***REMOVED***
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size=***REMOVED***20***REMOVED*** />
          </button>
        </div>

        <div className="p-4">
          ***REMOVED***formularioTipo === 'delivery' ? (
            <TurnoDeliveryForm
              turno=***REMOVED***turno***REMOVED***
              trabajoId=***REMOVED***trabajoSeleccionadoId***REMOVED***
              trabajos=***REMOVED***todosLosTrabajos.filter(t => t.tipo === 'delivery')***REMOVED***
              onSubmit=***REMOVED***manejarGuardado***REMOVED***
              onCancel=***REMOVED***onClose***REMOVED***
              onTrabajoChange=***REMOVED***manejarCambioTrabajo***REMOVED***
            />
          ) : (
            <TurnoForm
              turno=***REMOVED***turno***REMOVED***
              trabajoId=***REMOVED***trabajoSeleccionadoId***REMOVED***
              trabajos=***REMOVED***todosLosTrabajos.filter(t => t.tipo !== 'delivery')***REMOVED***
              onSubmit=***REMOVED***manejarGuardado***REMOVED***
              onCancel=***REMOVED***onClose***REMOVED***
              onTrabajoChange=***REMOVED***manejarCambioTrabajo***REMOVED***
            />
          )***REMOVED***
        </div>
      </div>
    </div>
  );
***REMOVED***;

export default ModalTurno;