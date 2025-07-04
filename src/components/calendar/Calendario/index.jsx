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
  const ***REMOVED*** turnosPorFecha, todosLosTrabajos, thematicColors ***REMOVED*** = useApp();
  
  // Obtener todos los turnos combinados del contexto
  const todosLosTurnos = React.useMemo(() => ***REMOVED***
    if (!turnosPorFecha) return [];
    
    const turnos = [];
    Object.entries(turnosPorFecha).forEach(([fecha, turnosDia]) => ***REMOVED***
      if (Array.isArray(turnosDia)) ***REMOVED***
        turnos.push(...turnosDia);
      ***REMOVED***
    ***REMOVED***);
    
    return turnos;
  ***REMOVED***, [turnosPorFecha]);
  
  const ***REMOVED***
    fechaActual,
    mesActual,
    anioActual,
    diaSeleccionadoActual,
    obtenerDiasDelMes,
    cambiarMes,
    irAHoy,
    irADia
  ***REMOVED*** = useCalendarState(todosLosTurnos, onDiaSeleccionado);

  const turnosMes = obtenerTurnosMes(todosLosTurnos, anioActual, mesActual);
  const dias = obtenerDiasDelMes();

  return (
    <Card className="overflow-hidden">
      <CalendarHeader
        mesActual=***REMOVED***mesActual***REMOVED***
        anioActual=***REMOVED***anioActual***REMOVED***
        onCambiarMes=***REMOVED***cambiarMes***REMOVED***
        onIrAHoy=***REMOVED***irAHoy***REMOVED***
        thematicColors=***REMOVED***thematicColors***REMOVED***
      />

      <CalendarSummary
        totalTurnos=***REMOVED***turnosMes.length***REMOVED***
        thematicColors=***REMOVED***thematicColors***REMOVED***
      />

      <CalendarGrid
        dias=***REMOVED***dias***REMOVED***
        fechaActual=***REMOVED***fechaActual***REMOVED***
        diaSeleccionadoActual=***REMOVED***diaSeleccionadoActual***REMOVED***
        trabajos=***REMOVED***todosLosTrabajos || []***REMOVED***
        thematicColors=***REMOVED***thematicColors***REMOVED***
        onDiaClick=***REMOVED***irADia***REMOVED***
      />
    </Card>
  );
***REMOVED***;

export default Calendario;