// src/components/modals/ModalTurno/index.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import Modal from '../../ui/Modal';
import TurnoForm from '../../forms/TurnoForm';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';

const ModalTurno = (***REMOVED*** isOpen, onClose, turnoSeleccionado, fechaInicial ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** agregarTurno, editarTurno ***REMOVED*** = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => ***REMOVED***
    try ***REMOVED***
      setLoading(true);
      setError('');
      
      if (turnoSeleccionado) ***REMOVED***
        await editarTurno(turnoSeleccionado.id, formData);
      ***REMOVED*** else ***REMOVED***
        await agregarTurno(formData);
      ***REMOVED***
      
      onClose();
    ***REMOVED*** catch (err) ***REMOVED***
      setError(err.message || 'Error al guardar el turno');
    ***REMOVED*** finally ***REMOVED***
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;

  return (
    <Modal
      isOpen=***REMOVED***isOpen***REMOVED***
      onClose=***REMOVED***onClose***REMOVED***
      title=***REMOVED***turnoSeleccionado ? 'Editar Turno' : 'Nuevo Turno'***REMOVED***
      size="md"
    >
      ***REMOVED***error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">***REMOVED***error***REMOVED***</p>
        </div>
      )***REMOVED***
      
      <TurnoForm
        turno=***REMOVED***turnoSeleccionado***REMOVED***
        fechaInicial=***REMOVED***fechaInicial***REMOVED***
        onSubmit=***REMOVED***handleSubmit***REMOVED***
        onCancel=***REMOVED***onClose***REMOVED***
        loading=***REMOVED***loading***REMOVED***
      />
    </Modal>
  );
***REMOVED***;

export default ModalTurno;