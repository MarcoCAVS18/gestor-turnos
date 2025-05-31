// src/pages/Turnos.jsx - REFACTORIZADO

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** PlusCircle, Calendar ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

import TarjetaTurno from '../components/cards/TarjetaTurno';
import ModalTurno from '../components/modals/ModalTurno';
import AlertaEliminacion from '../components/alerts/AlertaEliminacion';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import ListSection from '../components/sections/ListSection';
import Card from '../components/ui/Card';
import ***REMOVED*** useDeleteManager ***REMOVED*** from '../hooks/useDeleteManager';
import ***REMOVED*** useUtils ***REMOVED*** from '../hooks/useUtils';

const DaySection = (***REMOVED*** fecha, turnos, trabajos, onEditTurno, onDeleteTurno ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** formatDate, isToday, isYesterday ***REMOVED*** = useUtils();
  const ***REMOVED*** coloresTemáticos ***REMOVED*** = useApp();
  
  const formatearFechaEncabezado = (fechaStr) => ***REMOVED***
    if (isToday(fechaStr)) return 'Hoy';
    if (isYesterday(fechaStr)) return 'Ayer';
    return formatDate(fechaStr, 'full');
  ***REMOVED***;
  
  const obtenerTrabajo = (trabajoId) => ***REMOVED***
    return trabajos.find(trabajo => trabajo.id === trabajoId);
  ***REMOVED***;

  return (
    <Card className="overflow-hidden" padding="none">
      ***REMOVED***/* Header del día */***REMOVED***
      <div 
        className="px-4 py-3 border-b flex justify-between items-center"
        style=***REMOVED******REMOVED*** backgroundColor: coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)' ***REMOVED******REMOVED***
      >
        <div className="flex items-center">
          <Calendar size=***REMOVED***18***REMOVED*** style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED*** className="mr-2" />
          <h3 className="font-semibold text-gray-800 capitalize">
            ***REMOVED***formatearFechaEncabezado(fecha)***REMOVED***
          </h3>
          <span className="ml-2 text-sm text-gray-500">
            (***REMOVED***new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', ***REMOVED*** 
              day: '2-digit', 
              month: '2-digit' 
            ***REMOVED***)***REMOVED***)
          </span>
        </div>
      </div>
      
      ***REMOVED***/* Lista de turnos */***REMOVED***
      <div className="p-4 space-y-3">
        ***REMOVED***turnos.map(turno => ***REMOVED***
          const trabajo = obtenerTrabajo(turno.trabajoId);
          if (!trabajo) return null;
          
          return (
            <TarjetaTurno
              key=***REMOVED***turno.id***REMOVED***
              turno=***REMOVED***turno***REMOVED***
              trabajo=***REMOVED***trabajo***REMOVED***
              onEdit=***REMOVED***onEditTurno***REMOVED***
              onDelete=***REMOVED***onDeleteTurno***REMOVED***
            />
          );
        ***REMOVED***)***REMOVED***
      </div>
    </Card>
  );
***REMOVED***;

const Turnos = () => ***REMOVED***
  const ***REMOVED*** turnosPorFecha, cargando, borrarTurno, trabajos ***REMOVED*** = useApp();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  
  const ***REMOVED*** sortByDateDesc ***REMOVED*** = useUtils();
  const deleteManager = useDeleteManager(borrarTurno);
  
  // Funciones para modales
  const abrirModalNuevoTurno = () => ***REMOVED***
    setTurnoSeleccionado(null);
    setModalAbierto(true);
  ***REMOVED***;
  
  const abrirModalEditarTurno = (turno) => ***REMOVED***
    setTurnoSeleccionado(turno);
    setModalAbierto(true);
  ***REMOVED***;
  
  const cerrarModal = () => ***REMOVED***
    setModalAbierto(false);
    setTurnoSeleccionado(null);
  ***REMOVED***;
  
  // Obtener trabajo de un turno
  const obtenerTrabajo = (trabajoId) => ***REMOVED***
    return trabajos.find(trabajo => trabajo.id === trabajoId);
  ***REMOVED***;
  
  // Generar detalles para eliminación
  const generarDetallesTurno = (turno) => ***REMOVED***
    if (!turno) return [];
    
    const trabajo = obtenerTrabajo(turno.trabajoId);
    
    return [
      trabajo?.nombre || 'Trabajo no encontrado',
      new Date(turno.fecha + 'T00:00:00').toLocaleDateString('es-ES', ***REMOVED***
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      ***REMOVED***),
      `$***REMOVED***turno.horaInicio***REMOVED*** - $***REMOVED***turno.horaFin***REMOVED***`
    ];
  ***REMOVED***;

  // Ordenar fechas y crear componentes de día
  const diasOrdenados = Object.entries(turnosPorFecha)
    .sort(([fechaA], [fechaB]) => new Date(fechaB) - new Date(fechaA));

  return (
    <LoadingWrapper loading=***REMOVED***cargando***REMOVED***>
      <ListSection
        title="Mis Turnos"
        action=***REMOVED******REMOVED***
          label: 'Nuevo Turno',
          icon: PlusCircle,
          onClick: abrirModalNuevoTurno
        ***REMOVED******REMOVED***
        items=***REMOVED***diasOrdenados***REMOVED***
        emptyState=***REMOVED******REMOVED***
          icon: Calendar,
          title: 'No hay turnos registrados',
          description: 'Comienza agregando tu primer turno',
          action: ***REMOVED***
            label: 'Agregar primer turno',
            icon: PlusCircle,
            onClick: abrirModalNuevoTurno
          ***REMOVED***
        ***REMOVED******REMOVED***
        renderItem=***REMOVED***([fecha, turnosDia]) => (
          <DaySection
            key=***REMOVED***fecha***REMOVED***
            fecha=***REMOVED***fecha***REMOVED***
            turnos=***REMOVED***turnosDia***REMOVED***
            trabajos=***REMOVED***trabajos***REMOVED***
            onEditTurno=***REMOVED***abrirModalEditarTurno***REMOVED***
            onDeleteTurno=***REMOVED***deleteManager.startDeletion***REMOVED***
          />
        )***REMOVED***
        className="space-y-6"
      />
      
      ***REMOVED***/* Modales */***REMOVED***
      <ModalTurno 
        isOpen=***REMOVED***modalAbierto***REMOVED*** 
        onClose=***REMOVED***cerrarModal***REMOVED*** 
        turno=***REMOVED***turnoSeleccionado***REMOVED*** 
      />
      
      <AlertaEliminacion
        visible=***REMOVED***deleteManager.showDeleteModal***REMOVED***
        onCancel=***REMOVED***deleteManager.cancelDeletion***REMOVED***
        onConfirm=***REMOVED***deleteManager.confirmDeletion***REMOVED***
        eliminando=***REMOVED***deleteManager.deleting***REMOVED***
        tipo="turno"
        detalles=***REMOVED***generarDetallesTurno(deleteManager.itemToDelete)***REMOVED***
      />
    </LoadingWrapper>
  );
***REMOVED***;

export default Turnos;