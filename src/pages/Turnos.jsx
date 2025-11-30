// src/pages/Turnos.jsx

import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { useTurnManager } from '../hooks/useTurnManager';
import { useDeleteManager } from '../hooks/useDeleteManager';
import { useFilterTurnos } from '../hooks/useFilterTurnos';
import { createSafeDate } from '../utils/time';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import PageHeader from '../components/layout/PageHeader'; // Added import
import { List, Plus } from 'lucide-react'; // Added icons
import ShiftsEmptyState from '../components/shifts/ShiftsEmptyState';
import FiltrosTurnos from '../components/filters/FiltrosTurnos';
import ModalTurno from '../components/modals/shift/ModalTurno';
import AlertaEliminacion from '../components/alerts/AlertaEliminacion';
import WeeklyShiftsSection from '../components/shifts/WeeklyShiftsSection';
import { generateShiftDetails } from '../utils/shiftDetailsUtils';
import Flex from '../components/ui/Flex';

import LoadingSpinner from '../components/ui/LoadingSpinner/LoadingSpinner';

const WEEKS_PER_PAGE = 4; // Mostrar 4 semanas por página

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
  
  const [weeksShown, setWeeksShown] = useState(WEEKS_PER_PAGE);
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

  // Función para obtener el lunes de una fecha
  const obtenerLunesDeLaSemana = (fecha) => {
    const date = createSafeDate(fecha);
    const diaSemana = date.getDay();
    const diasHastaLunes = diaSemana === 0 ? -6 : -(diaSemana - 1);
    const lunes = new Date(date);
    lunes.setDate(date.getDate() + diasHastaLunes);
    return lunes.toISOString().split('T')[0];
  };

  // Función para formatear el rango de semana
  const formatearRangoSemana = (fechaLunes) => {
    const lunes = createSafeDate(fechaLunes);
    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);

    const opcionesLunes = { day: 'numeric', month: 'short' };
    const opcionesDomingo = { day: 'numeric', month: 'short', year: 'numeric' };

    const lunesStr = lunes.toLocaleDateString('es-ES', opcionesLunes);
    const domingoStr = domingo.toLocaleDateString('es-ES', opcionesDomingo);

    return `${lunesStr} - ${domingoStr}`;
  };

  // Agrupar turnos por semanas
  const turnosPorSemana = useMemo(() => {
    const semanas = {};
    
    Object.entries(turnosParaMostrar || {}).forEach(([fecha, turnos]) => {
      const fechaLunes = obtenerLunesDeLaSemana(fecha);
      
      if (!semanas[fechaLunes]) {
        semanas[fechaLunes] = {};
      }
      
      semanas[fechaLunes][fecha] = turnos;
    });

    // Ordenar semanas por fecha (más reciente primero)
    const semanasOrdenadas = Object.keys(semanas)
      .sort((a, b) => new Date(b) - new Date(a))
      .map(fechaLunes => ({
        fechaLunes,
        rangoSemana: formatearRangoSemana(fechaLunes),
        turnos: semanas[fechaLunes],
        totalTurnos: Object.values(semanas[fechaLunes]).flat().length
      }));

    return semanasOrdenadas;
  }, [turnosParaMostrar]);

  const semanasParaMostrar = turnosPorSemana.slice(0, weeksShown);
  const hayMasSemanas = turnosPorSemana.length > weeksShown;
  const semanasRestantes = turnosPorSemana.length - weeksShown;
  const hayTurnos = turnosPorSemana.length > 0;

  const handleShowMoreWeeks = () => {
    setExpanding(true);
    setTimeout(() => {
      setWeeksShown(prev => Math.min(prev + WEEKS_PER_PAGE, turnosPorSemana.length));
      setExpanding(false);
    }, 150);
  };

  const handleShowLessWeeks = () => {
    setWeeksShown(WEEKS_PER_PAGE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const testDelete = (turno) => {
    deleteManager.startDeletion(turno);
  };

  return (
    <LoadingWrapper loading={loading}>
      {/* Contenedor principal con espaciado mejorado */}
      <div className="px-4 py-6 space-y-6">
        <PageHeader
          title="Turnos"
          subtitle="Gestiona y visualiza tus turnos registrados."
          icon={List}
          action={{ onClick: abrirModalNuevo, icon: Plus, label: 'Nuevo Turno' }}
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
            <Flex variant="between">
              <span style={{ color: thematicColors?.base }} className="font-medium">
                Mostrando {estadisticasFiltros.turnosFiltrados} de {estadisticasFiltros.totalTurnos} turnos
              </span>
              <span className="text-gray-600">
                {turnosPorSemana.length} semanas con turnos
              </span>
            </Flex>
          </div>
        )}

        {/* Contenido principal */}
        {!hayTurnos && !tieneMetrosDeFiltrosActivos ? (
          <ShiftsEmptyState 
            allJobs={allJobs}
            onNewShift={abrirModalNuevo}
            thematicColors={thematicColors}
          />
        ) : !hayTurnos && tieneMetrosDeFiltrosActivos ? (
          // Estado cuando hay filtros pero no resultados
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Flex 
              variant="center" 
              className="p-4 rounded-full w-20 h-20 mx-auto mb-4"
              style={{ backgroundColor: thematicColors?.transparent10 }}
            >
              <span className="text-2xl">🔍</span>
            </Flex>
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
            {/* Lista de turnos organizados por semanas */}
            <div className="space-y-8">
              {semanasParaMostrar.map(({ fechaLunes, rangoSemana, turnos, totalTurnos }) => (
                <WeeklyShiftsSection
                  key={fechaLunes}
                  rangoSemana={rangoSemana}
                  turnos={turnos}
                  totalTurnos={totalTurnos}
                  allJobs={allJobs}
                  onEditShift={abrirModalEditar}
                  onDeleteShift={testDelete}
                  thematicColors={thematicColors}
                />
              ))}
            </div>

            {/* Navegación (mostrar más/menos semanas) */}
            {hayMasSemanas && (
              <div className="relative flex flex-col items-center pt-8 pb-12">
                <div
                  className="absolute top-0 left-0 right-0 h-16 rounded-lg opacity-30"
                  style={{ backgroundColor: thematicColors?.transparent5 }}
                />
                <button
                  onClick={handleShowMoreWeeks}
                  disabled={expanding}
                  className="relative z-10 flex items-center space-x-2 px-6 py-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                  style={{ 
                    borderColor: thematicColors?.transparent20,
                    color: thematicColors?.base
                  }}
                >
                  {expanding ? (
                    <>
                      <LoadingSpinner 
                        size="h-4 w-4"
                        style={{ borderColor: thematicColors?.base }}
                        color="border-transparent"
                      />
                      <span>Cargando...</span>
                    </>
                  ) : (
                    <>
                      <span>👁️</span>
                      <span>Ver {Math.min(WEEKS_PER_PAGE, semanasRestantes)} semanas más</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {!hayMasSemanas && weeksShown > WEEKS_PER_PAGE && (
              <div className="flex justify-center py-4">
                <button
                  onClick={handleShowLessWeeks}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <span>↑</span>
                  <span>Mostrar menos</span>
                </button>
              </div>
            )}
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