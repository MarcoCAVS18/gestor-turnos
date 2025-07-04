// src/components/calendar/Calendario/index.jsx

import React from 'react';
import { useApp } from '../../../contexts/AppContext';
import { useCalendarState } from '../../../hooks/useCalendarState';
import { obtenerTurnosMes } from '../../../utils/calendarUtils';
import Card from '../../ui/Card';
import CalendarHeader from '../CalendarHeader';
import CalendarSummary from '../CalendarSummary';
import CalendarGrid from '../CalendarGrid';

const Calendario = ({ onDiaSeleccionado }) => {
  const { turnosPorFecha, todosLosTrabajos, thematicColors } = useApp();
  
  // Obtener todos los turnos combinados del contexto
  const todosLosTurnos = React.useMemo(() => {
    if (!turnosPorFecha) return [];
    
    const turnos = [];
    Object.entries(turnosPorFecha).forEach(([fecha, turnosDia]) => {
      if (Array.isArray(turnosDia)) {
        turnos.push(...turnosDia);
      }
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

  return (
    <Card className="overflow-hidden">
      <CalendarHeader
        mesActual={mesActual}
        anioActual={anioActual}
        onCambiarMes={cambiarMes}
        onIrAHoy={irAHoy}
        thematicColors={thematicColors}
      />

      <CalendarSummary
        totalTurnos={turnosMes.length}
        thematicColors={thematicColors}
      />

      <CalendarGrid
        dias={dias}
        fechaActual={fechaActual}
        diaSeleccionadoActual={diaSeleccionadoActual}
        trabajos={todosLosTrabajos || []}
        thematicColors={thematicColors}
        onDiaClick={irADia}
      />
    </Card>
  );
};

export default Calendario;