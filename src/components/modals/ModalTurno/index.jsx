// src/components/modals/ModalTurno/index.jsx

import React, ***REMOVED*** useState, useEffect, useMemo ***REMOVED*** from 'react';
import ***REMOVED*** X ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import TurnoForm from '../../forms/TurnoForm';
import TurnoDeliveryForm from '../../forms/TurnoDeliveryForm';

const ModalTurno = (***REMOVED*** isOpen, onClose, turno, trabajoId, fechaInicial ***REMOVED***) => ***REMOVED***
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

  // Determinar el tipo de formulario basado en el trabajo - MEJORADA
  useEffect(() => ***REMOVED***
    if (turno?.tipo === 'delivery') ***REMOVED***
      setFormularioTipo('delivery');
      return;
    ***REMOVED***

    // Si hay un trabajo seleccionado, determinar el tipo basándose en el trabajo actual
    if (trabajoSeleccionadoId) ***REMOVED***
      const trabajo = todosLosTrabajos.find(t => t.id === trabajoSeleccionadoId);
      
      if (trabajo) ***REMOVED***
        const esDelivery = trabajo.tipo === 'delivery' || trabajo.type === 'delivery';
        const nuevoTipo = esDelivery ? 'delivery' : 'tradicional';
        
        // Solo cambiar si es diferente para evitar re-renders innecesarios
        if (formularioTipo !== nuevoTipo) ***REMOVED***
          setFormularioTipo(nuevoTipo);
        ***REMOVED***
      ***REMOVED*** else ***REMOVED***
        // Si no se encuentra el trabajo, usar tradicional por defecto
        setFormularioTipo('tradicional');
      ***REMOVED***
    ***REMOVED*** else ***REMOVED***
      // Si no hay trabajo seleccionado, usar tradicional por defecto
      setFormularioTipo('tradicional');
    ***REMOVED***
  ***REMOVED***, [trabajoSeleccionadoId, todosLosTrabajos, turno, formularioTipo]);

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

      // Si fechaInicial está disponible y no hay turno (es nuevo), usar fechaInicial
      let datosFinales = ***REMOVED*** ...datosTurno ***REMOVED***;
      
      if (fechaInicial && !turno) ***REMOVED***
        // Convertir fechaInicial a string formato YYYY-MM-DD si es Date
        let fechaStr;
        if (fechaInicial instanceof Date) ***REMOVED***
          const year = fechaInicial.getFullYear();
          const month = String(fechaInicial.getMonth() + 1).padStart(2, '0');
          const day = String(fechaInicial.getDate()).padStart(2, '0');
          fechaStr = `$***REMOVED***year***REMOVED***-$***REMOVED***month***REMOVED***-$***REMOVED***day***REMOVED***`;
        ***REMOVED*** else ***REMOVED***
          fechaStr = fechaInicial;
        ***REMOVED***
        
        // Pre-llenar la fecha si no está definida en los datos del turno
        if (!datosFinales.fechaInicio && !datosFinales.fecha) ***REMOVED***
          datosFinales.fechaInicio = fechaStr;
        ***REMOVED***
      ***REMOVED***

      if (formularioTipo === 'delivery') ***REMOVED***
        if (turno) ***REMOVED***
          await editDeliveryShift(turno.id, datosFinales);
        ***REMOVED*** else ***REMOVED***
          await addDeliveryShift(datosFinales);
        ***REMOVED***
      ***REMOVED*** else ***REMOVED***
        if (turno) ***REMOVED***
          await editShift(turno.id, datosFinales);
        ***REMOVED*** else ***REMOVED***
          await addShift(datosFinales);
        ***REMOVED***
      ***REMOVED***

      setLoading(false);
      onClose();
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error al guardar turno:', error);
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;

  // Manejar cambio de trabajo y actualizar el tipo automáticamente
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

  // Configuración del modal optimizada para evitar scroll horizontal
  const modalConfig = ***REMOVED***
    mobileFullScreen: isMobile,
    size: isMobile ? 'full' : 'md',
    zIndex: 9999
  ***REMOVED***;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-hidden"
      style=***REMOVED******REMOVED*** zIndex: modalConfig.zIndex ***REMOVED******REMOVED***
    >
      <div
        className=***REMOVED***`
          bg-white shadow-2xl relative
          $***REMOVED***isMobile
            ? 'w-full h-full max-w-none rounded-none'
            : 'w-full max-w-md max-h-[90vh] rounded-xl mx-4'
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
          <div className="flex-1 pr-4 min-w-0">
            <h2
              className=***REMOVED***`font-semibold truncate $***REMOVED***isMobile ? 'text-lg' : 'text-xl'***REMOVED***`***REMOVED***
              style=***REMOVED******REMOVED*** color: thematicColors?.base || '#EC4899' ***REMOVED******REMOVED***
            >
              ***REMOVED***turno ? 'Editar Turno' : 'Nuevo Turno'***REMOVED***
              ***REMOVED***formularioTipo === 'delivery' && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  • Delivery
                </span>
              )***REMOVED***
              ***REMOVED***/* Mostrar fecha si viene del calendario */***REMOVED***
              ***REMOVED***fechaInicial && !turno && (
                <span className="text-sm font-normal text-gray-600 ml-2 block">
                  ***REMOVED***fechaInicial instanceof Date 
                    ? fechaInicial.toLocaleDateString('es-ES', ***REMOVED*** weekday: 'short', day: 'numeric', month: 'short' ***REMOVED***)
                    : new Date(fechaInicial + 'T00:00:00').toLocaleDateString('es-ES', ***REMOVED*** weekday: 'short', day: 'numeric', month: 'short' ***REMOVED***)
                  ***REMOVED***
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
          $***REMOVED***isMobile ? 'flex-1 overflow-y-auto px-4 py-6' : 'p-4 overflow-y-auto'***REMOVED***
          $***REMOVED***!isMobile ? 'max-h-[calc(90vh-120px)]' : ''***REMOVED***
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
              fechaInicial=***REMOVED***fechaInicial***REMOVED*** 
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
              fechaInicial=***REMOVED***fechaInicial***REMOVED*** 
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