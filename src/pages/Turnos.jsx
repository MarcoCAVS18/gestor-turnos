// src/pages/Turnos.jsx - Con sistema de filtros

import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { useTurnManager } from '../hooks/useTurnManager';
import { useDeleteManager } from '../hooks/useDeleteManager';
import { useFilterTurnos } from '../hooks/useFilterTurnos';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import ShiftsHeader from '../components/shifts/ShiftsHeader';
import ShiftsEmptyState from '../components/shifts/ShiftsEmptyState';
import ShiftsList from '../components/shifts/ShiftsList';
import ShiftsNavigation from '../components/shifts/ShiftsNavigation';
import FiltrosTurnos from '../components/filters/FiltrosTurnos';
import ModalTurno from '../components/modals/ModalTurno';
import AlertaEliminacion from '../components/alerts/AlertaEliminacion';
import { generateShiftDetails } from '../utils/shiftDetailsUtils';

const DAYS_PER_PAGE = 6;

const Turnos = () => {
  const { 
    loading, 
    deleteShift, 
    deleteDeliveryShift, 
    thematicColors, 
    turnosPorFecha,
    trabajos,
    trabajosDelivery 
  } = useApp();
  
  const [daysShown, setDaysShown] = useState(DAYS_PER_PAGE);
  const [expanding, setExpanding] = useState(false);

  // Hook para gestión de filtros
  const {
    filters,
    actualizarFiltros,
    turnosFiltrados,
    estadisticasFiltros,
    tieneMetrosDeFiltrosActivos
  } = useFilterTurnos(turnosPorFecha);

  // Hooks especializados
  const { modalAbierto, turnoSeleccionado, abrirModalNuevo, abrirModalEditar, cerrarModal } = useTurnManager();
  
  // Función de eliminación
  const handleDeleteTurno = async (turno) => {
    try {
      if (turno.tipo === 'delivery') {
        await deleteDeliveryShift(turno.id);
      } else {
        await deleteShift(turno.id);
      }
    } catch (error) {
      console.error('Error eliminando turno:', error);
    }
  };

  const deleteManager = useDeleteManager(handleDeleteTurno);

  // Procesar datos de turnos (usar filtrados si hay filtros activos)
  const turnosParaMostrar = tieneMetrosDeFiltrosActivos ? turnosFiltrados : turnosPorFecha;
  const allJobs = useMemo(() => [...trabajos, ...trabajosDelivery], [trabajos, trabajosDelivery]);

  const sortedDays = useMemo(() => {
    return Object.entries(turnosParaMostrar || {}).sort(([a], [b]) => new Date(b) - new Date(a));
  }, [turnosParaMostrar]);

  const daysToShow = sortedDays.slice(0, daysShown);
  const hasMoreDays = sortedDays.length > daysShown;
  const remainingDays = sortedDays.length - daysShown;
  const hasShifts = sortedDays.length > 0;

  const handleShowMore = () => {
    setExpanding(true);
    setTimeout(() => {
      setDaysShown(prev => Math.min(prev + DAYS_PER_PAGE, sortedDays.length));
      setExpanding(false);
    }, 150);
  };

  const handleShowLess = () => {
    setDaysShown(DAYS_PER_PAGE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const testDelete = (turno) => {
    deleteManager.startDeletion(turno);
  };

  return (
    <LoadingWrapper loading={loading}>
      <div className="space-y-6">
        {/* Header con título y botón de acción */}
        <ShiftsHeader 
          hasShifts={hasShifts}
          allJobs={allJobs}
          sortedDays={sortedDays}
          daysShown={daysShown}
          onNewShift={abrirModalNuevo}
          thematicColors={thematicColors}
          daysPerPage={DAYS_PER_PAGE}
        />

        {/* Sistema de filtros */}
        {(Object.keys(turnosPorFecha || {}).length > 0) && (
          <FiltrosTurnos
            onFiltersChange={actualizarFiltros}
            activeFilters={filters}
          />
        )}

        {/* Estadísticas de filtrado */}
        {tieneMetrosDeFiltrosActivos && (
          <div 
            className="p-3 rounded-lg border-l-4 text-sm"
            style={{ 
              backgroundColor: thematicColors?.transparent5,
              borderLeftColor: thematicColors?.base 
            }}
          >
            <div className="flex items-center justify-between">
              <span style={{ color: thematicColors?.base }} className="font-medium">
                Mostrando {estadisticasFiltros.turnosFiltrados} de {estadisticasFiltros.totalTurnos} turnos
              </span>
              <span className="text-gray-600">
                {estadisticasFiltros.diasMostrados} días con turnos
              </span>
            </div>
          </div>
        )}

        {/* Contenido principal */}
        {!hasShifts && !tieneMetrosDeFiltrosActivos ? (
          <ShiftsEmptyState 
            allJobs={allJobs}
            onNewShift={abrirModalNuevo}
            thematicColors={thematicColors}
          />
        ) : !hasShifts && tieneMetrosDeFiltrosActivos ? (
          // Estado cuando hay filtros pero no resultados
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div 
              className="p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: thematicColors?.transparent10 }}
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
              onClick={() => actualizarFiltros({ trabajo: 'todos', diasSemana: [], tipoTurno: 'todos' })}
              className="text-white px-6 py-3 rounded-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: thematicColors?.base }}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <>
            {/* Lista de turnos */}
            <ShiftsList 
              daysToShow={daysToShow}
              allJobs={allJobs}
              onEditShift={abrirModalEditar}
              onDeleteShift={testDelete}
            />

            {/* Navegación (mostrar más/menos) */}
            <ShiftsNavigation 
              hasMoreDays={hasMoreDays}
              daysShown={daysShown}
              daysPerPage={DAYS_PER_PAGE}
              remainingDays={remainingDays}
              expanding={expanding}
              onShowMore={handleShowMore}
              onShowLess={handleShowLess}
              thematicColors={thematicColors}
            />
          </>
        )}
      </div>

      {/* Modales */}
      <ModalTurno 
        isOpen={modalAbierto} 
        onClose={cerrarModal} 
        turno={turnoSeleccionado} 
      />

      <AlertaEliminacion
        visible={deleteManager.showDeleteModal}
        onCancel={() => {
          deleteManager.cancelDeletion();
        }}
        onConfirm={() => {
          deleteManager.confirmDeletion();
        }}
        eliminando={deleteManager.deleting}
        tipo="turno"
        detalles={generateShiftDetails(deleteManager.itemToDelete, allJobs)}
      />
    </LoadingWrapper>
  );
};

export default Turnos;