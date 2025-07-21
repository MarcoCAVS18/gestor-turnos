// src/hooks/useCalendarState.js

import { useState, useEffect } from 'react';
import { 
  crearFechaLocal, 
  fechaLocalAISO, 
  fechaEsHoy 
} from '../utils/calendarUtils';

export const useCalendarState = (turnos, onDiaSeleccionado) => {
  const [fechaActual, setFechaActual] = useState(new Date());
  const [mesActual, setMesActual] = useState(fechaActual.getMonth());
  const [anioActual, setAnioActual] = useState(fechaActual.getFullYear());
  const [diaSeleccionadoActual, setDiaSeleccionadoActual] = useState(null);

  // Actualizar fecha actual cada minuto
  useEffect(() => {
    const intervalo = setInterval(() => {
      const nuevaFecha = new Date();
      setFechaActual(nuevaFecha);
      
      if (nuevaFecha.getDate() !== fechaActual.getDate()) {
        setMesActual(nuevaFecha.getMonth());
        setAnioActual(nuevaFecha.getFullYear());
      }
    }, 60000);

    return () => clearInterval(intervalo);
  }, [fechaActual]);

  // Obtener turnos del día considerando turnos nocturnos
  const obtenerTurnosDelDia = (fecha, todosLosTurnos) => {
    const fechaStr = fechaLocalAISO(fecha);
    
    return todosLosTurnos.filter(turno => {
      // Verificar fecha principal
      const fechaPrincipal = turno.fechaInicio || turno.fecha;
      if (fechaPrincipal === fechaStr) {
        return true;
      }
      
      // Verificar si es un turno nocturno que termina en esta fecha
      const esNocturno = turno.cruzaMedianoche || 
        (turno.horaInicio && turno.horaFin && 
         turno.horaInicio.split(':')[0] > turno.horaFin.split(':')[0]);
      
      if (esNocturno) {
        // Si tiene fechaFin explícita, usarla
        if (turno.fechaFin && turno.fechaFin === fechaStr) {
          return true;
        }
        
        // Si no tiene fechaFin pero es nocturno, calcular si termina este día
        if (!turno.fechaFin && fechaPrincipal) {
          const fechaInicio = new Date(fechaPrincipal + 'T00:00:00');
          const fechaFinCalculada = new Date(fechaInicio);
          fechaFinCalculada.setDate(fechaFinCalculada.getDate() + 1);
          const fechaFinStr = fechaFinCalculada.toISOString().split('T')[0];
          
          if (fechaFinStr === fechaStr) {
            return true;
          }
        }
      }
      
      return false;
    });
  };

  // FUNCIÓN ACTUALIZADA: Obtener días del mes considerando turnos nocturnos
  const obtenerDiasDelMes = () => {
    const primerDia = crearFechaLocal(anioActual, mesActual, 1);
    const ultimoDia = crearFechaLocal(anioActual, mesActual + 1, 0);

    let diaInicio = primerDia.getDay() - 1;
    if (diaInicio === -1) diaInicio = 6;

    const dias = [];

    // Días del mes anterior
    for (let i = diaInicio; i > 0; i--) {
      const fecha = crearFechaLocal(anioActual, mesActual, -i + 1);
      const turnosDelDia = obtenerTurnosDelDia(fecha, turnos);
      dias.push({
        fecha,
        dia: fecha.getDate(),
        mesActual: false,
        tieneTurnos: turnosDelDia.length > 0,
        turnosDelDia
      });
    }

    // Días del mes actual
    for (let i = 1; i <= ultimoDia.getDate(); i++) {
      const fecha = crearFechaLocal(anioActual, mesActual, i);
      const turnosDelDia = obtenerTurnosDelDia(fecha, turnos);
      dias.push({
        fecha,
        dia: i,
        mesActual: true,
        tieneTurnos: turnosDelDia.length > 0,
        turnosDelDia,
        esHoy: fechaEsHoy(fecha, fechaActual)
      });
    }

    // Completar la última semana
    const diasRestantes = 42 - dias.length;
    for (let i = 1; i <= diasRestantes; i++) {
      const fecha = crearFechaLocal(anioActual, mesActual + 1, i);
      const turnosDelDia = obtenerTurnosDelDia(fecha, turnos);
      dias.push({
        fecha,
        dia: i,
        mesActual: false,
        tieneTurnos: turnosDelDia.length > 0,
        turnosDelDia
      });
    }

    return dias;
  };

  // Handlers
  const cambiarMes = (incremento) => {
    let nuevoMes = mesActual + incremento;
    let nuevoAnio = anioActual;

    if (nuevoMes < 0) {
      nuevoMes = 11;
      nuevoAnio--;
    } else if (nuevoMes > 11) {
      nuevoMes = 0;
      nuevoAnio++;
    }

    setMesActual(nuevoMes);
    setAnioActual(nuevoAnio);
  };

  const irAHoy = () => {
    const hoy = new Date();
    setFechaActual(hoy);
    setMesActual(hoy.getMonth());
    setAnioActual(hoy.getFullYear());
    
    const fechaStr = fechaLocalAISO(hoy);
    setDiaSeleccionadoActual(fechaStr);
    
    if (onDiaSeleccionado) {
      onDiaSeleccionado(hoy);
    }
  };

  const irADia = (fecha) => {
    const fechaStr = fechaLocalAISO(fecha);
    setDiaSeleccionadoActual(fechaStr);
    
    if (onDiaSeleccionado) {
      onDiaSeleccionado(fecha);
    }
  };

  return {
    fechaActual,
    mesActual,
    anioActual,
    diaSeleccionadoActual,
    obtenerDiasDelMes,
    cambiarMes,
    irAHoy,
    irADia
  };
};