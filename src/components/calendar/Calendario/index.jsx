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
  const { turnos, trabajos, coloresTemáticos } = useApp();
  
  const {
    fechaActual,
    mesActual,
    anioActual,
    diaSeleccionadoActual,
    obtenerDiasDelMes,
    cambiarMes,
    irAHoy,
    irADia
  } = useCalendarState(turnos, onDiaSeleccionado);

  const turnosMes = obtenerTurnosMes(turnos, anioActual, mesActual);
  const dias = obtenerDiasDelMes();

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
        trabajos={trabajos}
        coloresTemáticos={coloresTemáticos}
        onDiaClick={irADia}
      />
    </Card>
  );
};

export default Calendario;