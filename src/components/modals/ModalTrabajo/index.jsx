// src/components/modals/ModalTrabajo.jsx
import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** X ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import TrabajoForm from '../../forms/TrabajoForm';
import SelectorTipoTrabajo from '../SelectorTipoTrabajo';
import ModalTrabajoDelivery from '../ModalTrabajoDelivery';

const ModalTrabajo = (***REMOVED*** isOpen, onClose, trabajo ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** agregarTrabajo, editarTrabajo, deliveryEnabled ***REMOVED*** = useApp();
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);

  // Determinar si mostrar selector
  React.useEffect(() => ***REMOVED***
    if (isOpen && !trabajo && deliveryEnabled) ***REMOVED***
      setMostrarSelector(true);
      setTipoSeleccionado(null);
    ***REMOVED*** else ***REMOVED***
      setMostrarSelector(false);
    ***REMOVED***
  ***REMOVED***, [isOpen, trabajo, deliveryEnabled]);

  const manejarSeleccionTipo = (tipo) => ***REMOVED***
    setTipoSeleccionado(tipo);
    setMostrarSelector(false);
  ***REMOVED***;

  const manejarGuardado = async (datosTrabajo) => ***REMOVED***
    if (trabajo) ***REMOVED***
      await editarTrabajo(trabajo.id, datosTrabajo);
    ***REMOVED*** else ***REMOVED***
      await agregarTrabajo(datosTrabajo);
    ***REMOVED***
    onClose();
  ***REMOVED***;

  if (!isOpen) return null;

  // Si es un trabajo de delivery existente, usar el modal de delivery
  if (trabajo && trabajo.tipo === 'delivery') ***REMOVED***
    return (
      <ModalTrabajoDelivery
        isOpen=***REMOVED***true***REMOVED***
        onClose=***REMOVED***onClose***REMOVED***
        trabajo=***REMOVED***trabajo***REMOVED***
      />
    );
  ***REMOVED***

  // Si se seleccionó delivery como tipo
  if (tipoSeleccionado === 'delivery') ***REMOVED***
    return (
      <ModalTrabajoDelivery
        isOpen=***REMOVED***true***REMOVED***
        onClose=***REMOVED***onClose***REMOVED***
        trabajo=***REMOVED***null***REMOVED***
      />
    );
  ***REMOVED***

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            ***REMOVED***trabajo ? 'Editar Trabajo' : 'Nuevo Trabajo'***REMOVED***
          </h2>
          <button
            onClick=***REMOVED***onClose***REMOVED***
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size=***REMOVED***20***REMOVED*** />
          </button>
        </div>

        <div className="p-4">
          ***REMOVED***mostrarSelector ? (
            <SelectorTipoTrabajo onSelectTipo=***REMOVED***manejarSeleccionTipo***REMOVED*** />
          ) : (
            <TrabajoForm
              trabajo=***REMOVED***trabajo***REMOVED***
              onSubmit=***REMOVED***manejarGuardado***REMOVED***
              onCancel=***REMOVED***onClose***REMOVED***
            />
          )***REMOVED***
        </div>
      </div>
    </div>
  );
***REMOVED***;

export default ModalTrabajo;