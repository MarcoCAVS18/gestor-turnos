// src/pages/Turnos.jsx

import React, ***REMOVED*** useState, useMemo ***REMOVED*** from 'react';
import ***REMOVED*** Calendar, Plus, Briefcase, ArrowRight, Eye ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** useTurnManager ***REMOVED*** from '../hooks/useTurnManager';
import ***REMOVED*** useDeleteManager ***REMOVED*** from '../hooks/useDeleteManager';
import DaySection from '../components/sections/DaySection';
import ModalTurno from '../components/modals/ModalTurno';
import AlertaEliminacion from '../components/alerts/AlertaEliminacion';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import GlassButton from '../components/ui/GlassButton';

const DIAS_POR_PAGINA = 6; // Mostrar 6 días con turnos inicialmente

const Turnos = () => ***REMOVED***
  const ***REMOVED*** 
    turnosPorFecha, 
    loading, 
    deleteShift,
    deleteDeliveryShift,
    trabajos, 
    trabajosDelivery,
    thematicColors
  ***REMOVED*** = useApp();
  
  const deleteManager = useDeleteManager(async (turno) => ***REMOVED***
    if (turno.tipo === 'delivery') ***REMOVED***
      await deleteDeliveryShift(turno.id);
    ***REMOVED*** else ***REMOVED***
      await deleteShift(turno.id);
    ***REMOVED***
  ***REMOVED***);
  
  const ***REMOVED*** modalAbierto, turnoSeleccionado, abrirModalNuevo, abrirModalEditar, cerrarModal ***REMOVED*** = useTurnManager();
  
  // Estado para controlar cuántos días mostrar
  const [diasMostrados, setDiasMostrados] = useState(DIAS_POR_PAGINA);
  const [expandiendo, setExpandiendo] = useState(false);

  // Combinar todos los trabajos
  const todosLosTrabajos = [...trabajos, ...trabajosDelivery];
  
  // Ordenar fechas y crear array de días con turnos
  const diasOrdenados = useMemo(() => ***REMOVED***
    return Object.entries(turnosPorFecha)
      .sort(([fechaA], [fechaB]) => new Date(fechaB) - new Date(fechaA));
  ***REMOVED***, [turnosPorFecha]);

  // Días a mostrar según el estado actual
  const diasParaMostrar = diasOrdenados.slice(0, diasMostrados);
  const hayMasDias = diasOrdenados.length > diasMostrados;
  const diasRestantes = diasOrdenados.length - diasMostrados;

  const hayTurnos = diasOrdenados.length > 0;

  // Función para mostrar más días
  const mostrarMasDias = async () => ***REMOVED***
    setExpandiendo(true);
    
    // Simular un pequeño delay para mejor UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setDiasMostrados(prev => Math.min(prev + DIAS_POR_PAGINA, diasOrdenados.length));
    setExpandiendo(false);
  ***REMOVED***;

  // Función para colapsar de vuelta a los primeros días
  const mostrarMenos = () => ***REMOVED***
    setDiasMostrados(DIAS_POR_PAGINA);
    // Scroll suave hacia arriba
    window.scrollTo(***REMOVED*** top: 0, behavior: 'smooth' ***REMOVED***);
  ***REMOVED***;

  const generarDetallesTurno = (turno) => ***REMOVED***
    if (!turno) return [];
    
    const trabajo = todosLosTrabajos.find(t => t.id === turno.trabajoId);
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
            style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.transparent10 || 'rgba(255, 152, 0, 0.1)' ***REMOVED******REMOVED***
          >
            <Briefcase 
              className="w-10 h-10" 
              style=***REMOVED******REMOVED*** color: thematicColors?.base || '#FF9800' ***REMOVED******REMOVED***
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
          style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.transparent10 || 'rgba(236, 72, 153, 0.1)' ***REMOVED******REMOVED***
        >
          <Calendar 
            className="w-10 h-10" 
            style=***REMOVED******REMOVED*** color: thematicColors?.base || '#EC4899' ***REMOVED******REMOVED***
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
            backgroundColor: thematicColors?.base || '#EC4899'
          ***REMOVED******REMOVED***
          onMouseEnter=***REMOVED***(e) => ***REMOVED***
            if (thematicColors?.dark) ***REMOVED***
              e.target.style.backgroundColor = thematicColors.dark;
            ***REMOVED***
          ***REMOVED******REMOVED***
          onMouseLeave=***REMOVED***(e) => ***REMOVED***
            e.target.style.backgroundColor = thematicColors?.base || '#EC4899';
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
          backgroundColor: thematicColors?.base || '#EC4899'
        ***REMOVED******REMOVED***
        onMouseEnter=***REMOVED***(e) => ***REMOVED***
          if (thematicColors?.dark) ***REMOVED***
            e.target.style.backgroundColor = thematicColors.dark;
          ***REMOVED***
        ***REMOVED******REMOVED***
        onMouseLeave=***REMOVED***(e) => ***REMOVED***
          e.target.style.backgroundColor = thematicColors?.base || '#EC4899';
        ***REMOVED******REMOVED***
      >
        <Plus className="w-4 h-4" />
        <span>Nuevo</span>
      </button>
    );
  ***REMOVED***;

  return (
    <LoadingWrapper loading=***REMOVED***loading***REMOVED***>
      <div className="space-y-6">
        ***REMOVED***/* Header que cambia según si hay turnos */***REMOVED***
        <div className="flex justify-between items-center pt-4">
          <div className="flex items-center space-x-3">
            <div 
              className="p-2 rounded-lg"
              style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.transparent10 || 'rgba(236, 72, 153, 0.1)' ***REMOVED******REMOVED***
            >
              <Calendar 
                className="w-6 h-6" 
                style=***REMOVED******REMOVED*** color: thematicColors?.base || '#EC4899' ***REMOVED******REMOVED***
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold mb-4 pt-4">Mis Turnos</h1>
              ***REMOVED***/* Contador de turnos cuando hay más de 6 días */***REMOVED***
              ***REMOVED***hayTurnos && diasOrdenados.length > DIAS_POR_PAGINA && (
                <p className="text-sm text-gray-500 -mt-2">
                  Mostrando ***REMOVED***Math.min(diasMostrados, diasOrdenados.length)***REMOVED*** de ***REMOVED***diasOrdenados.length***REMOVED*** días con turnos
                </p>
              )***REMOVED***
            </div>
          </div>
          ***REMOVED***getHeaderButton()***REMOVED***
        </div>

        ***REMOVED***/* Lista de turnos o estado vacío */***REMOVED***
        ***REMOVED***!hayTurnos ? (
          renderEmptyState()
        ) : (
          <div className="space-y-6">
            ***REMOVED***/* Días con turnos */***REMOVED***
            ***REMOVED***diasParaMostrar.map(([fecha, turnosDia]) => (
              <DaySection
                key=***REMOVED***fecha***REMOVED***
                fecha=***REMOVED***fecha***REMOVED***
                turnos=***REMOVED***turnosDia***REMOVED***
                trabajos=***REMOVED***todosLosTrabajos***REMOVED***
                onEditTurno=***REMOVED***abrirModalEditar***REMOVED***
                onDeleteTurno=***REMOVED***deleteManager.startDeletion***REMOVED***
              />
            ))***REMOVED***
            
            ***REMOVED***/* Botón Ver Más con GlassButton */***REMOVED***
            ***REMOVED***hayMasDias && (
              <div className="flex justify-center py-8">
                <GlassButton
                  onClick=***REMOVED***mostrarMasDias***REMOVED***
                  loading=***REMOVED***expandiendo***REMOVED***
                  variant="primary"
                  size="lg"
                  icon=***REMOVED***Eye***REMOVED***
                  className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-xl"
                >
                  Ver ***REMOVED***Math.min(DIAS_POR_PAGINA, diasRestantes)***REMOVED*** días más
                </GlassButton>
              </div>
            )***REMOVED***
            
            ***REMOVED***/* Botón Mostrar Menos (solo cuando se han expandido los resultados) */***REMOVED***
            ***REMOVED***!hayMasDias && diasMostrados > DIAS_POR_PAGINA && (
              <div className="flex justify-center py-4">
                <GlassButton
                  onClick=***REMOVED***mostrarMenos***REMOVED***
                  variant="secondary"
                  size="md"
                  className="bg-gradient-to-r from-gray-500/20 to-blue-500/20 backdrop-blur-xl"
                >
                  Mostrar menos
                </GlassButton>
              </div>
            )***REMOVED***
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