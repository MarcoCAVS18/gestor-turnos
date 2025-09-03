// src/components/modals/ModalTurno/index.jsx - COMPLETAMENTE REESCRITO PARA MÓVIL

import React, { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import TurnoForm from '../../forms/TurnoForm';
import TurnoDeliveryForm from '../../forms/TurnoDeliveryForm';

const ModalTurno = ({ isOpen, onClose, turno, trabajoId, fechaInicial }) => {
  const {
    addShift,
    editShift,
    addDeliveryShift,
    editDeliveryShift,
    trabajos,
    trabajosDelivery
  } = useApp();

  const colors = useThemeColors();
  const [trabajoSeleccionadoId, setTrabajoSeleccionadoId] = useState(trabajoId || '');
  const [formularioTipo, setFormularioTipo] = useState('tradicional');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  //  DETECCIÓN DE MÓVIL MEJORADA
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768;
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Combinar todos los trabajos para el selector usando useMemo
  const todosLosTrabajos = useMemo(() => {
    return [...trabajos, ...trabajosDelivery];
  }, [trabajos, trabajosDelivery]);

  // Determinar el tipo de formulario basado en el trabajo - MEJORADA
  useEffect(() => {
    if (turno?.tipo === 'delivery') {
      setFormularioTipo('delivery');
      return;
    }

    if (trabajoSeleccionadoId) {
      const trabajo = todosLosTrabajos.find(t => t.id === trabajoSeleccionadoId);
      
      if (trabajo) {
        const esDelivery = trabajo.tipo === 'delivery' || trabajo.type === 'delivery';
        const nuevoTipo = esDelivery ? 'delivery' : 'tradicional';
        
        if (formularioTipo !== nuevoTipo) {
          setFormularioTipo(nuevoTipo);
        }
      } else {
        setFormularioTipo('tradicional');
      }
    } else {
      setFormularioTipo('tradicional');
    }
  }, [trabajoSeleccionadoId, todosLosTrabajos, turno, formularioTipo]);

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

  // PREVENIR SCROLL DEL BODY MEJORADO
  useEffect(() => {
    if (isOpen) {
      // Guardar el scroll actual
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restaurar el scroll
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    
    return () => {
      // Cleanup en caso de desmontaje
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const manejarGuardado = async (datosTurno) => {
    try {
      setLoading(true);

      // Si fechaInicial está disponible y no hay turno (es nuevo), usar fechaInicial
      let datosFinales = { ...datosTurno };
      
      if (fechaInicial && !turno) {
        let fechaStr;
        if (fechaInicial instanceof Date) {
          const year = fechaInicial.getFullYear();
          const month = String(fechaInicial.getMonth() + 1).padStart(2, '0');
          const day = String(fechaInicial.getDate()).padStart(2, '0');
          fechaStr = `${year}-${month}-${day}`;
        } else {
          fechaStr = fechaInicial;
        }
        
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

  // CONFIGURACIÓN DEL MODAL COMPLETAMENTE RESPONSIVA
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50"
      style={{ zIndex: 9999 }}
    >
      {/* CONTENEDOR PRINCIPAL RESPONSIVO */}
      <div className={`
        fixed inset-0 
        ${isMobile 
          ? 'flex items-end justify-center' 
          : 'flex items-center justify-center p-4'
        }
      `}>
        {/* MODAL ESTILO BOTTOM SHEET EN MÓVIL */}
        <div className={`
          bg-white shadow-2xl relative
          ${isMobile
            ? 'w-full max-h-[90vh] rounded-t-2xl flex flex-col' 
            : 'w-full max-w-md max-h-[90vh] rounded-xl overflow-hidden'
          }
        `}>
          
          {/* HEADER OPTIMIZADO */}
          <div className={`
            flex-shrink-0 bg-white border-b flex justify-between items-center
            ${isMobile ? 'px-4 py-4 min-h-[60px]' : 'px-4 py-4'}
          `}
          style={{ borderBottomColor: colors.transparent20 }}>
            
            <div className="flex-1 pr-4 min-w-0">
              <h2 className={`font-semibold truncate ${isMobile ? 'text-lg' : 'text-xl'}`}
                  style={{ color: colors.primary }}>
                {turno ? 'Editar Turno' : 'Nuevo Turno'}
                {formularioTipo === 'delivery' && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    • Delivery
                  </span>
                )}
              </h2>
              
              {/* Mostrar fecha si viene del calendario */}
              {fechaInicial && !turno && (
                <p className="text-sm font-normal text-gray-600 mt-1">
                  {fechaInicial instanceof Date 
                    ? fechaInicial.toLocaleDateString('es-ES', { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short' 
                      })
                    : new Date(fechaInicial + 'T00:00:00').toLocaleDateString('es-ES', { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short' 
                      })
                  }
                </p>
              )}
            </div>
            
            <button
              onClick={manejarCerrar}
              className="flex-shrink-0 p-2 rounded-lg transition-colors"
              style={{ backgroundColor: 'transparent', color: colors.primary }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = colors.transparent10;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
              disabled={loading}
            >
              <X size={isMobile ? 24 : 20} />
            </button>
          </div>

          {/* CONTENT COMPLETAMENTE RESPONSIVO */}
          <div className={`
            ${isMobile 
              ? 'flex-1 overflow-y-auto px-4 py-6 min-h-0' 
              : 'p-4 overflow-y-auto max-h-[calc(90vh-120px)]'
            }
          `} 
          style={{
            overflowX: 'hidden',
            width: '100%',
            maxWidth: '100%'
          }}>
            
            {/* FORMULARIOS RESPONSIVOS */}
            {formularioTipo === 'delivery' ? (
              <TurnoDeliveryForm
                turno={turno}
                trabajoId={trabajoSeleccionadoId}
                trabajos={todosLosTrabajos}
                onSubmit={manejarGuardado}
                onCancel={manejarCerrar}
                onTrabajoChange={manejarCambioTrabajo}
                isMobile={isMobile}
                loading={loading}
                fechaInicial={fechaInicial} 
              />
            ) : (
              <TurnoForm
                turno={turno}
                trabajoId={trabajoSeleccionadoId}
                trabajos={todosLosTrabajos}
                onSubmit={manejarGuardado}
                onCancel={manejarCerrar}
                onTrabajoChange={manejarCambioTrabajo}
                isMobile={isMobile}
                loading={loading}
                fechaInicial={fechaInicial} 
              />
            )}
          </div>

          {/* FOOTER SOLO EN MÓVIL - VISUAL */}
          {isMobile && !loading && (
            <div className="flex-shrink-0 bg-white border-t p-4 flex justify-center"
                 style={{ borderTopColor: colors.transparent20 }}>
              <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>
          )}

          {/* LOADING OVERLAY MEJORADO */}
          {loading && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center"
                 style={{ zIndex: 10000 }}>
              <div className="bg-white rounded-lg p-6 flex items-center space-x-3 shadow-2xl"
                   style={{ borderColor: colors.primary, borderWidth: '2px' }}>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2"
                     style={{ borderColor: colors.primary }}></div>
                <span className="font-medium" style={{ color: colors.primary }}>
                  Guardando turno...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalTurno;