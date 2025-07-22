// src/pages/Turnos.jsx - Con sistema de filtros

import React, ***REMOVED*** useState, useMemo ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** useTurnManager ***REMOVED*** from '../hooks/useTurnManager';
import ***REMOVED*** useDeleteManager ***REMOVED*** from '../hooks/useDeleteManager';
import ***REMOVED*** useFilterTurnos ***REMOVED*** from '../hooks/useFilterTurnos';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import ShiftsHeader from '../components/shifts/ShiftsHeader';
import ShiftsEmptyState from '../components/shifts/ShiftsEmptyState';
import ShiftsList from '../components/shifts/ShiftsList';
import ShiftsNavigation from '../components/shifts/ShiftsNavigation';
import FiltrosTurnos from '../components/filters/FiltrosTurnos';
import ModalTurno from '../components/modals/ModalTurno';
import AlertaEliminacion from '../components/alerts/AlertaEliminacion';
import ***REMOVED*** generateShiftDetails ***REMOVED*** from '../utils/shiftDetailsUtils';

const DAYS_PER_PAGE = 6;

const Turnos = () => ***REMOVED***
  const ***REMOVED*** 
    loading, 
    deleteShift, 
    deleteDeliveryShift, 
    thematicColors, 
    turnosPorFecha,
    trabajos,
    trabajosDelivery 
  ***REMOVED*** = useApp();
  
  const [daysShown, setDaysShown] = useState(DAYS_PER_PAGE);
  const [expanding, setExpanding] = useState(false);

  // Hook para gestión de filtros
  const ***REMOVED***
    filters,
    actualizarFiltros,
    turnosFiltrados,
    estadisticasFiltros,
    tieneMetrosDeFiltrosActivos
  ***REMOVED*** = useFilterTurnos(turnosPorFecha);

  // Hooks especializados
  const ***REMOVED*** modalAbierto, turnoSeleccionado, abrirModalNuevo, abrirModalEditar, cerrarModal ***REMOVED*** = useTurnManager();
  
  // Función de eliminación
  const handleDeleteTurno = async (turno) => ***REMOVED***
    try ***REMOVED***
      if (turno.tipo === 'delivery') ***REMOVED***
        await deleteDeliveryShift(turno.id);
      ***REMOVED*** else ***REMOVED***
        await deleteShift(turno.id);
      ***REMOVED***
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error eliminando turno:', error);
    ***REMOVED***
  ***REMOVED***;

  const deleteManager = useDeleteManager(handleDeleteTurno);

  // Procesar datos de turnos (usar filtrados si hay filtros activos)
  const turnosParaMostrar = tieneMetrosDeFiltrosActivos ? turnosFiltrados : turnosPorFecha;
  const allJobs = useMemo(() => [...trabajos, ...trabajosDelivery], [trabajos, trabajosDelivery]);

  const sortedDays = useMemo(() => ***REMOVED***
    return Object.entries(turnosParaMostrar || ***REMOVED******REMOVED***).sort(([a], [b]) => new Date(b) - new Date(a));
  ***REMOVED***, [turnosParaMostrar]);

  const daysToShow = sortedDays.slice(0, daysShown);
  const hasMoreDays = sortedDays.length > daysShown;
  const remainingDays = sortedDays.length - daysShown;
  const hasShifts = sortedDays.length > 0;

  const handleShowMore = () => ***REMOVED***
    setExpanding(true);
    setTimeout(() => ***REMOVED***
      setDaysShown(prev => Math.min(prev + DAYS_PER_PAGE, sortedDays.length));
      setExpanding(false);
    ***REMOVED***, 150);
  ***REMOVED***;

  const handleShowLess = () => ***REMOVED***
    setDaysShown(DAYS_PER_PAGE);
    window.scrollTo(***REMOVED*** top: 0, behavior: 'smooth' ***REMOVED***);
  ***REMOVED***;

  const testDelete = (turno) => ***REMOVED***
    deleteManager.startDeletion(turno);
  ***REMOVED***;

  return (
    <LoadingWrapper loading=***REMOVED***loading***REMOVED***>
      <div className="space-y-6">
        ***REMOVED***/* Header con título y botón de acción */***REMOVED***
        <ShiftsHeader 
          hasShifts=***REMOVED***hasShifts***REMOVED***
          allJobs=***REMOVED***allJobs***REMOVED***
          sortedDays=***REMOVED***sortedDays***REMOVED***
          daysShown=***REMOVED***daysShown***REMOVED***
          onNewShift=***REMOVED***abrirModalNuevo***REMOVED***
          thematicColors=***REMOVED***thematicColors***REMOVED***
          daysPerPage=***REMOVED***DAYS_PER_PAGE***REMOVED***
        />

        ***REMOVED***/* Sistema de filtros */***REMOVED***
        ***REMOVED***(Object.keys(turnosPorFecha || ***REMOVED******REMOVED***).length > 0) && (
          <FiltrosTurnos
            onFiltersChange=***REMOVED***actualizarFiltros***REMOVED***
            activeFilters=***REMOVED***filters***REMOVED***
          />
        )***REMOVED***

        ***REMOVED***/* Estadísticas de filtrado */***REMOVED***
        ***REMOVED***tieneMetrosDeFiltrosActivos && (
          <div 
            className="p-3 rounded-lg border-l-4 text-sm"
            style=***REMOVED******REMOVED*** 
              backgroundColor: thematicColors?.transparent5,
              borderLeftColor: thematicColors?.base 
            ***REMOVED******REMOVED***
          >
            <div className="flex items-center justify-between">
              <span style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED*** className="font-medium">
                Mostrando ***REMOVED***estadisticasFiltros.turnosFiltrados***REMOVED*** de ***REMOVED***estadisticasFiltros.totalTurnos***REMOVED*** turnos
              </span>
              <span className="text-gray-600">
                ***REMOVED***estadisticasFiltros.diasMostrados***REMOVED*** días con turnos
              </span>
            </div>
          </div>
        )***REMOVED***

        ***REMOVED***/* Contenido principal */***REMOVED***
        ***REMOVED***!hasShifts && !tieneMetrosDeFiltrosActivos ? (
          <ShiftsEmptyState 
            allJobs=***REMOVED***allJobs***REMOVED***
            onNewShift=***REMOVED***abrirModalNuevo***REMOVED***
            thematicColors=***REMOVED***thematicColors***REMOVED***
          />
        ) : !hasShifts && tieneMetrosDeFiltrosActivos ? (
          // Estado cuando hay filtros pero no resultados
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div 
              className="p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center"
              style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.transparent10 ***REMOVED******REMOVED***
            >
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay turnos que coincidan con los filtros
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Intenta ajustar los filtros para ver más resultados.
            </p>
            <button
              onClick=***REMOVED***() => actualizarFiltros(***REMOVED*** trabajo: 'todos', diasSemana: [], tipoTurno: 'todos' ***REMOVED***)***REMOVED***
              className="text-white px-6 py-3 rounded-lg transition-colors hover:opacity-90"
              style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.base ***REMOVED******REMOVED***
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <>
            ***REMOVED***/* Lista de turnos */***REMOVED***
            <ShiftsList 
              daysToShow=***REMOVED***daysToShow***REMOVED***
              allJobs=***REMOVED***allJobs***REMOVED***
              onEditShift=***REMOVED***abrirModalEditar***REMOVED***
              onDeleteShift=***REMOVED***testDelete***REMOVED***
            />

            ***REMOVED***/* Navegación (mostrar más/menos) */***REMOVED***
            <ShiftsNavigation 
              hasMoreDays=***REMOVED***hasMoreDays***REMOVED***
              daysShown=***REMOVED***daysShown***REMOVED***
              daysPerPage=***REMOVED***DAYS_PER_PAGE***REMOVED***
              remainingDays=***REMOVED***remainingDays***REMOVED***
              expanding=***REMOVED***expanding***REMOVED***
              onShowMore=***REMOVED***handleShowMore***REMOVED***
              onShowLess=***REMOVED***handleShowLess***REMOVED***
              thematicColors=***REMOVED***thematicColors***REMOVED***
            />
          </>
        )***REMOVED***
      </div>

      ***REMOVED***/* Modales */***REMOVED***
      <ModalTurno 
        isOpen=***REMOVED***modalAbierto***REMOVED*** 
        onClose=***REMOVED***cerrarModal***REMOVED*** 
        turno=***REMOVED***turnoSeleccionado***REMOVED*** 
      />

      <AlertaEliminacion
        visible=***REMOVED***deleteManager.showDeleteModal***REMOVED***
        onCancel=***REMOVED***() => ***REMOVED***
          deleteManager.cancelDeletion();
        ***REMOVED******REMOVED***
        onConfirm=***REMOVED***() => ***REMOVED***
          deleteManager.confirmDeletion();
        ***REMOVED******REMOVED***
        eliminando=***REMOVED***deleteManager.deleting***REMOVED***
        tipo="turno"
        detalles=***REMOVED***generateShiftDetails(deleteManager.itemToDelete, allJobs)***REMOVED***
      />
    </LoadingWrapper>
  );
***REMOVED***;

export default Turnos;