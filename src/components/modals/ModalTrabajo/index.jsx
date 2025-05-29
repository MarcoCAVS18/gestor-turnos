import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import Modal from '../../ui/Modal';
import TrabajoForm from '../../forms/TrabajoForm';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';

const ModalTrabajo = (***REMOVED*** visible, onClose, trabajoSeleccionado ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** agregarTrabajo, editarTrabajo ***REMOVED*** = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => ***REMOVED***
    try ***REMOVED***
      setLoading(true);
      setError('');
      
      if (trabajoSeleccionado) ***REMOVED***
        await editarTrabajo(trabajoSeleccionado.id, formData);
      ***REMOVED*** else ***REMOVED***
        await agregarTrabajo(formData);
      ***REMOVED***
      
      onClose();
    ***REMOVED*** catch (err) ***REMOVED***
      setError(err.message || 'Error al guardar el trabajo');
    ***REMOVED*** finally ***REMOVED***
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;

  return (
    <Modal
      isOpen=***REMOVED***visible***REMOVED***
      onClose=***REMOVED***onClose***REMOVED***
      title=***REMOVED***trabajoSeleccionado ? 'Editar Trabajo' : 'Nuevo Trabajo'***REMOVED***
      size="lg"
    >
      ***REMOVED***error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">***REMOVED***error***REMOVED***</p>
        </div>
      )***REMOVED***
      
      <TrabajoForm
        trabajo=***REMOVED***trabajoSeleccionado***REMOVED***
        onSubmit=***REMOVED***handleSubmit***REMOVED***
        onCancel=***REMOVED***onClose***REMOVED***
        loading=***REMOVED***loading***REMOVED***
      />
    </Modal>
  );
***REMOVED***;

export default ModalTrabajo;