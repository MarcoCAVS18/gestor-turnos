// src/hooks/useCalendarState.js

import ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** 
  crearFechaLocal, 
  fechaLocalAISO, 
  fechaEsHoy 
***REMOVED*** from '../utils/calendarUtils';

export const useCalendarState = (turnos, onDiaSeleccionado) => ***REMOVED***
  const [fechaActual, setFechaActual] = useState(new Date());
  const [mesActual, setMesActual] = useState(fechaActual.getMonth());
  const [anioActual, setAnioActual] = useState(fechaActual.getFullYear());
  const [diaSeleccionadoActual, setDiaSeleccionadoActual] = useState(null);

  // Actualizar fecha actual cada minuto
  useEffect(() => ***REMOVED***
    const intervalo = setInterval(() => ***REMOVED***
      const nuevaFecha = new Date();
      setFechaActual(nuevaFecha);
      
      if (nuevaFecha.getDate() !== fechaActual.getDate()) ***REMOVED***
        setMesActual(nuevaFecha.getMonth());
        setAnioActual(nuevaFecha.getFullYear());
      ***REMOVED***
    ***REMOVED***, 60000);

    return () => clearInterval(intervalo);
  ***REMOVED***, [fechaActual]);

  // Obtener turnos del día considerando turnos nocturnos
  const obtenerTurnosDelDia = (fecha, todosLosTurnos) => ***REMOVED***
    const fechaStr = fechaLocalAISO(fecha);
    
    return todosLosTurnos.filter(turno => ***REMOVED***
      // Verificar fecha principal
      const fechaPrincipal = turno.fechaInicio || turno.fecha;
      if (fechaPrincipal === fechaStr) ***REMOVED***
        return true;
      ***REMOVED***
      
      // NUEVO: Verificar si es un turno nocturno que termina en esta fecha
      const esNocturno = turno.cruzaMedianoche || 
        (turno.horaInicio && turno.horaFin && 
         turno.horaInicio.split(':')[0] > turno.horaFin.split(':')[0]);
      
      if (esNocturno) ***REMOVED***
        // Si tiene fechaFin explícita, usarla
        if (turno.fechaFin && turno.fechaFin === fechaStr) ***REMOVED***
          return true;
        ***REMOVED***
        
        // Si no tiene fechaFin pero es nocturno, calcular si termina este día
        if (!turno.fechaFin && fechaPrincipal) ***REMOVED***
          const fechaInicio = new Date(fechaPrincipal + 'T00:00:00');
          const fechaFinCalculada = new Date(fechaInicio);
          fechaFinCalculada.setDate(fechaFinCalculada.getDate() + 1);
          const fechaFinStr = fechaFinCalculada.toISOString().split('T')[0];
          
          if (fechaFinStr === fechaStr) ***REMOVED***
            return true;
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***
      
      return false;
    ***REMOVED***);
  ***REMOVED***;

  // FUNCIÓN ACTUALIZADA: Obtener días del mes considerando turnos nocturnos
  const obtenerDiasDelMes = () => ***REMOVED***
    const primerDia = crearFechaLocal(anioActual, mesActual, 1);
    const ultimoDia = crearFechaLocal(anioActual, mesActual + 1, 0);

    let diaInicio = primerDia.getDay() - 1;
    if (diaInicio === -1) diaInicio = 6;

    const dias = [];

    // Días del mes anterior
    for (let i = diaInicio; i > 0; i--) ***REMOVED***
      const fecha = crearFechaLocal(anioActual, mesActual, -i + 1);
      const turnosDelDia = obtenerTurnosDelDia(fecha, turnos);
      dias.push(***REMOVED***
        fecha,
        dia: fecha.getDate(),
        mesActual: false,
        tieneTurnos: turnosDelDia.length > 0,
        turnosDelDia
      ***REMOVED***);
    ***REMOVED***

    // Días del mes actual
    for (let i = 1; i <= ultimoDia.getDate(); i++) ***REMOVED***
      const fecha = crearFechaLocal(anioActual, mesActual, i);
      const turnosDelDia = obtenerTurnosDelDia(fecha, turnos);
      dias.push(***REMOVED***
        fecha,
        dia: i,
        mesActual: true,
        tieneTurnos: turnosDelDia.length > 0,
        turnosDelDia,
        esHoy: fechaEsHoy(fecha, fechaActual)
      ***REMOVED***);
    ***REMOVED***

    // Completar la última semana
    const diasRestantes = 42 - dias.length;
    for (let i = 1; i <= diasRestantes; i++) ***REMOVED***
      const fecha = crearFechaLocal(anioActual, mesActual + 1, i);
      const turnosDelDia = obtenerTurnosDelDia(fecha, turnos);
      dias.push(***REMOVED***
        fecha,
        dia: i,
        mesActual: false,
        tieneTurnos: turnosDelDia.length > 0,
        turnosDelDia
      ***REMOVED***);
    ***REMOVED***

    return dias;
  ***REMOVED***;

  // Handlers
  const cambiarMes = (incremento) => ***REMOVED***
    let nuevoMes = mesActual + incremento;
    let nuevoAnio = anioActual;

    if (nuevoMes < 0) ***REMOVED***
      nuevoMes = 11;
      nuevoAnio--;
    ***REMOVED*** else if (nuevoMes > 11) ***REMOVED***
      nuevoMes = 0;
      nuevoAnio++;
    ***REMOVED***

    setMesActual(nuevoMes);
    setAnioActual(nuevoAnio);
  ***REMOVED***;

  const irAHoy = () => ***REMOVED***
    const hoy = new Date();
    setFechaActual(hoy);
    setMesActual(hoy.getMonth());
    setAnioActual(hoy.getFullYear());
    
    const fechaStr = fechaLocalAISO(hoy);
    setDiaSeleccionadoActual(fechaStr);
    
    if (onDiaSeleccionado) ***REMOVED***
      onDiaSeleccionado(hoy);
    ***REMOVED***
  ***REMOVED***;

  const irADia = (fecha) => ***REMOVED***
    const fechaStr = fechaLocalAISO(fecha);
    setDiaSeleccionadoActual(fechaStr);
    
    if (onDiaSeleccionado) ***REMOVED***
      onDiaSeleccionado(fecha);
    ***REMOVED***
  ***REMOVED***;

  return ***REMOVED***
    fechaActual,
    mesActual,
    anioActual,
    diaSeleccionadoActual,
    obtenerDiasDelMes,
    cambiarMes,
    irAHoy,
    irADia
  ***REMOVED***;
***REMOVED***;