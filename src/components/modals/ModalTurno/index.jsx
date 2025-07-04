// src/components/modals/ModalTurno/index.jsx

import React, ***REMOVED*** useState, useEffect, useMemo ***REMOVED*** from 'react';
import ***REMOVED*** X ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import TurnoForm from '../../forms/TurnoForm';
import TurnoDeliveryForm from '../../forms/TurnoDeliveryForm';

const ModalTurno = (***REMOVED*** isOpen, onClose, turno, trabajoId ***REMOVED***) => ***REMOVED***
  const ***REMOVED***
    agregarTurno,
    editarTurno,
    agregarTurnoDelivery,
    editarTurnoDelivery,
    trabajos,
    trabajosDelivery,
    coloresTemáticos
  ***REMOVED*** = useApp();

  const [trabajoSeleccionadoId, setTrabajoSeleccionadoId] = useState(trabajoId || '');
  const [formularioTipo, setFormularioTipo] = useState('tradicional');
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
      setFormularioTipo(trabajo?.tipo === 'delivery' ? 'delivery' : 'tradicional');
    ***REMOVED*** else ***REMOVED***
      setFormularioTipo('tradicional');
    ***REMOVED***
  ***REMOVED***, [trabajoSeleccionadoId, todosLosTrabajos, turno]);

  // Reset cuando se abre/cierra el modal
  useEffect(() => ***REMOVED***
    if (!isOpen) ***REMOVED***
      setTrabajoSeleccionadoId('');
      setFormularioTipo('tradicional');
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
      if (formularioTipo === 'delivery') ***REMOVED***
        if (turno) ***REMOVED***
          await editarTurnoDelivery(turno.id, datosTurno);
        ***REMOVED*** else ***REMOVED***
          await agregarTurnoDelivery(datosTurno);
        ***REMOVED***
      ***REMOVED*** else ***REMOVED***
        if (turno) ***REMOVED***
          await editarTurno(turno.id, datosTurno);
        ***REMOVED*** else ***REMOVED***
          await agregarTurno(datosTurno);
        ***REMOVED***
      ***REMOVED***
      onClose();
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error al guardar turno:', error);
    ***REMOVED***
  ***REMOVED***;

  const manejarCambioTrabajo = (nuevoTrabajoId) => ***REMOVED***
    setTrabajoSeleccionadoId(nuevoTrabajoId);
  ***REMOVED***;

  if (!isOpen) return null;

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
          <div className="flex-1 pr-4">
            <h2 className=***REMOVED***`font-semibold $***REMOVED***isMobile ? 'text-lg' : 'text-xl'***REMOVED***`***REMOVED***>
              ***REMOVED***turno ? 'Editar Turno' : 'Nuevo Turno'***REMOVED***
              ***REMOVED***formularioTipo === 'delivery' && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  • Delivery
                </span>
              )***REMOVED***
            </h2>
          </div>
          <button
            onClick=***REMOVED***onClose***REMOVED***
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            style=***REMOVED******REMOVED***
              color: coloresTemáticos?.base || '#EC4899'
            ***REMOVED******REMOVED***
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
              onCancel=***REMOVED***onClose***REMOVED***
              onTrabajoChange=***REMOVED***manejarCambioTrabajo***REMOVED***
            />
          ) : (
            <TurnoForm
              turno=***REMOVED***turno***REMOVED***
              trabajoId=***REMOVED***trabajoSeleccionadoId***REMOVED***
              trabajos=***REMOVED***todosLosTrabajos***REMOVED*** 
              onSubmit=***REMOVED***manejarGuardado***REMOVED***
              onCancel=***REMOVED***onClose***REMOVED***
              onTrabajoChange=***REMOVED***manejarCambioTrabajo***REMOVED***
            />
          )***REMOVED***
        </div>

        ***REMOVED***/* Indicador visual en móvil */***REMOVED***
        ***REMOVED***isMobile && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-2">
            <div className="flex justify-center">
              <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        )***REMOVED***
      </div>
    </div>
  );
***REMOVED***;

export default ModalTurno;