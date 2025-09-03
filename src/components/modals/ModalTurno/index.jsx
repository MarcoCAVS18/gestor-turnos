// src/components/modals/ModalTurno/index.jsx - COMPLETAMENTE REESCRITO PARA MÓVIL

import React, ***REMOVED*** useState, useEffect, useMemo ***REMOVED*** from 'react';
import ***REMOVED*** X ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import TurnoForm from '../../forms/TurnoForm';
import TurnoDeliveryForm from '../../forms/TurnoDeliveryForm';

const ModalTurno = (***REMOVED*** isOpen, onClose, turno, trabajoId, fechaInicial ***REMOVED***) => ***REMOVED***
  const ***REMOVED***
    addShift,
    editShift,
    addDeliveryShift,
    editDeliveryShift,
    trabajos,
    trabajosDelivery
  ***REMOVED*** = useApp();

  const colors = useThemeColors();
  const [trabajoSeleccionadoId, setTrabajoSeleccionadoId] = useState(trabajoId || '');
  const [formularioTipo, setFormularioTipo] = useState('tradicional');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  //  DETECCIÓN DE MÓVIL MEJORADA
  useEffect(() => ***REMOVED***
    const checkMobile = () => ***REMOVED***
      const isMobileDevice = window.innerWidth < 768;
      setIsMobile(isMobileDevice);
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

    if (trabajoSeleccionadoId) ***REMOVED***
      const trabajo = todosLosTrabajos.find(t => t.id === trabajoSeleccionadoId);
      
      if (trabajo) ***REMOVED***
        const esDelivery = trabajo.tipo === 'delivery' || trabajo.type === 'delivery';
        const nuevoTipo = esDelivery ? 'delivery' : 'tradicional';
        
        if (formularioTipo !== nuevoTipo) ***REMOVED***
          setFormularioTipo(nuevoTipo);
        ***REMOVED***
      ***REMOVED*** else ***REMOVED***
        setFormularioTipo('tradicional');
      ***REMOVED***
    ***REMOVED*** else ***REMOVED***
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

  // PREVENIR SCROLL DEL BODY MEJORADO
  useEffect(() => ***REMOVED***
    if (isOpen) ***REMOVED***
      // Guardar el scroll actual
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-$***REMOVED***scrollY***REMOVED***px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    ***REMOVED*** else ***REMOVED***
      // Restaurar el scroll
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) ***REMOVED***
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      ***REMOVED***
    ***REMOVED***
    
    return () => ***REMOVED***
      // Cleanup en caso de desmontaje
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    ***REMOVED***;
  ***REMOVED***, [isOpen]);

  const manejarGuardado = async (datosTurno) => ***REMOVED***
    try ***REMOVED***
      setLoading(true);

      // Si fechaInicial está disponible y no hay turno (es nuevo), usar fechaInicial
      let datosFinales = ***REMOVED*** ...datosTurno ***REMOVED***;
      
      if (fechaInicial && !turno) ***REMOVED***
        let fechaStr;
        if (fechaInicial instanceof Date) ***REMOVED***
          const year = fechaInicial.getFullYear();
          const month = String(fechaInicial.getMonth() + 1).padStart(2, '0');
          const day = String(fechaInicial.getDate()).padStart(2, '0');
          fechaStr = `$***REMOVED***year***REMOVED***-$***REMOVED***month***REMOVED***-$***REMOVED***day***REMOVED***`;
        ***REMOVED*** else ***REMOVED***
          fechaStr = fechaInicial;
        ***REMOVED***
        
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

  // CONFIGURACIÓN DEL MODAL COMPLETAMENTE RESPONSIVA
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50"
      style=***REMOVED******REMOVED*** zIndex: 9999 ***REMOVED******REMOVED***
    >
      ***REMOVED***/* CONTENEDOR PRINCIPAL RESPONSIVO */***REMOVED***
      <div className=***REMOVED***`
        fixed inset-0 
        $***REMOVED***isMobile 
          ? 'flex items-end justify-center' 
          : 'flex items-center justify-center p-4'
        ***REMOVED***
      `***REMOVED***>
        ***REMOVED***/* MODAL ESTILO BOTTOM SHEET EN MÓVIL */***REMOVED***
        <div className=***REMOVED***`
          bg-white shadow-2xl relative
          $***REMOVED***isMobile
            ? 'w-full max-h-[90vh] rounded-t-2xl flex flex-col' 
            : 'w-full max-w-md max-h-[90vh] rounded-xl overflow-hidden'
          ***REMOVED***
        `***REMOVED***>
          
          ***REMOVED***/* HEADER OPTIMIZADO */***REMOVED***
          <div className=***REMOVED***`
            flex-shrink-0 bg-white border-b flex justify-between items-center
            $***REMOVED***isMobile ? 'px-4 py-4 min-h-[60px]' : 'px-4 py-4'***REMOVED***
          `***REMOVED***
          style=***REMOVED******REMOVED*** borderBottomColor: colors.transparent20 ***REMOVED******REMOVED***>
            
            <div className="flex-1 pr-4 min-w-0">
              <h2 className=***REMOVED***`font-semibold truncate $***REMOVED***isMobile ? 'text-lg' : 'text-xl'***REMOVED***`***REMOVED***
                  style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
                ***REMOVED***turno ? 'Editar Turno' : 'Nuevo Turno'***REMOVED***
                ***REMOVED***formularioTipo === 'delivery' && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    • Delivery
                  </span>
                )***REMOVED***
              </h2>
              
              ***REMOVED***/* Mostrar fecha si viene del calendario */***REMOVED***
              ***REMOVED***fechaInicial && !turno && (
                <p className="text-sm font-normal text-gray-600 mt-1">
                  ***REMOVED***fechaInicial instanceof Date 
                    ? fechaInicial.toLocaleDateString('es-ES', ***REMOVED*** 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short' 
                      ***REMOVED***)
                    : new Date(fechaInicial + 'T00:00:00').toLocaleDateString('es-ES', ***REMOVED*** 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short' 
                      ***REMOVED***)
                  ***REMOVED***
                </p>
              )***REMOVED***
            </div>
            
            <button
              onClick=***REMOVED***manejarCerrar***REMOVED***
              className="flex-shrink-0 p-2 rounded-lg transition-colors"
              style=***REMOVED******REMOVED*** backgroundColor: 'transparent', color: colors.primary ***REMOVED******REMOVED***
              onMouseEnter=***REMOVED***(e) => ***REMOVED***
                e.target.style.backgroundColor = colors.transparent10;
              ***REMOVED******REMOVED***
              onMouseLeave=***REMOVED***(e) => ***REMOVED***
                e.target.style.backgroundColor = 'transparent';
              ***REMOVED******REMOVED***
              disabled=***REMOVED***loading***REMOVED***
            >
              <X size=***REMOVED***isMobile ? 24 : 20***REMOVED*** />
            </button>
          </div>

          ***REMOVED***/* CONTENT COMPLETAMENTE RESPONSIVO */***REMOVED***
          <div className=***REMOVED***`
            $***REMOVED***isMobile 
              ? 'flex-1 overflow-y-auto px-4 py-6 min-h-0' 
              : 'p-4 overflow-y-auto max-h-[calc(90vh-120px)]'
            ***REMOVED***
          `***REMOVED*** 
          style=***REMOVED******REMOVED***
            overflowX: 'hidden',
            width: '100%',
            maxWidth: '100%'
          ***REMOVED******REMOVED***>
            
            ***REMOVED***/* FORMULARIOS RESPONSIVOS */***REMOVED***
            ***REMOVED***formularioTipo === 'delivery' ? (
              <TurnoDeliveryForm
                turno=***REMOVED***turno***REMOVED***
                trabajoId=***REMOVED***trabajoSeleccionadoId***REMOVED***
                trabajos=***REMOVED***todosLosTrabajos***REMOVED***
                onSubmit=***REMOVED***manejarGuardado***REMOVED***
                onCancel=***REMOVED***manejarCerrar***REMOVED***
                onTrabajoChange=***REMOVED***manejarCambioTrabajo***REMOVED***
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
                isMobile=***REMOVED***isMobile***REMOVED***
                loading=***REMOVED***loading***REMOVED***
                fechaInicial=***REMOVED***fechaInicial***REMOVED*** 
              />
            )***REMOVED***
          </div>

          ***REMOVED***/* FOOTER SOLO EN MÓVIL - VISUAL */***REMOVED***
          ***REMOVED***isMobile && !loading && (
            <div className="flex-shrink-0 bg-white border-t p-4 flex justify-center"
                 style=***REMOVED******REMOVED*** borderTopColor: colors.transparent20 ***REMOVED******REMOVED***>
              <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>
          )***REMOVED***

          ***REMOVED***/* LOADING OVERLAY MEJORADO */***REMOVED***
          ***REMOVED***loading && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center"
                 style=***REMOVED******REMOVED*** zIndex: 10000 ***REMOVED******REMOVED***>
              <div className="bg-white rounded-lg p-6 flex items-center space-x-3 shadow-2xl"
                   style=***REMOVED******REMOVED*** borderColor: colors.primary, borderWidth: '2px' ***REMOVED******REMOVED***>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2"
                     style=***REMOVED******REMOVED*** borderColor: colors.primary ***REMOVED******REMOVED***></div>
                <span className="font-medium" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
                  Guardando turno...
                </span>
              </div>
            </div>
          )***REMOVED***
        </div>
      </div>
    </div>
  );
***REMOVED***;

export default ModalTurno;