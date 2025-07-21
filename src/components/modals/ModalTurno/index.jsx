// src/components/modals/ModalTurno/index.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import TurnoForm from '../../forms/TurnoForm';
import TurnoDeliveryForm from '../../forms/TurnoDeliveryForm';

const ModalTurno = ({ isOpen, onClose, turno, trabajoId, fechaInicial }) => {
  const {
    addShift,
    editShift,
    addDeliveryShift,
    editDeliveryShift,
    trabajos,
    trabajosDelivery,
    thematicColors
  } = useApp();

  const [trabajoSeleccionadoId, setTrabajoSeleccionadoId] = useState(trabajoId || '');
  const [formularioTipo, setFormularioTipo] = useState('tradicional');
  const [loading, setLoading] = useState(false);
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
      const esDelivery = trabajo?.tipo === 'delivery' || trabajo?.type === 'delivery';
      setFormularioTipo(esDelivery ? 'delivery' : 'tradicional');

    } else {
      setFormularioTipo('tradicional');
    }
  }, [trabajoSeleccionadoId, todosLosTrabajos, turno]);

  // Reset cuando se abre/cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setTrabajoSeleccionadoId('');
      setFormularioTipo('tradicional');
      setLoading(false);
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
      setLoading(true);

      // NUEVO: Si fechaInicial está disponible y no hay turno (es nuevo), usar fechaInicial
      let datosFinales = { ...datosTurno };
      
      if (fechaInicial && !turno) {
        // Convertir fechaInicial a string formato YYYY-MM-DD si es Date
        let fechaStr;
        if (fechaInicial instanceof Date) {
          const year = fechaInicial.getFullYear();
          const month = String(fechaInicial.getMonth() + 1).padStart(2, '0');
          const day = String(fechaInicial.getDate()).padStart(2, '0');
          fechaStr = `${year}-${month}-${day}`;
        } else {
          fechaStr = fechaInicial;
        }
        
        // Pre-llenar la fecha si no está definida en los datos del turno
        if (!datosFinales.fechaInicio && !datosFinales.fecha) {
          datosFinales.fechaInicio = fechaStr;
        }
      }

      if (formularioTipo === 'delivery') {
        if (turno) {
          await editDeliveryShift(turno.id, datosFinales);
        } else {
          await addDeliveryShift(datosFinales);
        }
      } else {
        if (turno) {
          await editShift(turno.id, datosFinales);
        } else {
          await addShift(datosFinales);
        }
      }

      setLoading(false);
      onClose();
    } catch (error) {
      console.error('Error al guardar turno:', error);
      setLoading(false);
    }
  };

  const manejarCambioTrabajo = (nuevoTrabajoId) => {
    setTrabajoSeleccionadoId(nuevoTrabajoId);
  };

  const manejarCerrar = () => {
    setTrabajoSeleccionadoId('');
    setFormularioTipo('tradicional');
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  // Configuración del modal optimizada para evitar scroll horizontal
  const modalConfig = {
    mobileFullScreen: isMobile,
    size: isMobile ? 'full' : 'md',
    zIndex: 9999
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-hidden"
      style={{ zIndex: modalConfig.zIndex }}
    >
      <div
        className={`
          bg-white shadow-2xl relative
          ${isMobile
            ? 'w-full h-full max-w-none rounded-none'
            : 'w-full max-w-md max-h-[90vh] rounded-xl mx-4'
          }
          ${isMobile ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'}
        `}
      >

        {/* Header optimizado con thematicColors */}
        <div
          className={`
            sticky top-0 bg-white border-b flex justify-between items-center z-10
            ${isMobile ? 'px-4 py-4 min-h-[60px]' : 'p-4'}
          `}
          style={{
            borderBottomColor: thematicColors?.transparent20 || 'rgba(236, 72, 153, 0.2)'
          }}
        >
          <div className="flex-1 pr-4 min-w-0">
            <h2
              className={`font-semibold truncate ${isMobile ? 'text-lg' : 'text-xl'}`}
              style={{ color: thematicColors?.base || '#EC4899' }}
            >
              {turno ? 'Editar Turno' : 'Nuevo Turno'}
              {formularioTipo === 'delivery' && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  • Delivery
                </span>
              )}
              {/* NUEVO: Mostrar fecha si viene del calendario */}
              {fechaInicial && !turno && (
                <span className="text-sm font-normal text-gray-600 ml-2 block">
                  {fechaInicial instanceof Date 
                    ? fechaInicial.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
                    : new Date(fechaInicial + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
                  }
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={manejarCerrar}
            className="p-2 rounded-lg transition-colors flex-shrink-0"
            style={{
              backgroundColor: 'transparent',
              color: thematicColors?.base || '#EC4899'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = thematicColors?.transparent10 || 'rgba(236, 72, 153, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
            disabled={loading}
          >
            <X size={isMobile ? 24 : 20} />
          </button>
        </div>

        {/* Content con scroll optimizado */}
        <div className={`
          ${isMobile ? 'flex-1 overflow-y-auto px-4 py-6' : 'p-4 overflow-y-auto'}
          ${!isMobile ? 'max-h-[calc(90vh-120px)]' : ''}
        `}>
          {formularioTipo === 'delivery' ? (
            <TurnoDeliveryForm
              turno={turno}
              trabajoId={trabajoSeleccionadoId}
              trabajos={todosLosTrabajos}
              onSubmit={manejarGuardado}
              onCancel={manejarCerrar}
              onTrabajoChange={manejarCambioTrabajo}
              thematicColors={thematicColors}
              isMobile={isMobile}
              loading={loading}
              fechaInicial={fechaInicial} // NUEVO: Pasar fecha inicial
            />
          ) : (
            <TurnoForm
              turno={turno}
              trabajoId={trabajoSeleccionadoId}
              trabajos={todosLosTrabajos}
              onSubmit={manejarGuardado}
              onCancel={manejarCerrar}
              onTrabajoChange={manejarCambioTrabajo}
              thematicColors={thematicColors}
              isMobile={isMobile}
              loading={loading}
              fechaInicial={fechaInicial} // NUEVO: Pasar fecha inicial
            />
          )}
        </div>

        {/* Footer fijo en móvil si es necesario */}
        {isMobile && !loading && (
          <div
            className="sticky bottom-0 bg-white border-t p-4"
            style={{
              borderTopColor: thematicColors?.transparent20 || 'rgba(236, 72, 153, 0.2)'
            }}
          >
            <div className="text-xs text-gray-500 text-center">
              Desliza hacia abajo para cerrar
            </div>
          </div>
        )}

        {/* Indicador de carga */}
        {loading && (
          <div
            className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center"
            style={{ zIndex: modalConfig.zIndex + 1 }}
          >
            <div
              className="bg-white rounded-lg p-4 flex items-center space-x-3"
              style={{
                borderColor: thematicColors?.base || '#EC4899',
                borderWidth: '2px'
              }}
            >
              <div
                className="animate-spin rounded-full h-6 w-6 border-b-2"
                style={{ borderColor: thematicColors?.base || '#EC4899' }}
              />
              <span
                className="font-medium"
                style={{ color: thematicColors?.base || '#EC4899' }}
              >
                Guardando...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalTurno;