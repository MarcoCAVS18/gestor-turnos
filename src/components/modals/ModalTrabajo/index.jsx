// src/components/modals/ModalTrabajo/index.jsx

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
  const [loading, setLoading] = useState(false);

  // Determinar si mostrar selector
  React.useEffect(() => {
    if (isOpen && !trabajo && deliveryEnabled) {
      // Solo mostrar selector si delivery está habilitado y es un trabajo nuevo
      setMostrarSelector(true);
      setTipoSeleccionado(null);
    } else {
      setMostrarSelector(false);
      // Si no hay delivery habilitado, ir directo al formulario tradicional
      if (isOpen && !trabajo && !deliveryEnabled) {
        setTipoSeleccionado('tradicional');
      }
    }
  }, [isOpen, trabajo, deliveryEnabled]);

  const manejarSeleccionTipo = (tipo) => {
    setTipoSeleccionado(tipo);
    setMostrarSelector(false);
  };

  const manejarGuardado = async (datosTrabajo) => {
    try {
      setLoading(true);
      
      if (trabajo) {
        await editarTrabajo(trabajo.id, datosTrabajo);
      } else {
        const resultado = await agregarTrabajo(datosTrabajo);
        console.log(resultado)
      }
      
      // Resetear estados
      setTipoSeleccionado(null);
      setMostrarSelector(false);
      onClose();
    } catch (error) {
      console.error('Error al guardar trabajo:', error);
    } finally {
      setLoading(false);
    }
  };

  const manejarCerrar = () => {
    setTipoSeleccionado(null);
    setMostrarSelector(false);
    onClose();
  };

  if (!isOpen) return null;

  // Si es un trabajo de delivery existente, usar el modal de delivery directamente
  if (trabajo && trabajo.tipo === 'delivery') {
    return (
      <ModalTrabajoDelivery
        isOpen={true}
        onClose={manejarCerrar}
        trabajo={trabajo}
      />
    );
  }

  // Si se seleccionó delivery como tipo
  if (tipoSeleccionado === 'delivery') {
    return (
      <ModalTrabajoDelivery
        isOpen={true}
        onClose={manejarCerrar}
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
            onClick={manejarCerrar}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
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
              onCancel={manejarCerrar}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalTrabajo;