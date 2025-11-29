// src/pages/Turnos.jsx

import React, ***REMOVED*** useState, useMemo ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** useTurnManager ***REMOVED*** from '../hooks/useTurnManager';
import ***REMOVED*** useDeleteManager ***REMOVED*** from '../hooks/useDeleteManager';
import ***REMOVED*** useFilterTurnos ***REMOVED*** from '../hooks/useFilterTurnos';
import ***REMOVED*** createSafeDate ***REMOVED*** from '../utils/time';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import ShiftsHeader from '../components/shifts/ShiftsHeader';
import ShiftsEmptyState from '../components/shifts/ShiftsEmptyState';
import FiltrosTurnos from '../components/filters/FiltrosTurnos';
import ModalTurno from '../components/modals/shift/ModalTurno';
import AlertaEliminacion from '../components/alerts/AlertaEliminacion';
import WeeklyShiftsSection from '../components/shifts/WeeklyShiftsSection';
import ***REMOVED*** generateShiftDetails ***REMOVED*** from '../utils/shiftDetailsUtils';
import Flex from '../components/ui/Flex';

import LoadingSpinner from '../components/ui/LoadingSpinner/LoadingSpinner';

const WEEKS_PER_PAGE = 4; // Mostrar 4 semanas por página

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
  
  const [weeksShown, setWeeksShown] = useState(WEEKS_PER_PAGE);
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

  // Función para obtener el lunes de una fecha
  const obtenerLunesDeLaSemana = (fecha) => ***REMOVED***
    const date = createSafeDate(fecha);
    const diaSemana = date.getDay();
    const diasHastaLunes = diaSemana === 0 ? -6 : -(diaSemana - 1);
    const lunes = new Date(date);
    lunes.setDate(date.getDate() + diasHastaLunes);
    return lunes.toISOString().split('T')[0];
  ***REMOVED***;

  // Función para formatear el rango de semana
  const formatearRangoSemana = (fechaLunes) => ***REMOVED***
    const lunes = createSafeDate(fechaLunes);
    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);

    const opcionesLunes = ***REMOVED*** day: 'numeric', month: 'short' ***REMOVED***;
    const opcionesDomingo = ***REMOVED*** day: 'numeric', month: 'short', year: 'numeric' ***REMOVED***;

    const lunesStr = lunes.toLocaleDateString('es-ES', opcionesLunes);
    const domingoStr = domingo.toLocaleDateString('es-ES', opcionesDomingo);

    return `$***REMOVED***lunesStr***REMOVED*** - $***REMOVED***domingoStr***REMOVED***`;
  ***REMOVED***;

  // Agrupar turnos por semanas
  const turnosPorSemana = useMemo(() => ***REMOVED***
    const semanas = ***REMOVED******REMOVED***;
    
    Object.entries(turnosParaMostrar || ***REMOVED******REMOVED***).forEach(([fecha, turnos]) => ***REMOVED***
      const fechaLunes = obtenerLunesDeLaSemana(fecha);
      
      if (!semanas[fechaLunes]) ***REMOVED***
        semanas[fechaLunes] = ***REMOVED******REMOVED***;
      ***REMOVED***
      
      semanas[fechaLunes][fecha] = turnos;
    ***REMOVED***);

    // Ordenar semanas por fecha (más reciente primero)
    const semanasOrdenadas = Object.keys(semanas)
      .sort((a, b) => new Date(b) - new Date(a))
      .map(fechaLunes => (***REMOVED***
        fechaLunes,
        rangoSemana: formatearRangoSemana(fechaLunes),
        turnos: semanas[fechaLunes],
        totalTurnos: Object.values(semanas[fechaLunes]).flat().length
      ***REMOVED***));

    return semanasOrdenadas;
  ***REMOVED***, [turnosParaMostrar]);

  const semanasParaMostrar = turnosPorSemana.slice(0, weeksShown);
  const hayMasSemanas = turnosPorSemana.length > weeksShown;
  const semanasRestantes = turnosPorSemana.length - weeksShown;
  const hayTurnos = turnosPorSemana.length > 0;

  const handleShowMoreWeeks = () => ***REMOVED***
    setExpanding(true);
    setTimeout(() => ***REMOVED***
      setWeeksShown(prev => Math.min(prev + WEEKS_PER_PAGE, turnosPorSemana.length));
      setExpanding(false);
    ***REMOVED***, 150);
  ***REMOVED***;

  const handleShowLessWeeks = () => ***REMOVED***
    setWeeksShown(WEEKS_PER_PAGE);
    window.scrollTo(***REMOVED*** top: 0, behavior: 'smooth' ***REMOVED***);
  ***REMOVED***;

  const testDelete = (turno) => ***REMOVED***
    deleteManager.startDeletion(turno);
  ***REMOVED***;

  return (
    <LoadingWrapper loading=***REMOVED***loading***REMOVED***>
      ***REMOVED***/* Contenedor principal con espaciado mejorado */***REMOVED***
      <div className="px-4 py-6 pb-32 space-y-6">
        ***REMOVED***/* Header con título y botón de acción */***REMOVED***
        <ShiftsHeader 
          hasShifts=***REMOVED***hayTurnos***REMOVED***
          allJobs=***REMOVED***allJobs***REMOVED***
          onNewShift=***REMOVED***abrirModalNuevo***REMOVED***
          thematicColors=***REMOVED***thematicColors***REMOVED***
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
            <Flex variant="between">
              <span style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED*** className="font-medium">
                Mostrando ***REMOVED***estadisticasFiltros.turnosFiltrados***REMOVED*** de ***REMOVED***estadisticasFiltros.totalTurnos***REMOVED*** turnos
              </span>
              <span className="text-gray-600">
                ***REMOVED***turnosPorSemana.length***REMOVED*** semanas con turnos
              </span>
            </Flex>
          </div>
        )***REMOVED***

        ***REMOVED***/* Contenido principal */***REMOVED***
        ***REMOVED***!hayTurnos && !tieneMetrosDeFiltrosActivos ? (
          <ShiftsEmptyState 
            allJobs=***REMOVED***allJobs***REMOVED***
            onNewShift=***REMOVED***abrirModalNuevo***REMOVED***
            thematicColors=***REMOVED***thematicColors***REMOVED***
          />
        ) : !hayTurnos && tieneMetrosDeFiltrosActivos ? (
          // Estado cuando hay filtros pero no resultados
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Flex 
              variant="center" 
              className="p-4 rounded-full w-20 h-20 mx-auto mb-4"
              style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.transparent10 ***REMOVED******REMOVED***
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
              onClick=***REMOVED***() => actualizarFiltros(***REMOVED*** trabajo: 'todos', diasSemana: [], tipoTurno: 'todos' ***REMOVED***)***REMOVED***
              className="text-white px-6 py-3 rounded-lg transition-colors hover:opacity-90"
              style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.base ***REMOVED******REMOVED***
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <>
            ***REMOVED***/* Lista de turnos organizados por semanas */***REMOVED***
            <div className="space-y-8">
              ***REMOVED***semanasParaMostrar.map((***REMOVED*** fechaLunes, rangoSemana, turnos, totalTurnos ***REMOVED***) => (
                <WeeklyShiftsSection
                  key=***REMOVED***fechaLunes***REMOVED***
                  rangoSemana=***REMOVED***rangoSemana***REMOVED***
                  turnos=***REMOVED***turnos***REMOVED***
                  totalTurnos=***REMOVED***totalTurnos***REMOVED***
                  allJobs=***REMOVED***allJobs***REMOVED***
                  onEditShift=***REMOVED***abrirModalEditar***REMOVED***
                  onDeleteShift=***REMOVED***testDelete***REMOVED***
                  thematicColors=***REMOVED***thematicColors***REMOVED***
                />
              ))***REMOVED***
            </div>

            ***REMOVED***/* Navegación (mostrar más/menos semanas) */***REMOVED***
            ***REMOVED***hayMasSemanas && (
              <div className="relative flex flex-col items-center pt-8 pb-12">
                <div
                  className="absolute top-0 left-0 right-0 h-16 rounded-lg opacity-30"
                  style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.transparent5 ***REMOVED******REMOVED***
                />
                <button
                  onClick=***REMOVED***handleShowMoreWeeks***REMOVED***
                  disabled=***REMOVED***expanding***REMOVED***
                  className="relative z-10 flex items-center space-x-2 px-6 py-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                  style=***REMOVED******REMOVED*** 
                    borderColor: thematicColors?.transparent20,
                    color: thematicColors?.base
                  ***REMOVED******REMOVED***
                >
                  ***REMOVED***expanding ? (
                    <>
                      <LoadingSpinner 
                        size="h-4 w-4"
                        style=***REMOVED******REMOVED*** borderColor: thematicColors?.base ***REMOVED******REMOVED***
                        color="border-transparent"
                      />
                      <span>Cargando...</span>
                    </>
                  ) : (
                    <>
                      <span>👁️</span>
                      <span>Ver ***REMOVED***Math.min(WEEKS_PER_PAGE, semanasRestantes)***REMOVED*** semanas más</span>
                    </>
                  )***REMOVED***
                </button>
              </div>
            )***REMOVED***

            ***REMOVED***!hayMasSemanas && weeksShown > WEEKS_PER_PAGE && (
              <div className="flex justify-center py-4">
                <button
                  onClick=***REMOVED***handleShowLessWeeks***REMOVED***
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <span>↑</span>
                  <span>Mostrar menos</span>
                </button>
              </div>
            )***REMOVED***
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