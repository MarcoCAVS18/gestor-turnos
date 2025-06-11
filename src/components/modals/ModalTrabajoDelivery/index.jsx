// src/components/modals/ModalTrabajoDelivery.jsx
import React from 'react';
import ***REMOVED*** X ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import TrabajoDeliveryForm from '../../forms/TrabajoDeliveryForm';

const ModalTrabajoDelivery = (***REMOVED*** isOpen, onClose, trabajo ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** agregarTrabajo, editarTrabajo ***REMOVED*** = useApp();

  const manejarGuardado = async (datosDelivery) => ***REMOVED***
    if (trabajo) ***REMOVED***
      await editarTrabajo(trabajo.id, datosDelivery);
    ***REMOVED*** else ***REMOVED***
      await agregarTrabajo(datosDelivery);
    ***REMOVED***
    onClose();
  ***REMOVED***;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            ***REMOVED***trabajo ? 'Editar Trabajo de Delivery' : 'Nuevo Trabajo de Delivery'***REMOVED***
          </h2>
          <button
            onClick=***REMOVED***onClose***REMOVED***
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size=***REMOVED***20***REMOVED*** />
          </button>
        </div>

        <div className="p-4">
          <TrabajoDeliveryForm
            trabajo=***REMOVED***trabajo***REMOVED***
            onSubmit=***REMOVED***manejarGuardado***REMOVED***
            onCancel=***REMOVED***onClose***REMOVED***
          />
        </div>
      </div>
    </div>
  );
***REMOVED***;

export default ModalTrabajoDelivery;