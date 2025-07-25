// src/services/shareService.js

import ***REMOVED*** 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  addDoc,
  collection 
***REMOVED*** from 'firebase/firestore';
import ***REMOVED*** db ***REMOVED*** from './firebase';

/**
 * Genera un token único para compartir un trabajo
 * @returns ***REMOVED***string***REMOVED***
 */
const generarTokenCompartir = () => ***REMOVED***
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Date.now().toString(36);
***REMOVED***;

/**
 * Limpia y valida los datos del trabajo antes de compartir
 * @param ***REMOVED***Object***REMOVED*** trabajo - Datos del trabajo a compartir
 * @returns ***REMOVED***Object***REMOVED*** - Datos del trabajo limpios
 */
const limpiarDatosTrabajo = (trabajo) => ***REMOVED***
  const datosLimpios = ***REMOVED******REMOVED***;
  
  // Campos obligatorios con valores por defecto
  datosLimpios.nombre = trabajo.nombre || 'Trabajo sin nombre';
  datosLimpios.descripcion = trabajo.descripcion || '';
  datosLimpios.color = trabajo.color || '#EC4899'; // Color por defecto
  
  // Para trabajos tradicionales - incluir tarifa base
  if (trabajo.tarifaBase !== undefined && trabajo.tarifaBase !== null) ***REMOVED***
    datosLimpios.tarifaBase = trabajo.tarifaBase;
  ***REMOVED***
  
  // Para trabajos tradicionales - incluir TODAS las tarifas especiales
  if (trabajo.tarifas && typeof trabajo.tarifas === 'object') ***REMOVED***
    datosLimpios.tarifas = ***REMOVED******REMOVED***;
    
    // ✅ Incluir TODAS las tarifas, no importa si son iguales a la tarifa base
    if (trabajo.tarifas.diurno !== undefined && trabajo.tarifas.diurno !== null) ***REMOVED***
      datosLimpios.tarifas.diurno = trabajo.tarifas.diurno;
    ***REMOVED***
    if (trabajo.tarifas.tarde !== undefined && trabajo.tarifas.tarde !== null) ***REMOVED***
      datosLimpios.tarifas.tarde = trabajo.tarifas.tarde;
    ***REMOVED***
    if (trabajo.tarifas.noche !== undefined && trabajo.tarifas.noche !== null) ***REMOVED***
      datosLimpios.tarifas.noche = trabajo.tarifas.noche;
    ***REMOVED***
    if (trabajo.tarifas.sabado !== undefined && trabajo.tarifas.sabado !== null) ***REMOVED***
      datosLimpios.tarifas.sabado = trabajo.tarifas.sabado;
    ***REMOVED***
    if (trabajo.tarifas.domingo !== undefined && trabajo.tarifas.domingo !== null) ***REMOVED***
      datosLimpios.tarifas.domingo = trabajo.tarifas.domingo;
    ***REMOVED***
    
    // Si no hay tarifas válidas, eliminar el objeto tarifas
    if (Object.keys(datosLimpios.tarifas).length === 0) ***REMOVED***
      delete datosLimpios.tarifas;
    ***REMOVED***
  ***REMOVED***
  
  // Para trabajos de delivery
  if (trabajo.tipo === 'delivery') ***REMOVED***
    datosLimpios.tipo = 'delivery';
    
    // Incluir plataforma si existe
    if (trabajo.plataforma) ***REMOVED***
      datosLimpios.plataforma = trabajo.plataforma;
    ***REMOVED***
    
    // ✅ Incluir vehículo - IMPORTANTE para la preview
    if (trabajo.vehiculo) ***REMOVED***
      datosLimpios.vehiculo = trabajo.vehiculo;
    ***REMOVED***
    
    // Para delivery, usar colorAvatar si existe, sino usar color normal
    if (trabajo.colorAvatar) ***REMOVED***
      datosLimpios.color = trabajo.colorAvatar;
    ***REMOVED***
    
    // Incluir configuración de delivery si existe
    if (trabajo.configuracion) ***REMOVED***
      datosLimpios.configuracion = trabajo.configuracion;
    ***REMOVED***
  ***REMOVED***
    return datosLimpios;
***REMOVED***;

/**
 * Crea un enlace para compartir un trabajo directamente por correo o mensajería
 * @param ***REMOVED***string***REMOVED*** userId - ID del usuario que comparte
 * @param ***REMOVED***Object***REMOVED*** trabajo - Datos del trabajo a compartir
 * @returns ***REMOVED***Promise<string>***REMOVED*** - URL del enlace de compartir
 */
export const crearEnlaceCompartir = async (userId, trabajo) => ***REMOVED***
  try ***REMOVED***    
    const token = generarTokenCompartir();
    
    // Limpiar datos del trabajo para evitar undefined
    const trabajoLimpio = limpiarDatosTrabajo(trabajo);
        
    // Crear documento temporal en Firestore con los datos del trabajo
    const shareDocRef = doc(db, 'trabajos_compartidos', token);
    
    const datosCompartir = ***REMOVED***
      // Datos del trabajo limpios (sin valores undefined)
      trabajoData: trabajoLimpio,
      // Metadatos de compartir
      compartidoPor: userId,
      fechaCreacion: serverTimestamp(),
      fechaExpiracion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      activo: true,
      vecesUsado: 0,
      limiteUsos: 10
    ***REMOVED***;
        
    await setDoc(shareDocRef, datosCompartir);
    
    // Generar URL completa
    const baseUrl = window.location.origin || 'https://gestortrabajo.netlify.app';
    const enlaceCompartir = `$***REMOVED***baseUrl***REMOVED***/compartir/$***REMOVED***token***REMOVED***`;
    
    return enlaceCompartir;
    
  ***REMOVED*** catch (error) ***REMOVED***
    throw new Error('No se pudo crear el enlace de compartir');
  ***REMOVED***
***REMOVED***;

/**
 * Función para compartir trabajo utilizando las API nativas de dispositivos móviles
 * @param ***REMOVED***string***REMOVED*** userId - ID del usuario que comparte
 * @param ***REMOVED***Object***REMOVED*** trabajo - Datos del trabajo a compartir
 */
export const compartirTrabajoNativo = async (userId, trabajo) => ***REMOVED***
  try ***REMOVED***
    
    // Generar enlace de compartir
    const enlace = await crearEnlaceCompartir(userId, trabajo);
    
    // Texto para compartir personalizado según el tipo
    let mensaje;
    if (trabajo.tipo === 'delivery') ***REMOVED***
      mensaje = `¡Te comparto los detalles de mi trabajo de delivery "$***REMOVED***trabajo.nombre***REMOVED***"!`;
      if (trabajo.plataforma) ***REMOVED***
        mensaje += ` Es para $***REMOVED***trabajo.plataforma***REMOVED***`;
      ***REMOVED***
      if (trabajo.vehiculo) ***REMOVED***
        mensaje += ` usando $***REMOVED***trabajo.vehiculo***REMOVED***`;
      ***REMOVED***
    ***REMOVED*** else ***REMOVED***
      mensaje = `¡Te comparto los detalles de mi trabajo "$***REMOVED***trabajo.nombre***REMOVED***"!`;
      if (trabajo.tarifaBase) ***REMOVED***
        mensaje += ` Con tarifa base de $$***REMOVED***trabajo.tarifaBase***REMOVED***/hora`;
      ***REMOVED***
    ***REMOVED***
    
    const textoCompartir = `$***REMOVED***mensaje***REMOVED***\n\nVisita este enlace para más información:\n$***REMOVED***enlace***REMOVED***`;
    
    // Verificar si el navegador soporta Web Share API
    if (navigator.share) ***REMOVED***
      try ***REMOVED***
        await navigator.share(***REMOVED***
          title: `Trabajo: $***REMOVED***trabajo.nombre***REMOVED***`,
          text: mensaje,
          url: enlace
        ***REMOVED***);
        return true;
      ***REMOVED*** catch (error) ***REMOVED***
        // Si el usuario cancela o hay un error, usar fallback
        if (error.name !== 'AbortError') ***REMOVED***
          return await copiarAlPortapapeles(textoCompartir);
        ***REMOVED***
        // Si el usuario canceló, no hacer nada más
        return false;
      ***REMOVED***
    ***REMOVED*** else ***REMOVED***
      // Fallback para navegadores que no soportan Web Share API
      return await copiarAlPortapapeles(textoCompartir);
    ***REMOVED***
  ***REMOVED*** catch (error) ***REMOVED***
    throw error;
  ***REMOVED***
***REMOVED***;

/**
 * Obtiene los datos de un trabajo compartido usando el token
 * @param ***REMOVED***string***REMOVED*** token - Token del enlace compartido
 * @returns ***REMOVED***Promise<Object|null>***REMOVED*** - Datos del trabajo compartido o null si no existe/expiró
 */
export const obtenerTrabajoCompartido = async (token) => ***REMOVED***
  try ***REMOVED***
    
    const shareDocRef = doc(db, 'trabajos_compartidos', token);
    const shareDoc = await getDoc(shareDocRef);
    
    if (!shareDoc.exists()) ***REMOVED***
      throw new Error('El enlace de compartir no existe o ha expirado');
    ***REMOVED***
    
    const datos = shareDoc.data();
    
    // Verificar si el enlace sigue activo
    if (!datos.activo) ***REMOVED***
      throw new Error('Este enlace de compartir ya no está activo');
    ***REMOVED***
    
    // Verificar si ha expirado
    const ahora = new Date();
    const fechaExpiracion = datos.fechaExpiracion.toDate();
    
    if (ahora > fechaExpiracion) ***REMOVED***
      // Marcar como inactivo
      await setDoc(shareDocRef, ***REMOVED*** ...datos, activo: false ***REMOVED***, ***REMOVED*** merge: true ***REMOVED***);
      throw new Error('Este enlace de compartir ha expirado');
    ***REMOVED***
    
    // Verificar límite de usos
    if (datos.vecesUsado >= datos.limiteUsos) ***REMOVED***
      await setDoc(shareDocRef, ***REMOVED*** ...datos, activo: false ***REMOVED***, ***REMOVED*** merge: true ***REMOVED***);
      throw new Error('Este enlace de compartir ha alcanzado su límite de usos');
    ***REMOVED***
    
    
    return ***REMOVED***
      trabajoData: datos.trabajoData,
      token: token,
      compartidoPor: datos.compartidoPor,
      vecesUsado: datos.vecesUsado
    ***REMOVED***;
    
  ***REMOVED*** catch (error) ***REMOVED***
    throw error;
  ***REMOVED***
***REMOVED***;

/**
 * Acepta un trabajo compartido y lo agrega al perfil del usuario
 * @param ***REMOVED***string***REMOVED*** userId - ID del usuario que acepta
 * @param ***REMOVED***string***REMOVED*** token - Token del enlace compartido
 * @returns ***REMOVED***Promise<Object>***REMOVED*** - Datos del trabajo agregado
 */
export const aceptarTrabajoCompartido = async (userId, token) => ***REMOVED***
  try ***REMOVED***
    
    const shareDocRef = doc(db, 'trabajos_compartidos', token);
    const shareDoc = await getDoc(shareDocRef);
    
    if (!shareDoc.exists()) ***REMOVED***
      throw new Error('El enlace de compartir no existe');
    ***REMOVED***
    
    const datos = shareDoc.data();
    
    // Verificar que el usuario no sea el mismo que compartió
    if (datos.compartidoPor === userId) ***REMOVED***
      throw new Error('No puedes agregar tu propio trabajo compartido');
    ***REMOVED***
    
    // Determinar la colección correcta según el tipo
    const esDelivery = datos.trabajoData.tipo === 'delivery';
    const collectionName = esDelivery ? 'trabajos-delivery' : 'trabajos';
    const userTrabajosRef = collection(db, 'usuarios', userId, collectionName);
    
    const nuevoTrabajo = ***REMOVED***
      ...datos.trabajoData,
      fechaCreacion: serverTimestamp(),
      fechaActualizacion: serverTimestamp(),
      origen: 'compartido',
      tokenOrigen: token
    ***REMOVED***;
        
    const docRef = await addDoc(userTrabajosRef, nuevoTrabajo);
    
    // Incrementar contador de usos
    await setDoc(shareDocRef, ***REMOVED***
      ...datos,
      vecesUsado: datos.vecesUsado + 1
    ***REMOVED***, ***REMOVED*** merge: true ***REMOVED***);
    
    
    return ***REMOVED***
      id: docRef.id,
      ...nuevoTrabajo
    ***REMOVED***;
    
  ***REMOVED*** catch (error) ***REMOVED***
    throw error;
  ***REMOVED***
***REMOVED***;

/**
 * Copia un texto al portapapeles y muestra una notificación
 * @param ***REMOVED***string***REMOVED*** texto - Texto a copiar
 * @returns ***REMOVED***Promise<boolean>***REMOVED*** - true si se copió exitosamente
 */
export const copiarAlPortapapeles = async (texto) => ***REMOVED***
  try ***REMOVED***
    if (navigator.clipboard && window.isSecureContext) ***REMOVED***
      // Usar la API moderna de clipboard
      await navigator.clipboard.writeText(texto);
      
      // Mostrar notificación visual opcional
      if (window.showToast) ***REMOVED***
        window.showToast('Enlace copiado al portapapeles');
      ***REMOVED*** else ***REMOVED***
      ***REMOVED***
      
      return true;
    ***REMOVED*** else ***REMOVED***
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
      
      if (resultado) ***REMOVED***
      ***REMOVED***
      
      return resultado;
    ***REMOVED***
  ***REMOVED*** catch (error) ***REMOVED***
    return false;
  ***REMOVED***
***REMOVED***;