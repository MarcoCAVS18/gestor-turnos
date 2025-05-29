import React, { useState } from 'react';
import Modal from '../../ui/Modal';
import TurnoForm from '../../forms/TurnoForm';
import { useApp } from '../../../contexts/AppContext';

const ModalTurno = ({ visible, onClose, turnoSeleccionado, fechaInicial }) => {
  const { agregarTurno, editarTurno } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      
      if (turnoSeleccionado) {
        await editarTurno(turnoSeleccionado.id, formData);
      } else {
        await agregarTurno(formData);
      }
      
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar el turno');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={visible}
      onClose={onClose}
      title={turnoSeleccionado ? 'Editar Turno' : 'Nuevo Turno'}
      size="md"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <TurnoForm
        turno={turnoSeleccionado}
        fechaInicial={fechaInicial}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
};

export default ModalTurno;