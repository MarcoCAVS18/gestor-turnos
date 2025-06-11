// src/components/modals/ModalTrabajoDelivery.jsx
import React from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import TrabajoDeliveryForm from '../../forms/TrabajoDeliveryForm';

const ModalTrabajoDelivery = ({ isOpen, onClose, trabajo }) => {
  const { agregarTrabajo, editarTrabajo } = useApp();

  const manejarGuardado = async (datosDelivery) => {
    if (trabajo) {
      await editarTrabajo(trabajo.id, datosDelivery);
    } else {
      await agregarTrabajo(datosDelivery);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {trabajo ? 'Editar Trabajo de Delivery' : 'Nuevo Trabajo de Delivery'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <TrabajoDeliveryForm
            trabajo={trabajo}
            onSubmit={manejarGuardado}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default ModalTrabajoDelivery;