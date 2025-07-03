// src/components/calendar/Calendario/index.jsx - Versión corregida

import React from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useCalendarState ***REMOVED*** from '../../../hooks/useCalendarState';
import ***REMOVED*** obtenerTurnosMes ***REMOVED*** from '../../../utils/calendarUtils';
import Card from '../../ui/Card';
import CalendarHeader from '../CalendarHeader';
import CalendarSummary from '../CalendarSummary';
import CalendarGrid from '../CalendarGrid';

const Calendario = (***REMOVED*** onDiaSeleccionado ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** turnosPorFecha, todosLosTrabajos, coloresTemáticos ***REMOVED*** = useApp();
  
  console.log('📅 Calendario - Datos del contexto:', ***REMOVED***
    turnosPorFecha: Object.keys(turnosPorFecha || ***REMOVED******REMOVED***).length,
    todosLosTrabajos: todosLosTrabajos?.length || 0
  ***REMOVED***);
  
  // Obtener todos los turnos combinados del contexto
  const todosLosTurnos = React.useMemo(() => ***REMOVED***
    if (!turnosPorFecha) return [];
    
    const turnos = [];
    Object.entries(turnosPorFecha).forEach(([fecha, turnosDia]) => ***REMOVED***
      if (Array.isArray(turnosDia)) ***REMOVED***
        turnos.push(...turnosDia);
      ***REMOVED***
    ***REMOVED***);
    
    console.log('📅 Turnos extraídos para calendario:', ***REMOVED***
      total: turnos.length,
      tradicionales: turnos.filter(t => t.tipo !== 'delivery').length,
      delivery: turnos.filter(t => t.tipo === 'delivery').length
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

  console.log('📅 Calendario renderizado:', ***REMOVED***
    mesActual,
    anioActual,
    turnosMes: turnosMes.length,
    diasConTurnos: dias.filter(d => d.tieneTurnos).length
  ***REMOVED***);

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
        trabajos=***REMOVED***todosLosTrabajos || []***REMOVED***
        coloresTemáticos=***REMOVED***coloresTemáticos***REMOVED***
        onDiaClick=***REMOVED***irADia***REMOVED***
      />
    </Card>
  );
***REMOVED***;

export default Calendario;