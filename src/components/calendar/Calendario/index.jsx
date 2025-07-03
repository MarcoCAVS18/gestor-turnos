// src/components/calendar/Calendario/index.jsx - Versión corregida

import React from 'react';
import { useApp } from '../../../contexts/AppContext';
import { useCalendarState } from '../../../hooks/useCalendarState';
import { obtenerTurnosMes } from '../../../utils/calendarUtils';
import Card from '../../ui/Card';
import CalendarHeader from '../CalendarHeader';
import CalendarSummary from '../CalendarSummary';
import CalendarGrid from '../CalendarGrid';

const Calendario = ({ onDiaSeleccionado }) => {
  const { turnosPorFecha, todosLosTrabajos, coloresTemáticos } = useApp();
  
  console.log('📅 Calendario - Datos del contexto:', {
    turnosPorFecha: Object.keys(turnosPorFecha || {}).length,
    todosLosTrabajos: todosLosTrabajos?.length || 0
  });
  
  // Obtener todos los turnos combinados del contexto
  const todosLosTurnos = React.useMemo(() => {
    if (!turnosPorFecha) return [];
    
    const turnos = [];
    Object.entries(turnosPorFecha).forEach(([fecha, turnosDia]) => {
      if (Array.isArray(turnosDia)) {
        turnos.push(...turnosDia);
      }
    });
    
    console.log('📅 Turnos extraídos para calendario:', {
      total: turnos.length,
      tradicionales: turnos.filter(t => t.tipo !== 'delivery').length,
      delivery: turnos.filter(t => t.tipo === 'delivery').length
    });
    
    return turnos;
  }, [turnosPorFecha]);
  
  const {
    fechaActual,
    mesActual,
    anioActual,
    diaSeleccionadoActual,
    obtenerDiasDelMes,
    cambiarMes,
    irAHoy,
    irADia
  } = useCalendarState(todosLosTurnos, onDiaSeleccionado);

  const turnosMes = obtenerTurnosMes(todosLosTurnos, anioActual, mesActual);
  const dias = obtenerDiasDelMes();

  console.log('📅 Calendario renderizado:', {
    mesActual,
    anioActual,
    turnosMes: turnosMes.length,
    diasConTurnos: dias.filter(d => d.tieneTurnos).length
  });

  return (
    <Card className="overflow-hidden">
      <CalendarHeader
        mesActual={mesActual}
        anioActual={anioActual}
        onCambiarMes={cambiarMes}
        onIrAHoy={irAHoy}
        coloresTemáticos={coloresTemáticos}
      />

      <CalendarSummary
        totalTurnos={turnosMes.length}
        coloresTemáticos={coloresTemáticos}
      />

      <CalendarGrid
        dias={dias}
        fechaActual={fechaActual}
        diaSeleccionadoActual={diaSeleccionadoActual}
        trabajos={todosLosTrabajos || []}
        coloresTemáticos={coloresTemáticos}
        onDiaClick={irADia}
      />
    </Card>
  );
};

export default Calendario;