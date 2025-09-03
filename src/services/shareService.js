// src/services/shareService.js

import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  addDoc,
  collection 
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Genera un token único para compartir un trabajo
 * @returns {string}
 */
const generarTokenCompartir = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Date.now().toString(36);
};

/**
 * Limpia y valida los datos del trabajo antes de compartir
 * @param {Object} trabajo - Datos del trabajo a compartir
 * @returns {Object} - Datos del trabajo limpios
 */
const limpiarDatosTrabajo = (trabajo) => {
  const datosLimpios = {};
  
  // Campos obligatorios con valores por defecto
  datosLimpios.nombre = trabajo.nombre || 'Trabajo sin nombre';
  datosLimpios.descripcion = trabajo.descripcion || '';
  datosLimpios.color = trabajo.color || '#EC4899'; // Color por defecto
  
  // Para trabajos tradicionales - incluir tarifa base
  if (trabajo.tarifaBase !== undefined && trabajo.tarifaBase !== null) {
    datosLimpios.tarifaBase = trabajo.tarifaBase;
  }
  
  // Para trabajos tradicionales - incluir TODAS las tarifas especiales
  if (trabajo.tarifas && typeof trabajo.tarifas === 'object') {
    datosLimpios.tarifas = {};
    
    if (trabajo.tarifas.diurno !== undefined && trabajo.tarifas.diurno !== null) {
      datosLimpios.tarifas.diurno = trabajo.tarifas.diurno;
    }
    if (trabajo.tarifas.tarde !== undefined && trabajo.tarifas.tarde !== null) {
      datosLimpios.tarifas.tarde = trabajo.tarifas.tarde;
    }
    if (trabajo.tarifas.noche !== undefined && trabajo.tarifas.noche !== null) {
      datosLimpios.tarifas.noche = trabajo.tarifas.noche;
    }
    if (trabajo.tarifas.sabado !== undefined && trabajo.tarifas.sabado !== null) {
      datosLimpios.tarifas.sabado = trabajo.tarifas.sabado;
    }
    if (trabajo.tarifas.domingo !== undefined && trabajo.tarifas.domingo !== null) {
      datosLimpios.tarifas.domingo = trabajo.tarifas.domingo;
    }
    
    // Si no hay tarifas válidas, eliminar el objeto tarifas
    if (Object.keys(datosLimpios.tarifas).length === 0) {
      delete datosLimpios.tarifas;
    }
  }
  
  // Para trabajos de delivery
  if (trabajo.tipo === 'delivery') {
    datosLimpios.tipo = 'delivery';
    
    // Incluir plataforma si existe
    if (trabajo.plataforma) {
      datosLimpios.plataforma = trabajo.plataforma;
    }
    
    // Incluir vehículo
    if (trabajo.vehiculo) {
      datosLimpios.vehiculo = trabajo.vehiculo;
    }
    
    // Para delivery, usar colorAvatar si existe, sino usar color normal
    if (trabajo.colorAvatar) {
      datosLimpios.color = trabajo.colorAvatar;
    }
    
    if (trabajo.configuracion) {
      datosLimpios.configuracion = trabajo.configuracion;
    }
  }
    return datosLimpios;
};

/**
 * Crea un enlace para compartir un trabajo directamente por correo o mensajería
 * @param {string} userId - ID del usuario que comparte
 * @param {Object} trabajo - Datos del trabajo a compartir
 * @returns {Promise<string>} - URL del enlace de compartir
 */
export const crearEnlaceCompartir = async (userId, trabajo) => {
  try {    
    const token = generarTokenCompartir();
    
    // Limpiar datos del trabajo para evitar undefined
    const trabajoLimpio = limpiarDatosTrabajo(trabajo);
        
    // Crear documento temporal en Firestore con los datos del trabajo
    const shareDocRef = doc(db, 'trabajos_compartidos', token);
    
    const datosCompartir = {
      // Datos del trabajo limpios (sin valores undefined)
      trabajoData: trabajoLimpio,
      // Metadatos de compartir
      compartidoPor: userId,
      fechaCreacion: serverTimestamp(),
      fechaExpiracion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      activo: true,
      vecesUsado: 0,
      limiteUsos: 10
    };
        
    await setDoc(shareDocRef, datosCompartir);
    
    // Generar URL completa
    const baseUrl = window.location.origin || 'https://gestortrabajo.netlify.app';
    const enlaceCompartir = `${baseUrl}/compartir/${token}`;
    
    return enlaceCompartir;
    
  } catch (error) {
    throw new Error('No se pudo crear el enlace de compartir');
  }
};

/**
 * Función para compartir trabajo utilizando las API nativas de dispositivos móviles
 * @param {string} userId - ID del usuario que comparte
 * @param {Object} trabajo - Datos del trabajo a compartir
 */
export const compartirTrabajoNativo = async (userId, trabajo) => {
  try {
    
    // Generar enlace de compartir
    const enlace = await crearEnlaceCompartir(userId, trabajo);
    
    // Texto para compartir personalizado según el tipo
    let mensaje;
    if (trabajo.tipo === 'delivery') {
      mensaje = `¡Te comparto los detalles de mi trabajo de delivery "${trabajo.nombre}"!`;
      if (trabajo.plataforma) {
        mensaje += ` Es para ${trabajo.plataforma}`;
      }
      if (trabajo.vehiculo) {
        mensaje += ` usando ${trabajo.vehiculo}`;
      }
    } else {
      mensaje = `¡Te comparto los detalles de mi trabajo "${trabajo.nombre}"!`;
      if (trabajo.tarifaBase) {
        mensaje += ` Con tarifa base de $${trabajo.tarifaBase}/hora`;
      }
    }
    
    const textoCompartir = `${mensaje}\n\nVisita este enlace para más información:\n${enlace}`;
    
    // Verificar si el navegador soporta Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Trabajo: ${trabajo.nombre}`,
          text: mensaje,
          url: enlace
        });
        return true;
      } catch (error) {
        // Si el usuario cancela o hay un error, usar fallback
        if (error.name !== 'AbortError') {
          return await copiarAlPortapapeles(textoCompartir);
        }
        // Si el usuario canceló, no hacer nada más
        return false;
      }
    } else {
      // Fallback para navegadores que no soportan Web Share API
      return await copiarAlPortapapeles(textoCompartir);
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Obtiene los datos de un trabajo compartido usando el token
 * @param {string} token - Token del enlace compartido
 * @returns {Promise<Object|null>} - Datos del trabajo compartido o null si no existe/expiró
 */
export const obtenerTrabajoCompartido = async (token) => {
  try {
    
    const shareDocRef = doc(db, 'trabajos_compartidos', token);
    const shareDoc = await getDoc(shareDocRef);
    
    if (!shareDoc.exists()) {
      throw new Error('El enlace de compartir no existe o ha expirado');
    }
    
    const datos = shareDoc.data();
    
    // Verificar si el enlace sigue activo
    if (!datos.activo) {
      throw new Error('Este enlace de compartir ya no está activo');
    }
    
    // Verificar si ha expirado
    const ahora = new Date();
    const fechaExpiracion = datos.fechaExpiracion.toDate();
    
    if (ahora > fechaExpiracion) {
      // Marcar como inactivo
      await setDoc(shareDocRef, { ...datos, activo: false }, { merge: true });
      throw new Error('Este enlace de compartir ha expirado');
    }
    
    // Verificar límite de usos
    if (datos.vecesUsado >= datos.limiteUsos) {
      await setDoc(shareDocRef, { ...datos, activo: false }, { merge: true });
      throw new Error('Este enlace de compartir ha alcanzado su límite de usos');
    }
    
    
    return {
      trabajoData: datos.trabajoData,
      token: token,
      compartidoPor: datos.compartidoPor,
      vecesUsado: datos.vecesUsado
    };
    
  } catch (error) {
    throw error;
  }
};

/**
 * Acepta un trabajo compartido y lo agrega al perfil del usuario
 * @param {string} userId - ID del usuario que acepta
 * @param {string} token - Token del enlace compartido
 * @returns {Promise<Object>} - Datos del trabajo agregado
 */
export const aceptarTrabajoCompartido = async (userId, token) => {
  try {
    
    const shareDocRef = doc(db, 'trabajos_compartidos', token);
    const shareDoc = await getDoc(shareDocRef);
    
    if (!shareDoc.exists()) {
      throw new Error('El enlace de compartir no existe');
    }
    
    const datos = shareDoc.data();
    
    // Verificar que el usuario no sea el mismo que compartió
    if (datos.compartidoPor === userId) {
      throw new Error('No puedes agregar tu propio trabajo compartido');
    }
    
    // Determinar la colección correcta según el tipo
    const esDelivery = datos.trabajoData.tipo === 'delivery';
    const collectionName = esDelivery ? 'trabajos-delivery' : 'trabajos';
    const userTrabajosRef = collection(db, 'usuarios', userId, collectionName);
    
    const nuevoTrabajo = {
      ...datos.trabajoData,
      fechaCreacion: serverTimestamp(),
      fechaActualizacion: serverTimestamp(),
      origen: 'compartido',
      tokenOrigen: token
    };
        
    const docRef = await addDoc(userTrabajosRef, nuevoTrabajo);
    
    // Incrementar contador de usos
    await setDoc(shareDocRef, {
      ...datos,
      vecesUsado: datos.vecesUsado + 1
    }, { merge: true });
    
    
    return {
      id: docRef.id,
      ...nuevoTrabajo
    };
    
  } catch (error) {
    throw error;
  }
};

/**
 * Copia un texto al portapapeles y muestra una notificación
 * @param {string} texto - Texto a copiar
 * @returns {Promise<boolean>} - true si se copió exitosamente
 */
export const copiarAlPortapapeles = async (texto) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      // Usar la API moderna de clipboard
      await navigator.clipboard.writeText(texto);
      
      // Mostrar notificación visual opcional
      if (window.showToast) {
        window.showToast('Enlace copiado al portapapeles');
      } else {
      }
      
      return true;
    } else {
      // Fallback para navegadores más antiguos
      const textArea = document.createElement('textarea');
      textArea.value = texto;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const resultado = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (resultado) {
      }
      
      return resultado;
    }
  } catch (error) {
    return false;
  }
};