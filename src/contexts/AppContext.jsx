// src/contexts/AppContext.jsx - Corregido

import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  obtenerTrabajos, 
  guardarTrabajo, 
  actualizarTrabajo, 
  eliminarTrabajo 
} from '../services/trabajosService';
import { 
  obtenerTurnos, 
  guardarTurno, 
  actualizarTurno, 
  eliminarTurno 
} from '../services/turnosService';

// Primero creamos el contexto
export const AppContext = createContext();

// Definimos PRIMERO el hook personalizado para usar el contexto
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de un AppProvider');
  }
  return context;
};

// DESPUÉS definimos el proveedor del contexto
export const AppProvider = ({ children }) => {
  const [trabajos, setTrabajos] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [modoDesarrollo, setModoDesarrollo] = useState(true);
  
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        
        if (modoDesarrollo) {
          const trabajosData = [
            {
              id: 'trabajo-1',
              nombre: 'SunCorp Stadium',
              color: '#FFC107',
              tarifaBase: 30.13,
              tarifas: {
                diurno: 30.13,
                tarde: 33.14,
                noche: 36.16,
                sabado: 45.20,
                domingo: 60.26
              }
            },
            {
              id: 'trabajo-2',
              nombre: 'StaffLink',
              color: '#4CAF50',
              tarifaBase: 28.50,
              tarifas: {
                diurno: 28.50,
                tarde: 31.35,
                noche: 34.20,
                sabado: 42.75,
                domingo: 57.00
              }
            }
          ];

          const turnosData = [
            {
              id: 'turno-1',
              trabajoId: 'trabajo-1',
              fecha: '2025-05-19',
              horaInicio: '17:00',
              horaFin: '23:30',
              tipo: 'tarde'
            },
            {
              id: 'turno-2',
              trabajoId: 'trabajo-2',
              fecha: '2025-05-19',
              horaInicio: '08:00',
              horaFin: '11:30',
              tipo: 'diurno'
            }
          ];
          
          setTrabajos(trabajosData);
          setTurnos(turnosData);
        } else {
          const trabajosData = await obtenerTrabajos();
          const turnosData = await obtenerTurnos();
          
          setTrabajos(trabajosData);
          setTurnos(turnosData);
        }
        
        setCargando(false);
      } catch (err) {
        setError('Error al cargar datos: ' + err.message);
        setCargando(false);
      }
    };
    
    cargarDatos();
  }, [modoDesarrollo]);
  
  // Funciones para trabajos
  const agregarTrabajo = async (nuevoTrabajo) => {
    try {
      let trabajoGuardado;
      
      if (modoDesarrollo) {
        trabajoGuardado = {
          ...nuevoTrabajo,
          id: `trabajo-${Date.now()}`
        };
      } else {
        trabajoGuardado = await guardarTrabajo(nuevoTrabajo);
      }
      
      setTrabajos([...trabajos, trabajoGuardado]);
      return trabajoGuardado;
    } catch (err) {
      setError('Error al agregar trabajo: ' + err.message);
      throw err;
    }
  };
  
  const editarTrabajo = async (id, datosActualizados) => {
    try {
      if (!modoDesarrollo) {
        await actualizarTrabajo(id, datosActualizados);
      }
      
      setTrabajos(trabajos.map(trabajo => 
        trabajo.id === id ? { ...trabajo, ...datosActualizados } : trabajo
      ));
    } catch (err) {
      setError('Error al editar trabajo: ' + err.message);
      throw err;
    }
  };
  
  const borrarTrabajo = async (id) => {
    try {
      if (!modoDesarrollo) {
        await eliminarTrabajo(id);
      }
      
      setTrabajos(trabajos.filter(trabajo => trabajo.id !== id));
      setTurnos(turnos.filter(turno => turno.trabajoId !== id));
    } catch (err) {
      setError('Error al eliminar trabajo: ' + err.message);
      throw err;
    }
  };
  
  // Funciones para turnos
  const agregarTurno = async (nuevoTurno) => {
    try {
      let turnoGuardado;
      
      if (modoDesarrollo) {
        turnoGuardado = {
          ...nuevoTurno,
          id: `turno-${Date.now()}`
        };
      } else {
        turnoGuardado = await guardarTurno(nuevoTurno);
      }
      
      setTurnos([...turnos, turnoGuardado]);
      return turnoGuardado;
    } catch (err) {
      setError('Error al agregar turno: ' + err.message);
      throw err;
    }
  };
  
  const editarTurno = async (id, datosActualizados) => {
    try {
      if (!modoDesarrollo) {
        await actualizarTurno(id, datosActualizados);
      }
      
      setTurnos(turnos.map(turno => 
        turno.id === id ? { ...turno, ...datosActualizados } : turno
      ));
    } catch (err) {
      setError('Error al editar turno: ' + err.message);
      throw err;
    }
  };
  
  const borrarTurno = async (id) => {
    try {
      if (!modoDesarrollo) {
        await eliminarTurno(id);
      }
      
      setTurnos(turnos.filter(turno => turno.id !== id));
    } catch (err) {
      setError('Error al eliminar turno: ' + err.message);
      throw err;
    }
  };
  
  // Función para cambiar entre modo desarrollo y producción
  const toggleModoDesarrollo = () => {
    setModoDesarrollo(!modoDesarrollo);
  };
  
  // Agrupar turnos por fecha
  const turnosPorFecha = turnos.reduce((acc, turno) => {
    if (!acc[turno.fecha]) {
      acc[turno.fecha] = [];
    }
    acc[turno.fecha].push(turno);
    return acc;
  }, {});
  
  // Calcular horas trabajadas
  const calcularHoras = (inicio, fin) => {
    const [horaInicio, minInicio] = inicio.split(':').map(n => parseInt(n));
    const [horaFin, minFin] = fin.split(':').map(n => parseInt(n));
    
    const inicioMinutos = horaInicio * 60 + minInicio;
    const finMinutos = horaFin * 60 + minFin;
    
    return (finMinutos - inicioMinutos) / 60;
  };
  
  // Calcular el pago de un turno
  const calcularPago = (turno) => {
    const trabajo = trabajos.find(t => t.id === turno.trabajoId);
    if (!trabajo) return { total: 0, totalConDescuento: 0, horas: 0 };
    
    const horas = calcularHoras(turno.horaInicio, turno.horaFin);
    let tarifa = trabajo.tarifaBase;
    
    switch (turno.tipo) {
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
    }
    
    const total = horas * tarifa;
    const totalConDescuento = total * 0.85; 
    
    return {
      total,
      totalConDescuento,
      horas
    };
  };
  
  // Calcular total del día
  const calcularTotalDia = (turnosDia) => {
    let total = 0;
    turnosDia.forEach(turno => {
      const { totalConDescuento } = calcularPago(turno);
      total += totalConDescuento;
    });
    return total;
  };
  
  // Formatear fecha
  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Valor del contexto
  const contextValue = {
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
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};