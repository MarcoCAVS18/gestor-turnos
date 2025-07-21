// src/components/forms/TurnoForm/index.jsx

import React, ***REMOVED*** useState, useEffect, useMemo ***REMOVED*** from 'react';
import ***REMOVED*** Calendar, Clock, Briefcase, AlertCircle ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ThemeInput from '../../ui/ThemeInput';
import Button from '../../ui/Button';

const TurnoForm = (***REMOVED*** 
  turno, 
  trabajoId, 
  trabajos, 
  onSubmit, 
  onCancel, 
  onTrabajoChange,
  isMobile,
  loading,
  fechaInicial 
***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors ***REMOVED*** = useApp();
  
  const [formData, setFormData] = useState(***REMOVED***
    fecha: '',
    horaInicio: '',
    horaFin: '',
    trabajoSeleccionado: trabajoId || '',
    notas: '',
  ***REMOVED***);
  
  const [error, setError] = useState('');

  const trabajosTradicionales = trabajos.filter(t => t.type !== 'delivery');

  const cruzaMedianoche = useMemo(() => ***REMOVED***
    if (!formData.horaInicio || !formData.horaFin) return false;
    const [hInicio] = formData.horaInicio.split(':').map(Number);
    const [hFin] = formData.horaFin.split(':').map(Number);
    return hFin <= hInicio;
  ***REMOVED***, [formData.horaInicio, formData.horaFin]);

  useEffect(() => ***REMOVED***
    if (turno) ***REMOVED***
      setFormData(***REMOVED***
        fecha: turno.fechaInicio || turno.fecha || '',
        horaInicio: turno.horaInicio || '',
        horaFin: turno.horaFin || '',
        trabajoSeleccionado: turno.trabajoId || '',
        notas: turno.notas || '',
      ***REMOVED***);
    ***REMOVED*** else if (fechaInicial) ***REMOVED***
      let fechaStr;
      if (fechaInicial instanceof Date) ***REMOVED***
        const year = fechaInicial.getFullYear();
        const month = String(fechaInicial.getMonth() + 1).padStart(2, '0');
        const day = String(fechaInicial.getDate()).padStart(2, '0');
        fechaStr = `$***REMOVED***year***REMOVED***-$***REMOVED***month***REMOVED***-$***REMOVED***day***REMOVED***`;
      ***REMOVED*** else ***REMOVED***
        fechaStr = fechaInicial;
      ***REMOVED***
      
      setFormData(prev => (***REMOVED***
        ...prev,
        fecha: fechaStr
      ***REMOVED***));
    ***REMOVED***
  ***REMOVED***, [turno, fechaInicial]);

  useEffect(() => ***REMOVED***
    if (trabajoId) ***REMOVED***
      setFormData(prev => (***REMOVED*** ...prev, trabajoSeleccionado: trabajoId ***REMOVED***));
    ***REMOVED***
  ***REMOVED***, [trabajoId]);

  const handleInputChange = (field, value) => ***REMOVED***
    setFormData(prev => (***REMOVED*** ...prev, [field]: value ***REMOVED***));
    setError('');
  ***REMOVED***;

  const handleTrabajoChange = (e) => ***REMOVED***
    const nuevoTrabajoId = e.target.value;
    handleInputChange('trabajoSeleccionado', nuevoTrabajoId);
    if (onTrabajoChange) ***REMOVED***
      onTrabajoChange(nuevoTrabajoId);
    ***REMOVED***
  ***REMOVED***;

  const validarFormulario = () => ***REMOVED***
    if (!formData.fecha || !formData.horaInicio || !formData.horaFin || !formData.trabajoSeleccionado) ***REMOVED***
      setError('Todos los campos con * son requeridos.');
      return false;
    ***REMOVED***
    return true;
  ***REMOVED***;

  const calcularHoras = () => ***REMOVED***
    if (!formData.horaInicio || !formData.horaFin) return "0.0";
    const [hI, mI] = formData.horaInicio.split(':').map(Number);
    const [hF, mF] = formData.horaFin.split(':').map(Number);
    let start = new Date(0, 0, 0, hI, mI, 0);
    let end = new Date(0, 0, 0, hF, mF, 0);
    if (cruzaMedianoche) ***REMOVED***
      end.setDate(end.getDate() + 1);
    ***REMOVED***
    let diff = end.getTime() - start.getTime();
    if (diff < 0) return "0.0";
    return (diff / (1000 * 60 * 60)).toFixed(1);
  ***REMOVED***;
  
  const manejarSubmit = async (e) => ***REMOVED***
    e.preventDefault();
    if (!validarFormulario()) return;

    // Cálculo correcto de fecha de fin para turnos nocturnos
    const fechaInicioObj = new Date(formData.fecha + 'T00:00:00');
    let fechaFinObj = new Date(fechaInicioObj);
    if (cruzaMedianoche) ***REMOVED***
      fechaFinObj.setDate(fechaFinObj.getDate() + 1);
    ***REMOVED***
    const fechaFinStr = fechaFinObj.toISOString().split('T')[0];

    const datosTurno = ***REMOVED***
      fechaInicio: formData.fecha,
      fechaFin: fechaFinStr,
      horaInicio: formData.horaInicio,
      horaFin: formData.horaFin,
      trabajoId: formData.trabajoSeleccionado,
      notas: formData.notas.trim(),
      cruzaMedianoche: cruzaMedianoche,
    ***REMOVED***;

    await onSubmit(datosTurno);
  ***REMOVED***;

  const trabajoSeleccionadoInfo = trabajosTradicionales.find(t => t.id === formData.trabajoSeleccionado);
  const horasTrabajadas = calcularHoras();

  return (
    <form onSubmit=***REMOVED***manejarSubmit***REMOVED*** className=***REMOVED***`space-y-6 $***REMOVED***isMobile ? 'mobile-form' : ''***REMOVED***`***REMOVED***>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Briefcase size=***REMOVED***16***REMOVED*** className="inline mr-2" />
          Trabajo *
        </label>
        <select 
          value=***REMOVED***formData.trabajoSeleccionado***REMOVED*** 
          onChange=***REMOVED***handleTrabajoChange***REMOVED*** 
          className=***REMOVED***`w-full border rounded-lg transition-colors $***REMOVED***isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'***REMOVED*** border-gray-300`***REMOVED*** 
          required 
          disabled=***REMOVED***!!turno || loading***REMOVED***
        >
          <option value="">Seleccionar trabajo</option>
          ***REMOVED***trabajosTradicionales.map(trabajo => (
            <option key=***REMOVED***trabajo.id***REMOVED*** value=***REMOVED***trabajo.id***REMOVED***>***REMOVED***trabajo.nombre***REMOVED***</option>
          ))***REMOVED***
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar size=***REMOVED***16***REMOVED*** className="inline mr-2" />
          Fecha de Inicio *
        </label>
        <ThemeInput 
          type="date" 
          value=***REMOVED***formData.fecha***REMOVED*** 
          onChange=***REMOVED***(e) => handleInputChange('fecha', e.target.value)***REMOVED*** 
          required 
          themeColor=***REMOVED***thematicColors?.base***REMOVED*** 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock size=***REMOVED***16***REMOVED*** className="inline mr-2" />
            Hora inicio *
          </label>
          <ThemeInput 
            type="time" 
            value=***REMOVED***formData.horaInicio***REMOVED*** 
            onChange=***REMOVED***(e) => handleInputChange('horaInicio', e.target.value)***REMOVED*** 
            required 
            themeColor=***REMOVED***thematicColors?.base***REMOVED*** 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock size=***REMOVED***16***REMOVED*** className="inline mr-2" />
            Hora fin *
          </label>
          <ThemeInput 
            type="time" 
            value=***REMOVED***formData.horaFin***REMOVED*** 
            onChange=***REMOVED***(e) => handleInputChange('horaFin', e.target.value)***REMOVED*** 
            required 
            themeColor=***REMOVED***thematicColors?.base***REMOVED*** 
          />
        </div>
      </div>
      
      ***REMOVED***cruzaMedianoche && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
          <AlertCircle size=***REMOVED***16***REMOVED*** className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-800">Turno Nocturno Detectado</p>
            <p className="text-blue-700 mt-1">
              Este turno finalizará el día siguiente: ***REMOVED***" "***REMOVED***
              ***REMOVED***/* Mostrar la fecha correcta */***REMOVED***
              ***REMOVED***formData.fecha && (() => ***REMOVED***
                const fechaInicio = new Date(formData.fecha + 'T00:00:00');
                const fechaFin = new Date(fechaInicio);
                fechaFin.setDate(fechaFin.getDate() + 1);
                return fechaFin.toLocaleDateString('es-ES', ***REMOVED***
                  weekday: 'long',
                  day: 'numeric', 
                  month: 'long'
                ***REMOVED***);
              ***REMOVED***)()***REMOVED***
            </p>
          </div>
        </div>
      )***REMOVED***

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Notas (opcional)</label>
        <textarea 
          value=***REMOVED***formData.notas***REMOVED*** 
          onChange=***REMOVED***(e) => handleInputChange('notas', e.target.value)***REMOVED*** 
          placeholder="Agregar notas sobre el turno..." 
          rows=***REMOVED***isMobile ? 4 : 3***REMOVED*** 
          className=***REMOVED***`w-full border border-gray-300 rounded-lg transition-colors resize-none p-3 text-base`***REMOVED*** 
        />
      </div>

      ***REMOVED***error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">***REMOVED***error***REMOVED***</p>
        </div>
      )***REMOVED***

      <div className=***REMOVED***`flex pt-4 $***REMOVED***isMobile ? 'flex-col space-y-3' : 'gap-3'***REMOVED***`***REMOVED***>
        <Button 
          type="button" 
          onClick=***REMOVED***onCancel***REMOVED*** 
          variant="outline" 
          className=***REMOVED***isMobile ? 'w-full py-3' : 'flex-1'***REMOVED*** 
          disabled=***REMOVED***loading***REMOVED*** 
          themeColor=***REMOVED***thematicColors?.base***REMOVED***
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className=***REMOVED***isMobile ? 'w-full py-3' : 'flex-1'***REMOVED*** 
          loading=***REMOVED***loading***REMOVED*** 
          themeColor=***REMOVED***thematicColors?.base***REMOVED***
        >
          ***REMOVED***turno ? 'Guardar Cambios' : 'Crear Turno'***REMOVED***
        </Button>
      </div>

      ***REMOVED***horasTrabajadas > 0 && trabajoSeleccionadoInfo && (
        <div 
          className=***REMOVED***`rounded-lg p-4 border-l-4 mt-2`***REMOVED*** 
          style=***REMOVED******REMOVED*** 
            borderLeftColor: trabajoSeleccionadoInfo.color || thematicColors?.base, 
            backgroundColor: `$***REMOVED***trabajoSeleccionadoInfo.color || thematicColors?.base***REMOVED***1A` 
          ***REMOVED******REMOVED***
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style=***REMOVED******REMOVED*** backgroundColor: trabajoSeleccionadoInfo.color || thematicColors?.base ***REMOVED******REMOVED*** 
              />
              <span className="text-sm font-medium text-gray-700">***REMOVED***trabajoSeleccionadoInfo.nombre***REMOVED***</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Duración:</span>
              <span className="font-medium">
                ***REMOVED***horasTrabajadas***REMOVED*** horas
                ***REMOVED***cruzaMedianoche && <span className="text-purple-600 ml-1">(nocturno)</span>***REMOVED***
              </span>
            </div>
            ***REMOVED***trabajoSeleccionadoInfo.tarifaBase && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Ganancia estimada:</span>
                <span style=***REMOVED******REMOVED*** color: trabajoSeleccionadoInfo.color || thematicColors?.base ***REMOVED******REMOVED***>
                  $***REMOVED***(Number(horasTrabajadas) * trabajoSeleccionadoInfo.tarifaBase).toFixed(2)***REMOVED***
                </span>
              </div>
            )***REMOVED***
          </div>
        </div>
      )***REMOVED***
    </form>
  );
***REMOVED***;

export default TurnoForm;