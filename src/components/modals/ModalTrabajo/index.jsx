// src/components/modals/ModalTrabajo.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import TrabajoForm from '../../forms/TrabajoForm';
import SelectorTipoTrabajo from '../SelectorTipoTrabajo';
import ModalTrabajoDelivery from '../ModalTrabajoDelivery';

const ModalTrabajo = ({ isOpen, onClose, trabajo }) => {
  const { agregarTrabajo, editarTrabajo, deliveryEnabled } = useApp();
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);

  // Determinar si mostrar selector
  React.useEffect(() => {
    if (isOpen && !trabajo && deliveryEnabled) {
      setMostrarSelector(true);
      setTipoSeleccionado(null);
    } else {
      setMostrarSelector(false);
    }
  }, [isOpen, trabajo, deliveryEnabled]);

  const manejarSeleccionTipo = (tipo) => {
    setTipoSeleccionado(tipo);
    setMostrarSelector(false);
  };

  const manejarGuardado = async (datosTrabajo) => {
    if (trabajo) {
      await editarTrabajo(trabajo.id, datosTrabajo);
    } else {
      await agregarTrabajo(datosTrabajo);
    }
    onClose();
  };

  if (!isOpen) return null;

  // Si es un trabajo de delivery existente, usar el modal de delivery
  if (trabajo && trabajo.tipo === 'delivery') {
    return (
      <ModalTrabajoDelivery
        isOpen={true}
        onClose={onClose}
        trabajo={trabajo}
      />
    );
  }

  // Si se seleccionó delivery como tipo
  if (tipoSeleccionado === 'delivery') {
    return (
      <ModalTrabajoDelivery
        isOpen={true}
        onClose={onClose}
        trabajo={null}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {trabajo ? 'Editar Trabajo' : 'Nuevo Trabajo'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {mostrarSelector ? (
            <SelectorTipoTrabajo onSelectTipo={manejarSeleccionTipo} />
          ) : (
            <TrabajoForm
              trabajo={trabajo}
              onSubmit={manejarGuardado}
              onCancel={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalTrabajo;