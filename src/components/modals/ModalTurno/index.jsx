// src/components/modals/ModalTurno/index.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import TurnoForm from '../../forms/TurnoForm';
import TurnoDeliveryForm from '../../forms/TurnoDeliveryForm';

const ModalTurno = ({ isOpen, onClose, turno, trabajoId }) => {
  const {
    agregarTurno,
    editarTurno,
    agregarTurnoDelivery,
    editarTurnoDelivery,
    trabajos,
    trabajosDelivery,
    coloresTemáticos
  } = useApp();

  const [trabajoSeleccionadoId, setTrabajoSeleccionadoId] = useState(trabajoId || '');
  const [formularioTipo, setFormularioTipo] = useState('tradicional');

  // Combinar todos los trabajos para el selector usando useMemo
  const todosLosTrabajos = useMemo(() => {
    console.log('Combinando trabajos:', {
      tradicionales: trabajos.length,
      delivery: trabajosDelivery.length,
      total: trabajos.length + trabajosDelivery.length
    });
    return [...trabajos, ...trabajosDelivery];
  }, [trabajos, trabajosDelivery]);

  // Determinar el tipo de formulario basado en el trabajo
  useEffect(() => {
    console.log('Determinando tipo de formulario:', {
      turno_tipo: turno?.tipo,
      trabajoSeleccionadoId,
      todos_trabajos_count: todosLosTrabajos.length
    });

    if (turno?.tipo === 'delivery') {
      setFormularioTipo('delivery');
    } else if (trabajoSeleccionadoId) {
      const trabajo = todosLosTrabajos.find(t => t.id === trabajoSeleccionadoId);
      setFormularioTipo(trabajo?.tipo === 'delivery' ? 'delivery' : 'tradicional');
    } else {
      setFormularioTipo('tradicional');
    }
  }, [trabajoSeleccionadoId, todosLosTrabajos, turno]);

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
    try {
      
      if (formularioTipo === 'delivery') {
        if (turno) {
          await editarTurnoDelivery(turno.id, datosTurno);
        } else {
          await agregarTurnoDelivery(datosTurno);
        }
      } else {
        if (turno) {
          await editarTurno(turno.id, datosTurno);
        } else {
          await agregarTurno(datosTurno);
        }
      }
      onClose();
    } catch (error) {
      console.error('Error al guardar turno:', error);
    }
  };

  const manejarCambioTrabajo = (nuevoTrabajoId) => {
    console.log('Cambio de trabajo:', nuevoTrabajoId);
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
            style={{
              color: coloresTemáticos?.base || '#EC4899'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {formularioTipo === 'delivery' ? (
            <TurnoDeliveryForm
              turno={turno}
              trabajoId={trabajoSeleccionadoId}
              trabajos={todosLosTrabajos} 
              onSubmit={manejarGuardado}
              onCancel={onClose}
              onTrabajoChange={manejarCambioTrabajo}
            />
          ) : (
            <TurnoForm
              turno={turno}
              trabajoId={trabajoSeleccionadoId}
              trabajos={todosLosTrabajos} 
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