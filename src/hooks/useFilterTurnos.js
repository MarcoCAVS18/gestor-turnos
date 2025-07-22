// src/hooks/useFilterTurnos.js

import { useMemo, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { determinarTipoTurno } from '../utils/shiftDetailsUtils';

export const useFilterTurnos = (turnosPorFecha) => {
  const { trabajos, trabajosDelivery, shiftRanges } = useApp();
  
  // Estado de los filtros
  const [filters, setFilters] = useState({
    trabajo: 'todos',
    diasSemana: [],
    tipoTurno: 'todos'
  });

  // Combinar todos los trabajos
  const todosLosTrabajos = useMemo(() => [
    ...trabajos,
    ...trabajosDelivery
  ], [trabajos, trabajosDelivery]);

  // Función para obtener el día de la semana de una fecha
  const obtenerDiaSemana = (fechaStr) => {
    const fecha = new Date(fechaStr + 'T00:00:00');
    const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    return dias[fecha.getDay()];
  };

  // Función para filtrar turnos
  const filtrarTurnos = useMemo(() => {
    if (!turnosPorFecha) return {};

    const turnosFiltrados = {};

    Object.entries(turnosPorFecha).forEach(([fecha, turnos]) => {
      // Filtrar por día de la semana
      if (filters.diasSemana.length > 0) {
        const diaSemana = obtenerDiaSemana(fecha);
        if (!filters.diasSemana.includes(diaSemana)) {
          return; // Saltar esta fecha
        }
      }

      // Filtrar turnos de esta fecha
      const turnosDiaFiltrados = turnos.filter(turno => {
        // Filtro por trabajo
        if (filters.trabajo !== 'todos') {
          if (turno.trabajoId !== filters.trabajo) {
            return false;
          }
        }

        // Filtro por tipo de turno
        if (filters.tipoTurno !== 'todos') {
          const tipoTurno = determinarTipoTurno(turno, shiftRanges);
          if (tipoTurno !== filters.tipoTurno) {
            return false;
          }
        }

        return true;
      });

      // Solo agregar la fecha si tiene turnos después del filtrado
      if (turnosDiaFiltrados.length > 0) {
        turnosFiltrados[fecha] = turnosDiaFiltrados;
      }
    });

    return turnosFiltrados;
  }, [turnosPorFecha, filters, shiftRanges]);

  // Estadísticas de los filtros
  const estadisticasFiltros = useMemo(() => {
    const totalTurnos = Object.values(turnosPorFecha || {}).flat().length;
    const turnosFiltrados = Object.values(filtrarTurnos).flat().length;
    const diasMostrados = Object.keys(filtrarTurnos).length;
    const diasTotales = Object.keys(turnosPorFecha || {}).length;

    return {
      totalTurnos,
      turnosFiltrados,
      diasMostrados,
      diasTotales,
      porcentajeFiltrado: totalTurnos > 0 ? (turnosFiltrados / totalTurnos) * 100 : 0
    };
  }, [turnosPorFecha, filtrarTurnos]);

  // Verificar si hay filtros activos
  const tieneMetrosDeFiltrosActivos = useMemo(() => {
    return filters.trabajo !== 'todos' || 
           filters.diasSemana.length > 0 || 
           filters.tipoTurno !== 'todos';
  }, [filters]);

  // Función para actualizar filtros
  const actualizarFiltros = (nuevosFiltros) => {
    setFilters(nuevosFiltros);
  };

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setFilters({
      trabajo: 'todos',
      diasSemana: [],
      tipoTurno: 'todos'
    });
  };

  return {
    filters,
    actualizarFiltros,
    limpiarFiltros,
    turnosFiltrados: filtrarTurnos,
    estadisticasFiltros,
    tieneMetrosDeFiltrosActivos,
    todosLosTrabajos
  };
};