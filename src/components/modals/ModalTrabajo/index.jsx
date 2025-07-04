// src/components/modals/ModalTrabajo/index.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** X ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import TrabajoForm from '../../forms/TrabajoForm';
import SelectorTipoTrabajo from '../SelectorTipoTrabajo';
import ModalTrabajoDelivery from '../ModalTrabajoDelivery';

const ModalTrabajo = (***REMOVED*** isOpen, onClose, trabajo ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** addJob, editJob, deliveryEnabled, coloresTemáticos ***REMOVED*** = useApp();
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar móvil
  useEffect(() => ***REMOVED***
    const checkMobile = () => ***REMOVED***
      setIsMobile(window.innerWidth < 768);
    ***REMOVED***;
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  ***REMOVED***, []);

  // Determinar si mostrar selector
  useEffect(() => ***REMOVED***
    if (isOpen && !trabajo && deliveryEnabled) ***REMOVED***
      setMostrarSelector(true);
      setTipoSeleccionado(null);
    ***REMOVED*** else ***REMOVED***
      setMostrarSelector(false);
      if (isOpen && !trabajo && !deliveryEnabled) ***REMOVED***
        setTipoSeleccionado('tradicional');
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***, [isOpen, trabajo, deliveryEnabled]);

  // Prevenir scroll del body
  useEffect(() => ***REMOVED***
    if (isOpen) ***REMOVED***
      document.body.style.overflow = 'hidden';
    ***REMOVED*** else ***REMOVED***
      document.body.style.overflow = 'unset';
    ***REMOVED***
    
    return () => ***REMOVED***
      document.body.style.overflow = 'unset';
    ***REMOVED***;
  ***REMOVED***, [isOpen]);

  const manejarSeleccionTipo = (tipo) => ***REMOVED***
    setTipoSeleccionado(tipo);
    setMostrarSelector(false);
  ***REMOVED***;

  const manejarGuardado = async (datosTrabajo) => ***REMOVED***
    try ***REMOVED***
      setLoading(true);
      
      if (trabajo) ***REMOVED***
        await editJob(trabajo.id, datosTrabajo);
      ***REMOVED*** else ***REMOVED***
        await addJob(datosTrabajo);
      ***REMOVED***
      
      setTipoSeleccionado(null);
      setMostrarSelector(false);
      setLoading(false);
      onClose();
    ***REMOVED*** catch (error) ***REMOVED***
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;

  const manejarCerrar = () => ***REMOVED***
    setTipoSeleccionado(null);
    setMostrarSelector(false);
    setLoading(false);
    onClose();
  ***REMOVED***;

  if (!isOpen) return null;

  // Si es un trabajo de delivery existente, usar el modal de delivery directamente
  if (trabajo && trabajo.tipo === 'delivery') ***REMOVED***
    return (
      <ModalTrabajoDelivery
        isOpen=***REMOVED***true***REMOVED***
        onClose=***REMOVED***manejarCerrar***REMOVED***
        trabajo=***REMOVED***trabajo***REMOVED***
      />
    );
  ***REMOVED***

  // Si se seleccionó delivery como tipo
  if (tipoSeleccionado === 'delivery') ***REMOVED***
    return (
      <ModalTrabajoDelivery
        isOpen=***REMOVED***true***REMOVED***
        onClose=***REMOVED***manejarCerrar***REMOVED***
        trabajo=***REMOVED***null***REMOVED***
      />
    );
  ***REMOVED***

  // Configuración específica para móvil vs desktop
  const modalConfig = ***REMOVED***
    mobileFullScreen: isMobile && !mostrarSelector, // Pantalla completa solo para formularios en móvil
    size: isMobile ? 'full' : 'lg'
  ***REMOVED***;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className=***REMOVED***`
        bg-white shadow-2xl w-full
        $***REMOVED***isMobile 
          ? 'h-full max-w-none rounded-none' // Móvil: pantalla completa
          : 'max-w-lg max-h-[90vh] rounded-lg' // Desktop: modal normal
        ***REMOVED***
        $***REMOVED***isMobile ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'***REMOVED***
      `***REMOVED***>
        
        ***REMOVED***/* Header optimizado para móvil */***REMOVED***
        <div className=***REMOVED***`
          sticky top-0 bg-white border-b border-gray-200 flex justify-between items-center z-10
          $***REMOVED***isMobile ? 'px-4 py-4 min-h-[60px]' : 'p-4'***REMOVED***
        `***REMOVED***>
          <h2 className=***REMOVED***`font-semibold $***REMOVED***isMobile ? 'text-lg' : 'text-xl'***REMOVED***`***REMOVED***>
            ***REMOVED***trabajo ? 'Editar Trabajo' : 'Nuevo Trabajo'***REMOVED***
          </h2>
          <button
            onClick=***REMOVED***manejarCerrar***REMOVED***
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled=***REMOVED***loading***REMOVED***
          >
            <X size=***REMOVED***isMobile ? 24 : 20***REMOVED*** />
          </button>
        </div>

        ***REMOVED***/* Content con scroll optimizado */***REMOVED***
        <div className=***REMOVED***`
          $***REMOVED***isMobile ? 'flex-1 overflow-y-auto px-4 py-6' : 'p-4'***REMOVED***
        `***REMOVED***>
          ***REMOVED***mostrarSelector ? (
            <SelectorTipoTrabajo onSelectTipo=***REMOVED***manejarSeleccionTipo***REMOVED*** />
          ) : (
            <TrabajoForm
              trabajo=***REMOVED***trabajo***REMOVED***
              onSubmit=***REMOVED***manejarGuardado***REMOVED***
              onCancel=***REMOVED***manejarCerrar***REMOVED***
              loading=***REMOVED***loading***REMOVED***
            />
          )***REMOVED***
        </div>

        ***REMOVED***/* Footer fijo en móvil si es necesario */***REMOVED***
        ***REMOVED***isMobile && !mostrarSelector && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
            <div className="text-xs text-gray-500 text-center">
              Desliza hacia abajo para cerrar
            </div>
          </div>
        )***REMOVED***
      </div>
    </div>
  );
***REMOVED***;

export default ModalTrabajo;