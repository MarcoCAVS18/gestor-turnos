// src/components/ModalTurno.jsx - TIPO CALCULADO AUTOMÁTICAMENTE

import React, ***REMOVED*** useState, useEffect, useCallback ***REMOVED*** from 'react';
import ***REMOVED*** X, Clock, Calendar, MapPin, FileText ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import DynamicButton from './DynamicButton';

const ModalTurno = (***REMOVED*** visible, onClose, turnoSeleccionado ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** trabajos, agregarTurno, editarTurno, coloresTemáticos, rangosTurnos ***REMOVED*** = useApp();
  
  // Estados del formulario
  const [formData, setFormData] = useState(***REMOVED***
    trabajoId: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    notas: ''
  ***REMOVED***);
  
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [tipoCalculado, setTipoCalculado] = useState('');

  // Función para calcular el tipo de turno automáticamente
  const calcularTipoTurno = useCallback((horaInicio, fecha) => ***REMOVED***
    if (!horaInicio || !fecha) return '';
    
    // Verificar si es fin de semana
    const fechaObj = new Date(fecha + 'T00:00:00');
    const diaSemana = fechaObj.getDay();
    
    if (diaSemana === 0) return 'domingo';
    if (diaSemana === 6) return 'sabado';
    
    // Convertir hora a número para comparar
    const [hora, minuto] = horaInicio.split(':').map(Number);
    const horaEnMinutos = hora * 60 + minuto;
    
    const rangos = rangosTurnos || ***REMOVED***
      diurnoInicio: 6, diurnoFin: 14,
      tardeInicio: 14, tardeFin: 20,
      nocheInicio: 20
    ***REMOVED***;
    
    const diurnoInicioMin = rangos.diurnoInicio * 60;
    const diurnoFinMin = rangos.diurnoFin * 60;
    const tardeInicioMin = rangos.tardeInicio * 60;
    const tardeFinMin = rangos.tardeFin * 60;
    
    if (horaEnMinutos >= diurnoInicioMin && horaEnMinutos < diurnoFinMin) ***REMOVED***
      return 'diurno';
    ***REMOVED*** else if (horaEnMinutos >= tardeInicioMin && horaEnMinutos < tardeFinMin) ***REMOVED***
      return 'tarde';
    ***REMOVED*** else ***REMOVED***
      return 'noche';
    ***REMOVED***
  ***REMOVED***, [rangosTurnos]);

  // Efecto para cargar datos del turno seleccionado
  useEffect(() => ***REMOVED***
    if (turnoSeleccionado) ***REMOVED***
      setFormData(***REMOVED***
        trabajoId: turnoSeleccionado.trabajoId || '',
        fecha: turnoSeleccionado.fecha || '',
        horaInicio: turnoSeleccionado.horaInicio || '',
        horaFin: turnoSeleccionado.horaFin || '',
        notas: turnoSeleccionado.notas || ''
      ***REMOVED***);
      
      // Calcular tipo basado en los datos existentes
      const tipo = calcularTipoTurno(turnoSeleccionado.horaInicio, turnoSeleccionado.fecha);
      setTipoCalculado(tipo);
    ***REMOVED*** else ***REMOVED***
      // Resetear formulario para nuevo turno
      setFormData(***REMOVED***
        trabajoId: '',
        fecha: '',
        horaInicio: '',
        horaFin: '',
        notas: ''
      ***REMOVED***);
      setTipoCalculado('');
    ***REMOVED***
    setError('');
  ***REMOVED***, [turnoSeleccionado, visible, calcularTipoTurno]);

  // Efecto para recalcular tipo cuando cambian hora o fecha
  useEffect(() => ***REMOVED***
    const tipo = calcularTipoTurno(formData.horaInicio, formData.fecha);
    setTipoCalculado(tipo);
  ***REMOVED***, [formData.horaInicio, formData.fecha, calcularTipoTurno]);

  // Manejar cambios en inputs
  const handleInputChange = (field, value) => ***REMOVED***
    setFormData(prev => (***REMOVED***
      ...prev,
      [field]: value
    ***REMOVED***));
    setError('');
  ***REMOVED***;

  // Validar formulario
  const validarFormulario = () => ***REMOVED***
    if (!formData.trabajoId.trim()) ***REMOVED***
      setError('Selecciona un trabajo');
      return false;
    ***REMOVED***
    if (!formData.fecha) ***REMOVED***
      setError('Selecciona una fecha');
      return false;
    ***REMOVED***
    if (!formData.horaInicio) ***REMOVED***
      setError('Ingresa la hora de inicio');
      return false;
    ***REMOVED***
    if (!formData.horaFin) ***REMOVED***
      setError('Ingresa la hora de fin');
      return false;
    ***REMOVED***
    
    // Validar que la hora de fin sea después de la hora de inicio (considerando turnos nocturnos)
    const [horaIni, minIni] = formData.horaInicio.split(':').map(Number);
    const [horaFin, minFin] = formData.horaFin.split(':').map(Number);
    
    const inicioMinutos = horaIni * 60 + minIni;
    let finMinutos = horaFin * 60 + minFin;
    
    // Si el turno cruza medianoche, está bien
    if (finMinutos <= inicioMinutos) ***REMOVED***
      // Solo validar que no sean exactamente iguales
      if (finMinutos === inicioMinutos) ***REMOVED***
        setError('La hora de fin debe ser diferente a la hora de inicio');
        return false;
      ***REMOVED***
    ***REMOVED***
    
    return true;
  ***REMOVED***;

  // Manejar envío del formulario
  const handleSubmit = async (e) => ***REMOVED***
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    setCargando(true);
    setError('');
    
    try ***REMOVED***
      const datosCompletos = ***REMOVED***
        ...formData,
        tipo: tipoCalculado // Agregar el tipo calculado automáticamente
      ***REMOVED***;
      
      if (turnoSeleccionado) ***REMOVED***
        await editarTurno(turnoSeleccionado.id, datosCompletos);
      ***REMOVED*** else ***REMOVED***
        await agregarTurno(datosCompletos);
      ***REMOVED***
      
      onClose();
    ***REMOVED*** catch (err) ***REMOVED***
      setError(err.message || 'Error al guardar el turno');
    ***REMOVED*** finally ***REMOVED***
      setCargando(false);
    ***REMOVED***
  ***REMOVED***;

  // Obtener nombre del tipo para mostrar
  const obtenerNombreTipo = (tipo) => ***REMOVED***
    const nombres = ***REMOVED***
      'diurno': 'Diurno',
      'tarde': 'Tarde', 
      'noche': 'Nocturno',
      'sabado': 'Sábado',
      'domingo': 'Domingo'
    ***REMOVED***;
    return nombres[tipo] || tipo;
  ***REMOVED***;

  // Obtener color del tipo
  const obtenerColorTipo = (tipo) => ***REMOVED***
    const colores = ***REMOVED***
      'diurno': '#10B981',    // Verde
      'tarde': '#F59E0B',     // Amarillo
      'noche': '#6366F1',     // Índigo
      'sabado': '#8B5CF6',    // Violeta
      'domingo': '#EF4444'    // Rojo
    ***REMOVED***;
    return colores[tipo] || '#6B7280';
  ***REMOVED***;

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-xl border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              ***REMOVED***turnoSeleccionado ? 'Editar Turno' : 'Nuevo Turno'***REMOVED***
            </h2>
            <button
              onClick=***REMOVED***onClose***REMOVED***
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size=***REMOVED***24***REMOVED*** />
            </button>
          </div>
        </div>

        <form onSubmit=***REMOVED***handleSubmit***REMOVED*** className="p-6 space-y-6">
          ***REMOVED***/* Selección de trabajo */***REMOVED***
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trabajo *
            </label>
            <select
              value=***REMOVED***formData.trabajoId***REMOVED***
              onChange=***REMOVED***(e) => handleInputChange('trabajoId', e.target.value)***REMOVED***
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors"
              style=***REMOVED******REMOVED*** 
                focusRingColor: coloresTemáticos?.base || '#EC4899',
                borderColor: formData.trabajoId ? coloresTemáticos?.base || '#EC4899' : undefined
              ***REMOVED******REMOVED***
              required
            >
              <option value="">Selecciona un trabajo</option>
              ***REMOVED***trabajos.map(trabajo => (
                <option key=***REMOVED***trabajo.id***REMOVED*** value=***REMOVED***trabajo.id***REMOVED***>
                  ***REMOVED***trabajo.nombre***REMOVED***
                </option>
              ))***REMOVED***
            </select>
          </div>

          ***REMOVED***/* Fecha */***REMOVED***
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size=***REMOVED***16***REMOVED*** className="inline mr-2" />
              Fecha *
            </label>
            <input
              type="date"
              value=***REMOVED***formData.fecha***REMOVED***
              onChange=***REMOVED***(e) => handleInputChange('fecha', e.target.value)***REMOVED***
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors"
              style=***REMOVED******REMOVED*** 
                focusRingColor: coloresTemáticos?.base || '#EC4899',
                borderColor: formData.fecha ? coloresTemáticos?.base || '#EC4899' : undefined
              ***REMOVED******REMOVED***
              required
            />
          </div>

          ***REMOVED***/* Horarios */***REMOVED***
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock size=***REMOVED***16***REMOVED*** className="inline mr-2" />
                Hora Inicio *
              </label>
              <input
                type="time"
                value=***REMOVED***formData.horaInicio***REMOVED***
                onChange=***REMOVED***(e) => handleInputChange('horaInicio', e.target.value)***REMOVED***
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors"
                style=***REMOVED******REMOVED*** 
                  focusRingColor: coloresTemáticos?.base || '#EC4899',
                  borderColor: formData.horaInicio ? coloresTemáticos?.base || '#EC4899' : undefined
                ***REMOVED******REMOVED***
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock size=***REMOVED***16***REMOVED*** className="inline mr-2" />
                Hora Fin *
              </label>
              <input
                type="time"
                value=***REMOVED***formData.horaFin***REMOVED***
                onChange=***REMOVED***(e) => handleInputChange('horaFin', e.target.value)***REMOVED***
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors"
                style=***REMOVED******REMOVED*** 
                  focusRingColor: coloresTemáticos?.base || '#EC4899',
                  borderColor: formData.horaFin ? coloresTemáticos?.base || '#EC4899' : undefined
                ***REMOVED******REMOVED***
                required
              />
            </div>
          </div>

          ***REMOVED***/* Tipo calculado automáticamente */***REMOVED***
          ***REMOVED***tipoCalculado && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size=***REMOVED***16***REMOVED*** className="inline mr-2" />
                Tipo de Turno (Calculado automáticamente)
              </label>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div 
                  className="w-3 h-3 rounded-full mr-3"
                  style=***REMOVED******REMOVED*** backgroundColor: obtenerColorTipo(tipoCalculado) ***REMOVED******REMOVED***
                />
                <span className="font-medium text-gray-800">
                  ***REMOVED***obtenerNombreTipo(tipoCalculado)***REMOVED***
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  ***REMOVED***tipoCalculado === 'sabado' || tipoCalculado === 'domingo' 
                    ? '(Fin de semana)' 
                    : `($***REMOVED***formData.horaInicio ? formData.horaInicio : '--:--'***REMOVED***)`***REMOVED***
                </span>
              </div>
            </div>
          )***REMOVED***

          ***REMOVED***/* Notas */***REMOVED***
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText size=***REMOVED***16***REMOVED*** className="inline mr-2" />
              Notas (opcional)
            </label>
            <textarea
              value=***REMOVED***formData.notas***REMOVED***
              onChange=***REMOVED***(e) => handleInputChange('notas', e.target.value)***REMOVED***
              placeholder="Agrega notas adicionales sobre este turno..."
              rows=***REMOVED***3***REMOVED***
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors resize-none"
              style=***REMOVED******REMOVED*** 
                focusRingColor: coloresTemáticos?.base || '#EC4899',
                borderColor: formData.notas ? coloresTemáticos?.base || '#EC4899' : undefined
              ***REMOVED******REMOVED***
            />
          </div>

          ***REMOVED***/* Error */***REMOVED***
          ***REMOVED***error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">***REMOVED***error***REMOVED***</p>
            </div>
          )***REMOVED***

          ***REMOVED***/* Botones */***REMOVED***
          <div className="flex gap-3 pt-4">
            <DynamicButton
              type="button"
              onClick=***REMOVED***onClose***REMOVED***
              variant="outline"
              className="flex-1"
              disabled=***REMOVED***cargando***REMOVED***
            >
              Cancelar
            </DynamicButton>
            <DynamicButton
              type="submit"
              className="flex-1"
              disabled=***REMOVED***cargando***REMOVED***
            >
              ***REMOVED***cargando 
                ? (turnoSeleccionado ? 'Guardando...' : 'Creando...') 
                : (turnoSeleccionado ? 'Guardar Cambios' : 'Crear Turno')
              ***REMOVED***
            </DynamicButton>
          </div>
        </form>
      </div>
    </div>
  );
***REMOVED***;

export default ModalTurno;