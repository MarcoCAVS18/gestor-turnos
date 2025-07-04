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
  const [isMobile, setIsMobile] = useState(false);

  // Detectar móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Combinar todos los trabajos para el selector usando useMemo
  const todosLosTrabajos = useMemo(() => {
    return [...trabajos, ...trabajosDelivery];
  }, [trabajos, trabajosDelivery]);

  // Determinar el tipo de formulario basado en el trabajo
  useEffect(() => {
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

  // Prevenir scroll del body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
    setTrabajoSeleccionadoId(nuevoTrabajoId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`
        bg-white shadow-2xl w-full
        ${isMobile 
          ? 'h-full max-w-none rounded-none' // Móvil: pantalla completa
          : 'max-w-lg max-h-[90vh] rounded-lg' // Desktop: modal normal
        }
        ${isMobile ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'}
      `}>
        
        {/* Header optimizado para móvil */}
        <div className={`
          sticky top-0 bg-white border-b border-gray-200 flex justify-between items-center z-10
          ${isMobile ? 'px-4 py-4 min-h-[60px]' : 'p-4'}
        `}>
          <div className="flex-1 pr-4">
            <h2 className={`font-semibold ${isMobile ? 'text-lg' : 'text-xl'}`}>
              {turno ? 'Editar Turno' : 'Nuevo Turno'}
              {formularioTipo === 'delivery' && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  • Delivery
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            style={{
              color: coloresTemáticos?.base || '#EC4899'
            }}
          >
            <X size={isMobile ? 24 : 20} />
          </button>
        </div>

        {/* Content con scroll optimizado */}
        <div className={`
          ${isMobile ? 'flex-1 overflow-y-auto px-4 py-6' : 'p-4'}
        `}>
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

        {/* Indicador visual en móvil */}
        {isMobile && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-2">
            <div className="flex justify-center">
              <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalTurno;