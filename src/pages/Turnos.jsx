// src/pages/Turnos.jsx

import React from 'react';
import ***REMOVED*** Calendar, Plus, Briefcase, ArrowRight ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** useTurnManager ***REMOVED*** from '../hooks/useTurnManager';
import ***REMOVED*** useDeleteManager ***REMOVED*** from '../hooks/useDeleteManager';
import DaySection from '../components/sections/DaySection';
import ModalTurno from '../components/modals/ModalTurno';
import AlertaEliminacion from '../components/alerts/AlertaEliminacion';
import LoadingWrapper from '../components/layout/LoadingWrapper';

const Turnos = () => ***REMOVED***
  const ***REMOVED*** 
    turnosPorFecha, 
    cargando, 
    borrarTurno, 
    trabajos, 
    trabajosDelivery,
    coloresTemáticos
  ***REMOVED*** = useApp();
  
  const deleteManager = useDeleteManager(borrarTurno);
  const ***REMOVED*** modalAbierto, turnoSeleccionado, abrirModalNuevo, abrirModalEditar, cerrarModal ***REMOVED*** = useTurnManager();

  // Combinar todos los trabajos
  const todosLosTrabajos = [...trabajos, ...trabajosDelivery];
  
  // Ordenar fechas y crear componentes de día
  const diasOrdenados = Object.entries(turnosPorFecha)
    .sort(([fechaA], [fechaB]) => new Date(fechaB) - new Date(fechaA));

  const hayTurnos = diasOrdenados.length > 0;

  const generarDetallesTurno = (turno) => ***REMOVED***
    if (!turno) return [];
    
    const trabajo = trabajos.find(t => t.id === turno.trabajoId);
    const fecha = new Date(turno.fecha + 'T00:00:00');
    const detalles = [
      trabajo?.nombre || 'Trabajo no encontrado',
      fecha.toLocaleDateString('es-ES', ***REMOVED***
        weekday: 'long', 
        day: 'numeric', 
        month: 'long'
      ***REMOVED***),
      `$***REMOVED***turno.horaInicio***REMOVED*** - $***REMOVED***turno.horaFin***REMOVED***`
    ];
    
    // Agregar detalles específicos según el tipo
    if (turno.tipo === 'delivery') ***REMOVED***
      detalles.push('Turno de Delivery');
      if (turno.numeroPedidos) ***REMOVED***
        detalles.push(`$***REMOVED***turno.numeroPedidos***REMOVED*** pedidos completados`);
      ***REMOVED***
    ***REMOVED***
    
    return detalles;
  ***REMOVED***;

  const handleIrATrabajos = () => ***REMOVED***
    window.location.href = '/trabajos';
  ***REMOVED***;

  const renderEmptyState = () => ***REMOVED***
    if (todosLosTrabajos.length === 0) ***REMOVED***
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div 
            className="p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center"
            style=***REMOVED******REMOVED*** backgroundColor: coloresTemáticos?.transparent10 || 'rgba(255, 152, 0, 0.1)' ***REMOVED******REMOVED***
          >
            <Briefcase 
              className="w-10 h-10" 
              style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#FF9800' ***REMOVED******REMOVED***
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Primero necesitas crear un trabajo</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Para poder registrar turnos, primero debes crear al menos un trabajo con sus tarifas correspondientes.
          </p>
          <button
            onClick=***REMOVED***handleIrATrabajos***REMOVED***
            className="text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2 hover:shadow-md"
            style=***REMOVED******REMOVED*** 
              backgroundColor: '#FF9800'
            ***REMOVED******REMOVED***
            onMouseEnter=***REMOVED***(e) => ***REMOVED***
              e.target.style.backgroundColor = '#F57C00';
            ***REMOVED******REMOVED***
            onMouseLeave=***REMOVED***(e) => ***REMOVED***
              e.target.style.backgroundColor = '#FF9800';
            ***REMOVED******REMOVED***
          >
            <Briefcase className="w-4 h-4" />
            <span>Crear Trabajo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      );
    ***REMOVED***

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div 
          className="p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center"
          style=***REMOVED******REMOVED*** backgroundColor: coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)' ***REMOVED******REMOVED***
        >
          <Calendar 
            className="w-10 h-10" 
            style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED***
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay turnos registrados</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Comienza agregando tu primer turno para empezar a gestionar tus ingresos.
        </p>
        <button
          onClick=***REMOVED***abrirModalNuevo***REMOVED***
          className="text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2 hover:shadow-md"
          style=***REMOVED******REMOVED*** 
            backgroundColor: coloresTemáticos?.base || '#EC4899'
          ***REMOVED******REMOVED***
          onMouseEnter=***REMOVED***(e) => ***REMOVED***
            if (coloresTemáticos?.dark) ***REMOVED***
              e.target.style.backgroundColor = coloresTemáticos.dark;
            ***REMOVED***
          ***REMOVED******REMOVED***
          onMouseLeave=***REMOVED***(e) => ***REMOVED***
            e.target.style.backgroundColor = coloresTemáticos?.base || '#EC4899';
          ***REMOVED******REMOVED***
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Primer Turno</span>
        </button>
      </div>
    );
  ***REMOVED***;

  const getHeaderButton = () => ***REMOVED***
    if (!hayTurnos) return null;

    if (todosLosTrabajos.length === 0) ***REMOVED***
      return (
        <button
          onClick=***REMOVED***handleIrATrabajos***REMOVED***
          className="text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 shadow-sm hover:shadow-md"
          style=***REMOVED******REMOVED*** 
            backgroundColor: '#FF9800'
          ***REMOVED******REMOVED***
          onMouseEnter=***REMOVED***(e) => ***REMOVED***
            e.target.style.backgroundColor = '#F57C00';
          ***REMOVED******REMOVED***
          onMouseLeave=***REMOVED***(e) => ***REMOVED***
            e.target.style.backgroundColor = '#FF9800';
          ***REMOVED******REMOVED***
        >
          <Briefcase className="w-4 h-4" />
          <span>Crear Trabajo Primero</span>
        </button>
      );
    ***REMOVED***

    return (
      <button
        onClick=***REMOVED***abrirModalNuevo***REMOVED***
        className="text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 shadow-sm hover:shadow-md"
        style=***REMOVED******REMOVED*** 
          backgroundColor: coloresTemáticos?.base || '#EC4899'
        ***REMOVED******REMOVED***
        onMouseEnter=***REMOVED***(e) => ***REMOVED***
          if (coloresTemáticos?.dark) ***REMOVED***
            e.target.style.backgroundColor = coloresTemáticos.dark;
          ***REMOVED***
        ***REMOVED******REMOVED***
        onMouseLeave=***REMOVED***(e) => ***REMOVED***
          e.target.style.backgroundColor = coloresTemáticos?.base || '#EC4899';
        ***REMOVED******REMOVED***
      >
        <Plus className="w-4 h-4" />
        <span>Nuevo</span>
      </button>
    );
  ***REMOVED***;

  return (
    <LoadingWrapper cargando=***REMOVED***cargando***REMOVED***>
      <div className="space-y-6">
        ***REMOVED***/* Header que cambia según si hay turnos */***REMOVED***
        <div className="flex justify-between items-center pt-4">
          <div className="flex items-center space-x-3">
            <div 
              className="p-2 rounded-lg"
              style=***REMOVED******REMOVED*** backgroundColor: coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)' ***REMOVED******REMOVED***
            >
              <Calendar 
                className="w-6 h-6" 
                style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED***
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold mb-4 pt-4">Mis Turnos</h1>
            </div>
          </div>
          ***REMOVED***/* Solo mostrar botón en header si hay turnos */***REMOVED***
          ***REMOVED***getHeaderButton()***REMOVED***
        </div>

        ***REMOVED***/* Lista de turnos o estado vacío */***REMOVED***
        ***REMOVED***!hayTurnos ? (
          renderEmptyState()
        ) : (
          <div className="space-y-6">
            ***REMOVED***diasOrdenados.map(([fecha, turnosDia]) => (
              <DaySection
                key=***REMOVED***fecha***REMOVED***
                fecha=***REMOVED***fecha***REMOVED***
                turnos=***REMOVED***turnosDia***REMOVED***
                trabajos=***REMOVED***todosLosTrabajos***REMOVED***
                onEditTurno=***REMOVED***abrirModalEditar***REMOVED***
                onDeleteTurno=***REMOVED***deleteManager.startDeletion***REMOVED***
              />
            ))***REMOVED***
          </div>
        )***REMOVED***
      </div>
      
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