// src/components/modals/ModalTurno.jsx

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import TurnoForm from '../../forms/TurnoForm';
import TurnoDeliveryForm from '../../forms/TurnoDeliveryForm';

const ModalTurno = ({ isOpen, onClose, turno, trabajoId }) => {
  const { agregarTurno, editarTurno, trabajos } = useApp();
  const [trabajoSeleccionadoId, setTrabajoSeleccionadoId] = useState(trabajoId || '');
  const [formularioTipo, setFormularioTipo] = useState('tradicional');
  
  // Determinar el tipo de formulario basado en el trabajo
  useEffect(() => {
    if (turno?.tipo === 'delivery') {
      setFormularioTipo('delivery');
    } else if (trabajoSeleccionadoId) {
      const trabajo = trabajos.find(t => t.id === trabajoSeleccionadoId);
      setFormularioTipo(trabajo?.tipo === 'delivery' ? 'delivery' : 'tradicional');
    } else {
      setFormularioTipo('tradicional');
    }
  }, [trabajoSeleccionadoId, trabajos, turno]);

  // Reset cuando se abre/cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setTrabajoSeleccionadoId('');
      setFormularioTipo('tradicional');
    } else if (turno) {
      setTrabajoSeleccionadoId(turno.trabajoId || '');
    } else if (trabajoId) {
      setTrabajoSeleccionadoId(trabajoId);
    }
  }, [isOpen, turno, trabajoId]);

  const manejarGuardado = async (datosTurno) => {
    if (turno) {
      await editarTurno(turno.id, datosTurno);
    } else {
      await agregarTurno(datosTurno);
    }
    onClose();
  };

  const manejarCambioTrabajo = (nuevoTrabajoId) => {
    setTrabajoSeleccionadoId(nuevoTrabajoId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {turno ? 'Editar Turno' : 'Nuevo Turno'}
            {formularioTipo === 'delivery' && ' de Delivery'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {formularioTipo === 'delivery' ? (
            <TurnoDeliveryForm
              turno={turno}
              trabajoId={trabajoSeleccionadoId}
              onSubmit={manejarGuardado}
              onCancel={onClose}
              onTrabajoChange={manejarCambioTrabajo}
            />
          ) : (
            <TurnoForm
              turno={turno}
              trabajoId={trabajoSeleccionadoId}
              onSubmit={manejarGuardado}
              onCancel={onClose}
              onTrabajoChange={manejarCambioTrabajo}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalTurno;