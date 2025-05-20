// src/contexts/AppContext.jsx - Corregido

import React, ***REMOVED*** createContext, useState, useEffect, useContext ***REMOVED*** from 'react';
import ***REMOVED*** 
  obtenerTrabajos, 
  guardarTrabajo, 
  actualizarTrabajo, 
  eliminarTrabajo 
***REMOVED*** from '../services/trabajosService';
import ***REMOVED*** 
  obtenerTurnos, 
  guardarTurno, 
  actualizarTurno, 
  eliminarTurno 
***REMOVED*** from '../services/turnosService';

// Primero creamos el contexto
export const AppContext = createContext();

// Definimos PRIMERO el hook personalizado para usar el contexto
export const useApp = () => ***REMOVED***
  const context = useContext(AppContext);
  if (!context) ***REMOVED***
    throw new Error('useApp debe usarse dentro de un AppProvider');
  ***REMOVED***
  return context;
***REMOVED***;

// DESPUÉS definimos el proveedor del contexto
export const AppProvider = (***REMOVED*** children ***REMOVED***) => ***REMOVED***
  const [trabajos, setTrabajos] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [modoDesarrollo, setModoDesarrollo] = useState(true);
  
  useEffect(() => ***REMOVED***
    const cargarDatos = async () => ***REMOVED***
      try ***REMOVED***
        setCargando(true);
        
        if (modoDesarrollo) ***REMOVED***
          const trabajosData = [
            ***REMOVED***
              id: 'trabajo-1',
              nombre: 'SunCorp Stadium',
              color: '#FFC107',
              tarifaBase: 30.13,
              tarifas: ***REMOVED***
                diurno: 30.13,
                tarde: 33.14,
                noche: 36.16,
                sabado: 45.20,
                domingo: 60.26
              ***REMOVED***
            ***REMOVED***,
            ***REMOVED***
              id: 'trabajo-2',
              nombre: 'StaffLink',
              color: '#4CAF50',
              tarifaBase: 28.50,
              tarifas: ***REMOVED***
                diurno: 28.50,
                tarde: 31.35,
                noche: 34.20,
                sabado: 42.75,
                domingo: 57.00
              ***REMOVED***
            ***REMOVED***
          ];

          const turnosData = [
            ***REMOVED***
              id: 'turno-1',
              trabajoId: 'trabajo-1',
              fecha: '2025-05-19',
              horaInicio: '17:00',
              horaFin: '23:30',
              tipo: 'tarde'
            ***REMOVED***,
            ***REMOVED***
              id: 'turno-2',
              trabajoId: 'trabajo-2',
              fecha: '2025-05-19',
              horaInicio: '08:00',
              horaFin: '11:30',
              tipo: 'diurno'
            ***REMOVED***
          ];
          
          setTrabajos(trabajosData);
          setTurnos(turnosData);
        ***REMOVED*** else ***REMOVED***
          const trabajosData = await obtenerTrabajos();
          const turnosData = await obtenerTurnos();
          
          setTrabajos(trabajosData);
          setTurnos(turnosData);
        ***REMOVED***
        
        setCargando(false);
      ***REMOVED*** catch (err) ***REMOVED***
        setError('Error al cargar datos: ' + err.message);
        setCargando(false);
      ***REMOVED***
    ***REMOVED***;
    
    cargarDatos();
  ***REMOVED***, [modoDesarrollo]);
  
  // Funciones para trabajos
  const agregarTrabajo = async (nuevoTrabajo) => ***REMOVED***
    try ***REMOVED***
      let trabajoGuardado;
      
      if (modoDesarrollo) ***REMOVED***
        trabajoGuardado = ***REMOVED***
          ...nuevoTrabajo,
          id: `trabajo-$***REMOVED***Date.now()***REMOVED***`
        ***REMOVED***;
      ***REMOVED*** else ***REMOVED***
        trabajoGuardado = await guardarTrabajo(nuevoTrabajo);
      ***REMOVED***
      
      setTrabajos([...trabajos, trabajoGuardado]);
      return trabajoGuardado;
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al agregar trabajo: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***;
  
  const editarTrabajo = async (id, datosActualizados) => ***REMOVED***
    try ***REMOVED***
      if (!modoDesarrollo) ***REMOVED***
        await actualizarTrabajo(id, datosActualizados);
      ***REMOVED***
      
      setTrabajos(trabajos.map(trabajo => 
        trabajo.id === id ? ***REMOVED*** ...trabajo, ...datosActualizados ***REMOVED*** : trabajo
      ));
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al editar trabajo: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***;
  
  const borrarTrabajo = async (id) => ***REMOVED***
    try ***REMOVED***
      if (!modoDesarrollo) ***REMOVED***
        await eliminarTrabajo(id);
      ***REMOVED***
      
      setTrabajos(trabajos.filter(trabajo => trabajo.id !== id));
      setTurnos(turnos.filter(turno => turno.trabajoId !== id));
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al eliminar trabajo: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***;
  
  // Funciones para turnos
  const agregarTurno = async (nuevoTurno) => ***REMOVED***
    try ***REMOVED***
      let turnoGuardado;
      
      if (modoDesarrollo) ***REMOVED***
        turnoGuardado = ***REMOVED***
          ...nuevoTurno,
          id: `turno-$***REMOVED***Date.now()***REMOVED***`
        ***REMOVED***;
      ***REMOVED*** else ***REMOVED***
        turnoGuardado = await guardarTurno(nuevoTurno);
      ***REMOVED***
      
      setTurnos([...turnos, turnoGuardado]);
      return turnoGuardado;
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al agregar turno: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***;
  
  const editarTurno = async (id, datosActualizados) => ***REMOVED***
    try ***REMOVED***
      if (!modoDesarrollo) ***REMOVED***
        await actualizarTurno(id, datosActualizados);
      ***REMOVED***
      
      setTurnos(turnos.map(turno => 
        turno.id === id ? ***REMOVED*** ...turno, ...datosActualizados ***REMOVED*** : turno
      ));
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al editar turno: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***;
  
  const borrarTurno = async (id) => ***REMOVED***
    try ***REMOVED***
      if (!modoDesarrollo) ***REMOVED***
        await eliminarTurno(id);
      ***REMOVED***
      
      setTurnos(turnos.filter(turno => turno.id !== id));
    ***REMOVED*** catch (err) ***REMOVED***
      setError('Error al eliminar turno: ' + err.message);
      throw err;
    ***REMOVED***
  ***REMOVED***;
  
  // Función para cambiar entre modo desarrollo y producción
  const toggleModoDesarrollo = () => ***REMOVED***
    setModoDesarrollo(!modoDesarrollo);
  ***REMOVED***;
  
  // Agrupar turnos por fecha
  const turnosPorFecha = turnos.reduce((acc, turno) => ***REMOVED***
    if (!acc[turno.fecha]) ***REMOVED***
      acc[turno.fecha] = [];
    ***REMOVED***
    acc[turno.fecha].push(turno);
    return acc;
  ***REMOVED***, ***REMOVED******REMOVED***);
  
  // Calcular horas trabajadas
  const calcularHoras = (inicio, fin) => ***REMOVED***
    const [horaInicio, minInicio] = inicio.split(':').map(n => parseInt(n));
    const [horaFin, minFin] = fin.split(':').map(n => parseInt(n));
    
    const inicioMinutos = horaInicio * 60 + minInicio;
    const finMinutos = horaFin * 60 + minFin;
    
    return (finMinutos - inicioMinutos) / 60;
  ***REMOVED***;
  
  // Calcular el pago de un turno
  const calcularPago = (turno) => ***REMOVED***
    const trabajo = trabajos.find(t => t.id === turno.trabajoId);
    if (!trabajo) return ***REMOVED*** total: 0, totalConDescuento: 0, horas: 0 ***REMOVED***;
    
    const horas = calcularHoras(turno.horaInicio, turno.horaFin);
    let tarifa = trabajo.tarifaBase;
    
    switch (turno.tipo) ***REMOVED***
      case 'diurno':
        tarifa = trabajo.tarifas.diurno;
        break;
      case 'tarde':
        tarifa = trabajo.tarifas.tarde;
        break;
      case 'noche':
        tarifa = trabajo.tarifas.noche;
        break;
      case 'sabado':
        tarifa = trabajo.tarifas.sabado;
        break;
      case 'domingo':
        tarifa = trabajo.tarifas.domingo;
        break;
      default:
        tarifa = trabajo.tarifaBase;
    ***REMOVED***
    
    const total = horas * tarifa;
    const totalConDescuento = total * 0.85; 
    
    return ***REMOVED***
      total,
      totalConDescuento,
      horas
    ***REMOVED***;
  ***REMOVED***;
  
  // Calcular total del día
  const calcularTotalDia = (turnosDia) => ***REMOVED***
    let total = 0;
    turnosDia.forEach(turno => ***REMOVED***
      const ***REMOVED*** totalConDescuento ***REMOVED*** = calcularPago(turno);
      total += totalConDescuento;
    ***REMOVED***);
    return total;
  ***REMOVED***;
  
  // Formatear fecha
  const formatearFecha = (fechaStr) => ***REMOVED***
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', ***REMOVED*** 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    ***REMOVED***);
  ***REMOVED***;
  
  // Valor del contexto
  const contextValue = ***REMOVED***
    trabajos,
    turnos,
    turnosPorFecha,
    cargando,
    error,
    modoDesarrollo,
    toggleModoDesarrollo,
    agregarTrabajo,
    editarTrabajo,
    borrarTrabajo,
    agregarTurno,
    editarTurno,
    borrarTurno,
    calcularHoras,
    calcularPago,
    calcularTotalDia,
    formatearFecha
  ***REMOVED***;
  
  return (
    <AppContext.Provider value=***REMOVED***contextValue***REMOVED***>
      ***REMOVED***children***REMOVED***
    </AppContext.Provider>
  );
***REMOVED***;