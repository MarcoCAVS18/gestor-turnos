// src/components/modals/ModalTurno/index.jsx

import React, ***REMOVED*** useState, useEffect, useMemo ***REMOVED*** from 'react';
import ***REMOVED*** X ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import TurnoForm from '../../forms/TurnoForm';
import TurnoDeliveryForm from '../../forms/TurnoDeliveryForm';

const ModalTurno = (***REMOVED*** isOpen, onClose, turno, trabajoId ***REMOVED***) => ***REMOVED***
  const ***REMOVED***
    addShift,
    editShift,
    addDeliveryShift,
    editDeliveryShift,
    trabajos,
    trabajosDelivery,
    thematicColors
  ***REMOVED*** = useApp();

  const [trabajoSeleccionadoId, setTrabajoSeleccionadoId] = useState(trabajoId || '');
  const [formularioTipo, setFormularioTipo] = useState('tradicional');
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

  // Combinar todos los trabajos para el selector usando useMemo
  const todosLosTrabajos = useMemo(() => ***REMOVED***
    return [...trabajos, ...trabajosDelivery];
  ***REMOVED***, [trabajos, trabajosDelivery]);

  // Determinar el tipo de formulario basado en el trabajo
  useEffect(() => ***REMOVED***
    if (turno?.tipo === 'delivery') ***REMOVED***
      setFormularioTipo('delivery');
    ***REMOVED*** else if (trabajoSeleccionadoId) ***REMOVED***
      const trabajo = todosLosTrabajos.find(t => t.id === trabajoSeleccionadoId);
      const esDelivery = trabajo?.tipo === 'delivery' || trabajo?.type === 'delivery';
      setFormularioTipo(esDelivery ? 'delivery' : 'tradicional');

    ***REMOVED*** else ***REMOVED***
      setFormularioTipo('tradicional');
    ***REMOVED***
  ***REMOVED***, [trabajoSeleccionadoId, todosLosTrabajos, turno]);

  // Reset cuando se abre/cierra el modal
  useEffect(() => ***REMOVED***
    if (!isOpen) ***REMOVED***
      setTrabajoSeleccionadoId('');
      setFormularioTipo('tradicional');
      setLoading(false);
    ***REMOVED*** else if (turno) ***REMOVED***
      setTrabajoSeleccionadoId(turno.trabajoId || '');
    ***REMOVED*** else if (trabajoId) ***REMOVED***
      setTrabajoSeleccionadoId(trabajoId);
    ***REMOVED***
  ***REMOVED***, [isOpen, turno, trabajoId]);

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

  const manejarGuardado = async (datosTurno) => ***REMOVED***
    try ***REMOVED***
      setLoading(true);

      if (formularioTipo === 'delivery') ***REMOVED***
        if (turno) ***REMOVED***
          await editDeliveryShift(turno.id, datosTurno);
        ***REMOVED*** else ***REMOVED***
          await addDeliveryShift(datosTurno);
        ***REMOVED***
      ***REMOVED*** else ***REMOVED***
        if (turno) ***REMOVED***
          await editShift(turno.id, datosTurno);
        ***REMOVED*** else ***REMOVED***
          await addShift(datosTurno);
        ***REMOVED***
      ***REMOVED***

      setLoading(false);
      onClose();
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error al guardar turno:', error);
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;

  const manejarCambioTrabajo = (nuevoTrabajoId) => ***REMOVED***
    setTrabajoSeleccionadoId(nuevoTrabajoId);
  ***REMOVED***;

  const manejarCerrar = () => ***REMOVED***
    setTrabajoSeleccionadoId('');
    setFormularioTipo('tradicional');
    setLoading(false);
    onClose();
  ***REMOVED***;

  if (!isOpen) return null;

  // Configuración del modal optimizada
  const modalConfig = ***REMOVED***
    mobileFullScreen: isMobile,
    size: isMobile ? 'full' : 'lg',
    zIndex: 9999
  ***REMOVED***;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style=***REMOVED******REMOVED*** zIndex: modalConfig.zIndex ***REMOVED******REMOVED***
    >
      <div
        className=***REMOVED***`
          bg-white shadow-2xl w-full relative
          $***REMOVED***isMobile
            ? 'h-full max-w-none rounded-none'
            : 'max-w-lg max-h-[90vh] rounded-xl'
          ***REMOVED***
          $***REMOVED***isMobile ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'***REMOVED***
        `***REMOVED***
      >

        ***REMOVED***/* Header optimizado con thematicColors */***REMOVED***
        <div
          className=***REMOVED***`
            sticky top-0 bg-white border-b flex justify-between items-center z-10
            $***REMOVED***isMobile ? 'px-4 py-4 min-h-[60px]' : 'p-4'***REMOVED***
          `***REMOVED***
          style=***REMOVED******REMOVED***
            borderBottomColor: thematicColors?.transparent20 || 'rgba(236, 72, 153, 0.2)'
          ***REMOVED******REMOVED***
        >
          <div className="flex-1 pr-4">
            <h2
              className=***REMOVED***`font-semibold $***REMOVED***isMobile ? 'text-lg' : 'text-xl'***REMOVED***`***REMOVED***
              style=***REMOVED******REMOVED*** color: thematicColors?.base || '#EC4899' ***REMOVED******REMOVED***
            >
              ***REMOVED***turno ? 'Editar Turno' : 'Nuevo Turno'***REMOVED***
              ***REMOVED***formularioTipo === 'delivery' && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  • Delivery
                </span>
              )***REMOVED***
            </h2>
          </div>
          <button
            onClick=***REMOVED***manejarCerrar***REMOVED***
            className="p-2 rounded-lg transition-colors flex-shrink-0"
            style=***REMOVED******REMOVED***
              backgroundColor: 'transparent',
              color: thematicColors?.base || '#EC4899'
            ***REMOVED******REMOVED***
            onMouseEnter=***REMOVED***(e) => ***REMOVED***
              e.target.style.backgroundColor = thematicColors?.transparent10 || 'rgba(236, 72, 153, 0.1)';
            ***REMOVED******REMOVED***
            onMouseLeave=***REMOVED***(e) => ***REMOVED***
              e.target.style.backgroundColor = 'transparent';
            ***REMOVED******REMOVED***
            disabled=***REMOVED***loading***REMOVED***
          >
            <X size=***REMOVED***isMobile ? 24 : 20***REMOVED*** />
          </button>
        </div>

        ***REMOVED***/* Content con scroll optimizado */***REMOVED***
        <div className=***REMOVED***`
          $***REMOVED***isMobile ? 'flex-1 overflow-y-auto px-4 py-6' : 'p-4'***REMOVED***
        `***REMOVED***>
          ***REMOVED***formularioTipo === 'delivery' ? (
            <TurnoDeliveryForm
              turno=***REMOVED***turno***REMOVED***
              trabajoId=***REMOVED***trabajoSeleccionadoId***REMOVED***
              trabajos=***REMOVED***todosLosTrabajos***REMOVED***
              onSubmit=***REMOVED***manejarGuardado***REMOVED***
              onCancel=***REMOVED***manejarCerrar***REMOVED***
              onTrabajoChange=***REMOVED***manejarCambioTrabajo***REMOVED***
              thematicColors=***REMOVED***thematicColors***REMOVED***
              isMobile=***REMOVED***isMobile***REMOVED***
              loading=***REMOVED***loading***REMOVED***
            />
          ) : (
            <TurnoForm
              turno=***REMOVED***turno***REMOVED***
              trabajoId=***REMOVED***trabajoSeleccionadoId***REMOVED***
              trabajos=***REMOVED***todosLosTrabajos***REMOVED***
              onSubmit=***REMOVED***manejarGuardado***REMOVED***
              onCancel=***REMOVED***manejarCerrar***REMOVED***
              onTrabajoChange=***REMOVED***manejarCambioTrabajo***REMOVED***
              thematicColors=***REMOVED***thematicColors***REMOVED***
              isMobile=***REMOVED***isMobile***REMOVED***
              loading=***REMOVED***loading***REMOVED***
            />
          )***REMOVED***
        </div>

        ***REMOVED***/* Footer fijo en móvil si es necesario */***REMOVED***
        ***REMOVED***isMobile && !loading && (
          <div
            className="sticky bottom-0 bg-white border-t p-4"
            style=***REMOVED******REMOVED***
              borderTopColor: thematicColors?.transparent20 || 'rgba(236, 72, 153, 0.2)'
            ***REMOVED******REMOVED***
          >
            <div className="text-xs text-gray-500 text-center">
              Desliza hacia abajo para cerrar
            </div>
          </div>
        )***REMOVED***

        ***REMOVED***/* Indicador de carga */***REMOVED***
        ***REMOVED***loading && (
          <div
            className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center"
            style=***REMOVED******REMOVED*** zIndex: modalConfig.zIndex + 1 ***REMOVED******REMOVED***
          >
            <div
              className="bg-white rounded-lg p-4 flex items-center space-x-3"
              style=***REMOVED******REMOVED***
                borderColor: thematicColors?.base || '#EC4899',
                borderWidth: '2px'
              ***REMOVED******REMOVED***
            >
              <div
                className="animate-spin rounded-full h-6 w-6 border-b-2"
                style=***REMOVED******REMOVED*** borderColor: thematicColors?.base || '#EC4899' ***REMOVED******REMOVED***
              />
              <span
                className="font-medium"
                style=***REMOVED******REMOVED*** color: thematicColors?.base || '#EC4899' ***REMOVED******REMOVED***
              >
                Guardando...
              </span>
            </div>
          </div>
        )***REMOVED***
      </div>
    </div>
  );
***REMOVED***;

export default ModalTurno;