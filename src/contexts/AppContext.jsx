// src/contexts/AppContext.jsx - Sin modo desarrollo
import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';

// Crear el contexto
export const AppContext = createContext();

// Hook personalizado para usar el contexto
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de un AppProvider');
  }
  return context;
};

// Proveedor del contexto
export const AppProvider = ({ children }) => {
  const { currentUser } = useAuth();
  
  // Estados para los datos principales
  const [trabajos, setTrabajos] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para preferencias de personalización
  const [colorPrincipal, setColorPrincipal] = useState('#EC4899'); // pink-600
  const [emojiUsuario, setEmojiUsuario] = useState('😊');
  const [descuentoDefault, setDescuentoDefault] = useState(15); // 15%
  
  // Cargar datos y preferencias del usuario
  useEffect(() => {
    // Función para cargar datos reales del usuario desde Firebase
    const cargarDatosUsuario = async () => {
      if (!currentUser) {
        setCargando(false);
        return;
      }
      
      try {
        setCargando(true);
        
        // Cargar trabajos del usuario
        const trabajosRef = collection(db, 'trabajos');
        const trabajosQuery = query(
          trabajosRef,
          where('userId', '==', currentUser.uid),
          orderBy('nombre', 'asc')
        );
        
        const trabajosSnapshot = await getDocs(trabajosQuery);
        const trabajosData = trabajosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Cargar turnos del usuario
        const turnosRef = collection(db, 'turnos');
        const turnosQuery = query(
          turnosRef,
          where('userId', '==', currentUser.uid),
          orderBy('fecha', 'desc')
        );
        
        const turnosSnapshot = await getDocs(turnosQuery);
        const turnosData = turnosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Cargar preferencias del usuario
        const userDocRef = doc(db, 'usuarios', currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          if (userData.ajustes) {
            // Establecer preferencias si existen
            setColorPrincipal(userData.ajustes.colorPrincipal || '#EC4899');
            setEmojiUsuario(userData.ajustes.emojiUsuario || '😊');
            setDescuentoDefault(userData.ajustes.descuentoDefault || 15);
          }
        }
        
        // Actualizar estados con datos reales
        setTrabajos(trabajosData);
        setTurnos(turnosData);
        setCargando(false);
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        setError('Error al cargar tus datos. Por favor, intenta de nuevo más tarde.');
        setCargando(false);
      }
    };

    cargarDatosUsuario();
  }, [currentUser]); // Solo depende de currentUser
  
  // Funciones para gestionar trabajos
  const agregarTrabajo = async (nuevoTrabajo) => {
    try {
      // Añadir userId y timestamps
      const trabajoConMetadata = {
        ...nuevoTrabajo,
        userId: currentUser.uid,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      };
      
      // Guardar en Firebase
      const docRef = await addDoc(collection(db, 'trabajos'), trabajoConMetadata);
      const trabajoGuardado = { ...trabajoConMetadata, id: docRef.id };
      
      setTrabajos([...trabajos, trabajoGuardado]);
      return trabajoGuardado;
    } catch (err) {
      setError('Error al agregar trabajo: ' + err.message);
      throw err;
    }
  };
  
  const editarTrabajo = async (id, datosActualizados) => {
    try {
      // Añadir metadata
      const datosConMetadata = {
        ...datosActualizados,
        fechaActualizacion: new Date()
      };
      
      // Actualizar en Firebase
      const docRef = doc(db, 'trabajos', id);
      await updateDoc(docRef, datosConMetadata);
      
      // Actualizar estado local
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
      // Borrar de Firebase
      await deleteDoc(doc(db, 'trabajos', id));
      
      // También borrar los turnos asociados
      const turnosRef = collection(db, 'turnos');
      const turnosQuery = query(
        turnosRef,
        where('userId', '==', currentUser.uid),
        where('trabajoId', '==', id)
      );
      
      const turnosSnapshot = await getDocs(turnosQuery);
      const batch = [];
      
      turnosSnapshot.forEach(doc => {
        batch.push(deleteDoc(doc.ref));
      });
      
      await Promise.all(batch);
      
      // Actualizar estados locales
      setTrabajos(trabajos.filter(trabajo => trabajo.id !== id));
      setTurnos(turnos.filter(turno => turno.trabajoId !== id));
    } catch (err) {
      setError('Error al eliminar trabajo: ' + err.message);
      throw err;
    }
  };
  
  // Funciones para gestionar turnos
  const agregarTurno = async (nuevoTurno) => {
    try {
      // Añadir userId y timestamps
      const turnoConMetadata = {
        ...nuevoTurno,
        userId: currentUser.uid,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      };
      
      // Guardar en Firebase
      const docRef = await addDoc(collection(db, 'turnos'), turnoConMetadata);
      const turnoGuardado = { ...turnoConMetadata, id: docRef.id };
      
      setTurnos([...turnos, turnoGuardado]);
      return turnoGuardado;
    } catch (err) {
      setError('Error al agregar turno: ' + err.message);
      throw err;
    }
  };
  
  const editarTurno = async (id, datosActualizados) => {
    try {
      // Añadir metadata
      const datosConMetadata = {
        ...datosActualizados,
        fechaActualizacion: new Date()
      };
      
      // Actualizar en Firebase
      const docRef = doc(db, 'turnos', id);
      await updateDoc(docRef, datosConMetadata);
      
      // Actualizar estado local
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
      // Borrar de Firebase
      await deleteDoc(doc(db, 'turnos', id));
      
      // Actualizar estado local
      setTurnos(turnos.filter(turno => turno.id !== id));
    } catch (err) {
      setError('Error al eliminar turno: ' + err.message);
      throw err;
    }
  };
  
  // Función para guardar preferencias de usuario
  const guardarPreferencias = async (preferencias) => {
    try {
      const { colorPrincipal: nuevoColor, emojiUsuario: nuevoEmoji, descuentoDefault: nuevoDescuento } = preferencias;
      
      // Actualizar estados locales inmediatamente
      if (nuevoColor !== undefined) setColorPrincipal(nuevoColor);
      if (nuevoEmoji !== undefined) setEmojiUsuario(nuevoEmoji);
      if (nuevoDescuento !== undefined) setDescuentoDefault(nuevoDescuento);
      
      // Guardar en localStorage para persistencia local
      if (nuevoColor !== undefined) localStorage.setItem('colorPrincipal', nuevoColor);
      if (nuevoEmoji !== undefined) localStorage.setItem('emojiUsuario', nuevoEmoji);
      if (nuevoDescuento !== undefined) localStorage.setItem('descuentoDefault', nuevoDescuento.toString());
      
      // Guardar en Firebase
      if (currentUser) {
        const userDocRef = doc(db, 'usuarios', currentUser.uid);
        
        // Crear un objeto con solo las propiedades que se están actualizando
        const datosActualizados = {};
        
        if (nuevoColor !== undefined) datosActualizados['ajustes.colorPrincipal'] = nuevoColor;
        if (nuevoEmoji !== undefined) datosActualizados['ajustes.emojiUsuario'] = nuevoEmoji;
        if (nuevoDescuento !== undefined) datosActualizados['ajustes.descuentoDefault'] = nuevoDescuento;
        datosActualizados['fechaActualizacion'] = new Date();
        
        // Solo actualizar en Firebase si hay algo que actualizar
        if (Object.keys(datosActualizados).length > 1) { // Más de 1 porque siempre incluye fechaActualizacion
          await updateDoc(userDocRef, datosActualizados);
        }
      }
      
      return true;
    } catch (err) {
      setError('Error al guardar preferencias: ' + err.message);
      throw err;
    }
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
    const totalConDescuento = total * (1 - descuentoDefault / 100); 
    
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
    colorPrincipal,
    emojiUsuario,
    descuentoDefault,
    agregarTrabajo,
    editarTrabajo,
    borrarTrabajo,
    agregarTurno,
    editarTurno,
    borrarTurno,
    calcularHoras,
    calcularPago,
    calcularTotalDia,
    formatearFecha,
    guardarPreferencias
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;