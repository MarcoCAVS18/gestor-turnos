// src/components/modals/TrabajoModal/index.jsx
import React from 'react';
import Modal from '../../ui/Modal';
import TrabajoForm from '../../forms/TrabajoForm';
import { useApp } from '../../../contexts/AppContext';

const TrabajoModal = ({ 
  isOpen, 
  onClose, 
  trabajo = null 
}) => {
  const { agregarTrabajo, editarTrabajo } = useApp();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      
      if (trabajo) {
        await editarTrabajo(trabajo.id, formData);
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
      isOpen={isOpen}
      onClose={onClose}
      title={trabajo ? 'Editar Trabajo' : 'Nuevo Trabajo'}
      size="lg"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <TrabajoForm
        trabajo={trabajo}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
};

export default TrabajoModal;