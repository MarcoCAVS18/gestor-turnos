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
 * Crea un enlace para compartir un trabajo directamente por correo o mensajería
 * @param {string} userId - ID del usuario que comparte
 * @param {Object} trabajo - Datos del trabajo a compartir
 * @returns {Promise<string>} - URL del enlace de compartir
 */
export const crearEnlaceCompartir = async (userId, trabajo) => {
  try {
    const token = generarTokenCompartir();
    
    // Crear documento temporal en Firestore con los datos del trabajo
    const shareDocRef = doc(db, 'trabajos_compartidos', token);
    
    const datosCompartir = {
      // Datos del trabajo (sin ID ni metadatos del usuario original)
      trabajoData: {
        nombre: trabajo.nombre,
        descripcion: trabajo.descripcion || '',
        color: trabajo.color,
        tarifaBase: trabajo.tarifaBase,
        tarifas: trabajo.tarifas
      },
      // Metadatos de compartir
      compartidoPor: userId,
      fechaCreacion: serverTimestamp(),
      fechaExpiracion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      activo: true,
      vecesUsado: 0,
      limiteUsos: 10 // Límite de veces que se puede usar el enlace
    };
    
    await setDoc(shareDocRef, datosCompartir);
    
    // Generar URL completa
    const baseUrl = 'https://gestortrabajo.netlify.app';
    const enlaceCompartir = `${baseUrl}/compartir/${token}`;

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
          console.log('Web Share API falló, usando fallback:', error);
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
    
    // Agregar el trabajo a la subcolección del usuario
    const userTrabajosRef = collection(db, 'usuarios', userId, 'trabajos');
    
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
        console.log('Texto copiado al portapapeles');
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
        console.log('Texto copiado al portapapeles (fallback)');
      }
      
      return resultado;
    }
  } catch (error) {
    console.error('Error al copiar al portapapeles:', error);
    return false;
  }
};