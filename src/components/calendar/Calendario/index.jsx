// src/components/calendar/Calendario/index.jsx

import React from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useCalendarState ***REMOVED*** from '../../../hooks/useCalendarState';
import ***REMOVED*** obtenerTurnosMes ***REMOVED*** from '../../../utils/calendarUtils';
import Card from '../../ui/Card';
import CalendarHeader from '../CalendarHeader';
import CalendarSummary from '../CalendarSummary';
import CalendarGrid from '../CalendarGrid';

const Calendario = (***REMOVED*** onDiaSeleccionado ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** turnos, trabajos, coloresTemáticos ***REMOVED*** = useApp();
  
  const ***REMOVED***
    fechaActual,
    mesActual,
    anioActual,
    diaSeleccionadoActual,
    obtenerDiasDelMes,
    cambiarMes,
    irAHoy,
    irADia
  ***REMOVED*** = useCalendarState(turnos, onDiaSeleccionado);

  const turnosMes = obtenerTurnosMes(turnos, anioActual, mesActual);
  const dias = obtenerDiasDelMes();

  return (
    <Card className="overflow-hidden">
      <CalendarHeader
        mesActual=***REMOVED***mesActual***REMOVED***
        anioActual=***REMOVED***anioActual***REMOVED***
        onCambiarMes=***REMOVED***cambiarMes***REMOVED***
        onIrAHoy=***REMOVED***irAHoy***REMOVED***
        coloresTemáticos=***REMOVED***coloresTemáticos***REMOVED***
      />

      <CalendarSummary
        totalTurnos=***REMOVED***turnosMes.length***REMOVED***
        coloresTemáticos=***REMOVED***coloresTemáticos***REMOVED***
      />

      <CalendarGrid
        dias=***REMOVED***dias***REMOVED***
        fechaActual=***REMOVED***fechaActual***REMOVED***
        diaSeleccionadoActual=***REMOVED***diaSeleccionadoActual***REMOVED***
        trabajos=***REMOVED***trabajos***REMOVED***
        coloresTemáticos=***REMOVED***coloresTemáticos***REMOVED***
        onDiaClick=***REMOVED***irADia***REMOVED***
      />
    </Card>
  );
***REMOVED***;

export default Calendario;