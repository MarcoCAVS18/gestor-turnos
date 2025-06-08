// src/pages/Turnos.jsx

import React from 'react';
import ***REMOVED*** PlusCircle, Calendar ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** useTurnManager ***REMOVED*** from '../hooks/useTurnManager';
import ***REMOVED*** useDeleteManager ***REMOVED*** from '../hooks/useDeleteManager';
import DaySection from '../components/sections/DaySection';
import ModalTurno from '../components/modals/ModalTurno';
import AlertaEliminacion from '../components/alerts/AlertaEliminacion';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import ListSection from '../components/sections/ListSection';

const Turnos = () => ***REMOVED***
  const ***REMOVED*** turnosPorFecha, cargando, borrarTurno, trabajos ***REMOVED*** = useApp();
  const deleteManager = useDeleteManager(borrarTurno);
  const ***REMOVED*** modalAbierto, turnoSeleccionado, abrirModalNuevo, abrirModalEditar, cerrarModal ***REMOVED*** = useTurnManager();

  // Ordenar fechas y crear componentes de día
  const diasOrdenados = Object.entries(turnosPorFecha)
    .sort(([fechaA], [fechaB]) => new Date(fechaB) - new Date(fechaA));

  const generarDetallesTurno = (turno) => ***REMOVED***
    if (!turno) return [];
    const trabajo = trabajos.find(t => t.id === turno.trabajoId);
    return [
      trabajo?.nombre || 'Trabajo no encontrado',
      new Date(turno.fecha + 'T00:00:00').toLocaleDateString('es-ES', ***REMOVED***
        weekday: 'long', day: 'numeric', month: 'long'
      ***REMOVED***),
      `$***REMOVED***turno.horaInicio***REMOVED*** - $***REMOVED***turno.horaFin***REMOVED***`
    ];
  ***REMOVED***;

  return (
    <LoadingWrapper loading=***REMOVED***cargando***REMOVED***>
      <ListSection
        title="Mis Turnos"
        action=***REMOVED******REMOVED*** label: 'Nuevo Turno', icon: PlusCircle, onClick: abrirModalNuevo ***REMOVED******REMOVED***
        items=***REMOVED***diasOrdenados***REMOVED***
        emptyState=***REMOVED******REMOVED***
          icon: Calendar,
          title: 'No hay turnos registrados',
          description: 'Comienza agregando tu primer turno',
          action: ***REMOVED*** label: 'Agregar primer turno', icon: PlusCircle, onClick: abrirModalNuevo ***REMOVED***
        ***REMOVED******REMOVED***
        renderItem=***REMOVED***([fecha, turnosDia]) => (
          <DaySection
            key=***REMOVED***fecha***REMOVED***
            fecha=***REMOVED***fecha***REMOVED***
            turnos=***REMOVED***turnosDia***REMOVED***
            trabajos=***REMOVED***trabajos***REMOVED***
            onEditTurno=***REMOVED***abrirModalEditar***REMOVED***
            onDeleteTurno=***REMOVED***deleteManager.startDeletion***REMOVED***
          />
        )***REMOVED***
        className="space-y-6"
      />
      
      <ModalTurno isOpen=***REMOVED***modalAbierto***REMOVED*** onClose=***REMOVED***cerrarModal***REMOVED*** turno=***REMOVED***turnoSeleccionado***REMOVED*** />
      
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