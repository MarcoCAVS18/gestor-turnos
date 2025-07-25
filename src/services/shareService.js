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
  
  // Campos opcionales - solo agregar si existen
  if (trabajo.tarifaBase !== undefined && trabajo.tarifaBase !== null) {
    datosLimpios.tarifaBase = trabajo.tarifaBase;
  }
  
  if (trabajo.tarifas && typeof trabajo.tarifas === 'object') {
    datosLimpios.tarifas = {};
    
    // Limpiar tarifas individualmente
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
  }
  
  // Para trabajos de delivery
  if (trabajo.tipo === 'delivery') {
    datosLimpios.tipo = 'delivery';
    
    if (trabajo.plataforma) {
      datosLimpios.plataforma = trabajo.plataforma;
    }
    
    if (trabajo.vehiculo) {
      datosLimpios.vehiculo = trabajo.vehiculo;
    }
    
    // Para delivery, usar colorAvatar si existe
    if (trabajo.colorAvatar) {
      datosLimpios.color = trabajo.colorAvatar;
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
    console.log('Datos del trabajo recibidos:', trabajo);
    
    const token = generarTokenCompartir();
    
    // Limpiar datos del trabajo para evitar undefined
    const trabajoLimpio = limpiarDatosTrabajo(trabajo);
    
    console.log('Datos del trabajo después de limpiar:', trabajoLimpio);
    
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
    
    console.log('Datos a guardar en Firestore:', datosCompartir);
    
    await setDoc(shareDocRef, datosCompartir);
    
    // Generar URL completa
    const baseUrl = window.location.origin || 'https://gestortrabajo.netlify.app';
    const enlaceCompartir = `${baseUrl}/compartir/${token}`;

    console.log('Enlace generado:', enlaceCompartir);
    
    return enlaceCompartir;
    
  } catch (error) {
    console.error('Error al crear enlace de compartir:', error);
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
    console.log('Iniciando compartir trabajo:', { userId, trabajo: trabajo?.nombre });
    
    // Generar enlace de compartir
    const enlace = await crearEnlaceCompartir(userId, trabajo);
    
    // Texto para compartir (mensaje + enlace)
    const mensaje = `¡Te comparto los detalles de mi trabajo "${trabajo.nombre}"!`;
    const textoCompartir = `${mensaje}\n\nVisita este enlace para más información:\n${enlace}`;
    
    // Verificar si el navegador soporta Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Trabajo: ${trabajo.nombre}`,
          text: mensaje,
          url: enlace
        });
        console.log('Compartido exitosamente con Web Share API');
        return true;
      } catch (error) {
        // Si el usuario cancela o hay un error, usar fallback
        if (error.name !== 'AbortError') {
          console.log('Error en Web Share API, usando fallback:', error);
          return await copiarAlPortapapeles(textoCompartir);
        }
        // Si el usuario canceló, no hacer nada más
        console.log('Usuario canceló el compartir');
        return false;
      }
    } else {
      // Fallback para navegadores que no soportan Web Share API
      console.log('Web Share API no disponible, usando fallback');
      return await copiarAlPortapapeles(textoCompartir);
    }
  } catch (error) {
    console.error('Error al compartir trabajo:', error);
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
    console.error('Error al obtener trabajo compartido:', error);
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
    console.error('Error al aceptar trabajo compartido:', error);
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
        console.log('Enlace copiado al portapapeles');
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
        console.log('Enlace copiado al portapapeles (fallback)');
      }
      
      return resultado;
    }
  } catch (error) {
    console.error('Error al copiar al portapapeles:', error);
    return false;
  }
};