// src/hooks/useFilterTurnos.js

import ***REMOVED*** useMemo, useState ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** determinarTipoTurno ***REMOVED*** from '../utils/shiftDetailsUtils';
import ***REMOVED*** createSafeDate ***REMOVED*** from '../utils/time';

export const useFilterTurnos = (turnosPorFecha) => ***REMOVED***
  const ***REMOVED*** trabajos, trabajosDelivery, shiftRanges ***REMOVED*** = useApp();
  
  // Estado de los filtros
  const [filters, setFilters] = useState(***REMOVED***
    trabajo: 'todos',
    diasSemana: [],
    tipoTurno: 'todos'
  ***REMOVED***);

  // Combinar todos los trabajos
  const todosLosTrabajos = useMemo(() => [
    ...trabajos,
    ...trabajosDelivery
  ], [trabajos, trabajosDelivery]);

  // Función para obtener el día de la semana de una fecha
  const obtenerDiaSemana = (fechaStr) => ***REMOVED***
    const fecha = createSafeDate(fechaStr);
    const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    return dias[fecha.getDay()];
  ***REMOVED***;

  // Función para filtrar turnos
  const filtrarTurnos = useMemo(() => ***REMOVED***
    if (!turnosPorFecha) return ***REMOVED******REMOVED***;

    const turnosFiltrados = ***REMOVED******REMOVED***;

    Object.entries(turnosPorFecha).forEach(([fecha, turnos]) => ***REMOVED***
      // Filtrar por día de la semana
      if (filters.diasSemana.length > 0) ***REMOVED***
        const diaSemana = obtenerDiaSemana(fecha);
        if (!filters.diasSemana.includes(diaSemana)) ***REMOVED***
          return; // Saltar esta fecha
        ***REMOVED***
      ***REMOVED***

      // Filtrar turnos de esta fecha
      const turnosDiaFiltrados = turnos.filter(turno => ***REMOVED***
        // Filtro por trabajo
        if (filters.trabajo !== 'todos') ***REMOVED***
          if (turno.trabajoId !== filters.trabajo) ***REMOVED***
            return false;
          ***REMOVED***
        ***REMOVED***

        // Filtro por tipo de turno
        if (filters.tipoTurno !== 'todos') ***REMOVED***
          const tipoTurno = determinarTipoTurno(turno, shiftRanges);
          if (tipoTurno !== filters.tipoTurno) ***REMOVED***
            return false;
          ***REMOVED***
        ***REMOVED***

        return true;
      ***REMOVED***);

      // Solo agregar la fecha si tiene turnos después del filtrado
      if (turnosDiaFiltrados.length > 0) ***REMOVED***
        turnosFiltrados[fecha] = turnosDiaFiltrados;
      ***REMOVED***
    ***REMOVED***);

    return turnosFiltrados;
  ***REMOVED***, [turnosPorFecha, filters, shiftRanges]);

  // Estadísticas de los filtros
  const estadisticasFiltros = useMemo(() => ***REMOVED***
    const totalTurnos = Object.values(turnosPorFecha || ***REMOVED******REMOVED***).flat().length;
    const turnosFiltrados = Object.values(filtrarTurnos).flat().length;
    const diasMostrados = Object.keys(filtrarTurnos).length;
    const diasTotales = Object.keys(turnosPorFecha || ***REMOVED******REMOVED***).length;

    return ***REMOVED***
      totalTurnos,
      turnosFiltrados,
      diasMostrados,
      diasTotales,
      porcentajeFiltrado: totalTurnos > 0 ? (turnosFiltrados / totalTurnos) * 100 : 0
    ***REMOVED***;
  ***REMOVED***, [turnosPorFecha, filtrarTurnos]);

  // Verificar si hay filtros activos
  const tieneMetrosDeFiltrosActivos = useMemo(() => ***REMOVED***
    return filters.trabajo !== 'todos' || 
           filters.diasSemana.length > 0 || 
           filters.tipoTurno !== 'todos';
  ***REMOVED***, [filters]);

  // Función para actualizar filtros
  const actualizarFiltros = (nuevosFiltros) => ***REMOVED***
    setFilters(nuevosFiltros);
  ***REMOVED***;

  // Función para limpiar filtros
  const limpiarFiltros = () => ***REMOVED***
    setFilters(***REMOVED***
      trabajo: 'todos',
      diasSemana: [],
      tipoTurno: 'todos'
    ***REMOVED***);
  ***REMOVED***;

  return ***REMOVED***
    filters,
    actualizarFiltros,
    limpiarFiltros,
    turnosFiltrados: filtrarTurnos,
    estadisticasFiltros,
    tieneMetrosDeFiltrosActivos,
    todosLosTrabajos
  ***REMOVED***;
***REMOVED***;