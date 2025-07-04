// src/components/modals/ModalTrabajo/index.jsx

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import TrabajoForm from '../../forms/TrabajoForm';
import SelectorTipoTrabajo from '../SelectorTipoTrabajo';
import ModalTrabajoDelivery from '../ModalTrabajoDelivery';

const ModalTrabajo = ({ isOpen, onClose, trabajo }) => {
  const { addJob, editJob, deliveryEnabled, coloresTemáticos } = useApp();
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
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

  // Determinar si mostrar selector
  useEffect(() => {
    if (isOpen && !trabajo && deliveryEnabled) {
      setMostrarSelector(true);
      setTipoSeleccionado(null);
    } else {
      setMostrarSelector(false);
      if (isOpen && !trabajo && !deliveryEnabled) {
        setTipoSeleccionado('tradicional');
      }
    }
  }, [isOpen, trabajo, deliveryEnabled]);

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

  const manejarSeleccionTipo = (tipo) => {
    setTipoSeleccionado(tipo);
    setMostrarSelector(false);
  };

  const manejarGuardado = async (datosTrabajo) => {
    try {
      setLoading(true);
      
      if (trabajo) {
        await editJob(trabajo.id, datosTrabajo);
      } else {
        await addJob(datosTrabajo);
      }
      
      setTipoSeleccionado(null);
      setMostrarSelector(false);
      setLoading(false);
      onClose();
    } catch (error) {
      setLoading(false);
    }
  };

  const manejarCerrar = () => {
    setTipoSeleccionado(null);
    setMostrarSelector(false);
    setLoading(false);
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

  // Configuración del modal usando modalConfig y coloresTemáticos
  const modalConfig = {
    mobileFullScreen: isMobile,
    size: isMobile ? 'full' : 'lg',
    zIndex: 9999
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style={{ zIndex: modalConfig.zIndex }}
    >
      <div 
        className={`
          bg-white shadow-2xl w-full relative
          ${isMobile 
            ? 'h-full max-w-none rounded-none' 
            : 'max-w-lg max-h-[90vh] rounded-xl'
          }
          ${isMobile ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'}
        `}
      >
        
        {/* Header optimizado con coloresTemáticos */}
        <div 
          className={`
            sticky top-0 bg-white border-b flex justify-between items-center z-10
            ${isMobile ? 'px-4 py-4 min-h-[60px]' : 'p-4'}
          `}
          style={{ 
            borderBottomColor: coloresTemáticos?.transparent20 || 'rgba(236, 72, 153, 0.2)'
          }}
        >
          <h2 
            className={`font-semibold ${isMobile ? 'text-lg' : 'text-xl'}`}
            style={{ color: coloresTemáticos?.base || '#EC4899' }}
          >
            {trabajo ? 'Editar Trabajo' : 'Nuevo Trabajo'}
          </h2>
          <button
            onClick={manejarCerrar}
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: 'transparent',
              color: coloresTemáticos?.base || '#EC4899'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)';
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
          ${isMobile ? 'flex-1 overflow-y-auto px-4 py-6' : 'p-4'}
        `}>
          {mostrarSelector ? (
            <SelectorTipoTrabajo 
              onSelectTipo={manejarSeleccionTipo}
              coloresTemáticos={coloresTemáticos}
              isMobile={isMobile}
            />
          ) : (
            <TrabajoForm
              trabajo={trabajo}
              onSubmit={manejarGuardado}
              onCancel={manejarCerrar}
              loading={loading}
              coloresTemáticos={coloresTemáticos}
              isMobile={isMobile}
            />
          )}
        </div>

        {/* Footer fijo en móvil si es necesario */}
        {isMobile && !mostrarSelector && !loading && (
          <div 
            className="sticky bottom-0 bg-white border-t p-4"
            style={{ 
              borderTopColor: coloresTemáticos?.transparent20 || 'rgba(236, 72, 153, 0.2)'
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
                borderColor: coloresTemáticos?.base || '#EC4899',
                borderWidth: '2px'
              }}
            >
              <div 
                className="animate-spin rounded-full h-6 w-6 border-b-2"
                style={{ borderColor: coloresTemáticos?.base || '#EC4899' }}
              />
              <span 
                className="font-medium"
                style={{ color: coloresTemáticos?.base || '#EC4899' }}
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

export default ModalTrabajo;