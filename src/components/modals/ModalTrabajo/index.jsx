import React, { useState } from 'react';
import Modal from '../../ui/Modal';
import TrabajoForm from '../../forms/TrabajoForm';
import { useApp } from '../../../contexts/AppContext';

const ModalTrabajo = ({ visible, onClose, trabajoSeleccionado }) => {
  const { agregarTrabajo, editarTrabajo } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      
      if (trabajoSeleccionado) {
        await editarTrabajo(trabajoSeleccionado.id, formData);
      } else {
        await agregarTrabajo(formData);
      }
      
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar el trabajo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={visible}
      onClose={onClose}
      title={trabajoSeleccionado ? 'Editar Trabajo' : 'Nuevo Trabajo'}
      size="lg"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <TrabajoForm
        trabajo={trabajoSeleccionado}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
};

export default ModalTrabajo;