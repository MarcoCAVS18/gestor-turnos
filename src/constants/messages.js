// src/constants/messages.js
export const SUCCESS_MESSAGES = {
  TRABAJO_CREADO: 'Trabajo creado exitosamente',
  TRABAJO_ACTUALIZADO: 'Trabajo actualizado exitosamente',
  TRABAJO_ELIMINADO: 'Trabajo eliminado exitosamente',
  TURNO_CREADO: 'Turno creado exitosamente',
  TURNO_ACTUALIZADO: 'Turno actualizado exitosamente',
  TURNO_ELIMINADO: 'Turno eliminado exitosamente',
  CONFIGURACION_GUARDADA: 'Configuración guardada exitosamente',
  TRABAJO_COMPARTIDO: 'Trabajo compartido exitosamente'
};

export const ERROR_MESSAGES = {
  GENERIC: 'Ha ocurrido un error inesperado',
  NETWORK: 'Error de conexión. Verifica tu conexión a internet',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción',
  VALIDATION: 'Por favor revisa los datos ingresados',
  TRABAJO_NO_ENCONTRADO: 'Trabajo no encontrado',
  TURNO_NO_ENCONTRADO: 'Turno no encontrado',
  ERROR_COMPARTIR: 'Error al compartir trabajo',
  ERROR_ELIMINAR: 'Error al eliminar elemento'
};

export const CONFIRMATION_MESSAGES = {
  ELIMINAR_TRABAJO: '¿Estás seguro de que deseas eliminar este trabajo?',
  ELIMINAR_TURNO: '¿Estás seguro de que deseas eliminar este turno?',
  CERRAR_SESION: '¿Deseas cerrar sesión?',
  CANCELAR_CAMBIOS: '¿Deseas cancelar los cambios sin guardar?'
};