// src/components/forms/TurnoDeliveryForm/index.jsx

import React, ***REMOVED*** useState, useEffect, useMemo ***REMOVED*** from 'react';
import ***REMOVED*** Calendar, Clock, Package, Car, DollarSign, TrendingUp, AlertCircle ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ThemeInput from '../../ui/ThemeInput';
import Button from '../../ui/Button';

const TurnoDeliveryForm = (***REMOVED*** 
  turno, 
  trabajoId, 
  trabajos, 
  onSubmit, 
  onCancel, 
  onTrabajoChange,
  thematicColors,
  isMobile,
  loading,
  fechaInicial
***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors: contextColors ***REMOVED*** = useApp();
  const coloresTemáticos = thematicColors || contextColors;
  
  // Estados del formulario
  const [formData, setFormData] = useState(***REMOVED***
    fecha: '',
    horaInicio: '',
    horaFin: '',
    trabajoSeleccionado: trabajoId || '',
    numeroPedidos: '',
    gananciaTotal: '',
    propinas: '',
    kilometros: '',
    gastoCombustible: '',
    notas: ''
  ***REMOVED***);
  
  const [error, setError] = useState('');

  // 🔥 CORRECCIÓN: Mostrar TODOS los trabajos disponibles, no solo delivery
  const trabajosParaSelector = trabajos; // Usar todos los trabajos que se pasan como prop

  // Detectar si el turno cruza medianoche
  const cruzaMedianoche = useMemo(() => ***REMOVED***
    if (!formData.horaInicio || !formData.horaFin) return false;
    const [hInicio] = formData.horaInicio.split(':').map(Number);
    const [hFin] = formData.horaFin.split(':').map(Number);
    return hFin <= hInicio;
  ***REMOVED***, [formData.horaInicio, formData.horaFin]);

  // Calcular fecha de fin automáticamente
  const fechaFin = useMemo(() => ***REMOVED***
    if (!formData.fecha || !cruzaMedianoche) return formData.fecha;
    
    const fechaInicio = new Date(formData.fecha + 'T00:00:00');
    const fechaFinCalculada = new Date(fechaInicio);
    fechaFinCalculada.setDate(fechaFinCalculada.getDate() + 1);
    
    return fechaFinCalculada.toISOString().split('T')[0];
  ***REMOVED***, [formData.fecha, cruzaMedianoche]);

  // Cargar datos si es edición
  useEffect(() => ***REMOVED***
    if (turno) ***REMOVED***
      setFormData(***REMOVED***
        fecha: turno.fechaInicio || turno.fecha || '',
        horaInicio: turno.horaInicio || '',
        horaFin: turno.horaFin || '',
        trabajoSeleccionado: turno.trabajoId || '',
        numeroPedidos: turno.numeroPedidos?.toString() || '',
        gananciaTotal: turno.gananciaTotal?.toString() || '',
        propinas: turno.propinas?.toString() || '',
        kilometros: turno.kilometros?.toString() || '',
        gastoCombustible: turno.gastoCombustible?.toString() || '',
        notas: turno.notas || ''
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

  // Mantener el trabajoId cuando se pasa como prop
  useEffect(() => ***REMOVED***
    if (trabajoId && trabajoId) ***REMOVED***
      setFormData(prev => (***REMOVED***
        ...prev,
        trabajoSeleccionado: trabajoId
      ***REMOVED***));
    ***REMOVED***
  ***REMOVED***, [trabajoId]);

  const handleInputChange = (field, value) => ***REMOVED***
    setFormData(prev => (***REMOVED***
      ...prev,
      [field]: value
    ***REMOVED***));
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
    if (!formData.fecha) ***REMOVED***
      setError('La fecha es requerida');
      return false;
    ***REMOVED***
    if (!formData.horaInicio || !formData.horaFin) ***REMOVED***
      setError('Las horas de inicio y fin son requeridas');
      return false;
    ***REMOVED***
    if (!formData.trabajoSeleccionado) ***REMOVED***
      setError('Debes seleccionar un trabajo');
      return false;
    ***REMOVED***
    if (!formData.gananciaTotal || isNaN(Number(formData.gananciaTotal))) ***REMOVED***
      setError('La ganancia total debe ser un número válido');
      return false;
    ***REMOVED***
    
    return true;
  ***REMOVED***;

  const manejarSubmit = async (e) => ***REMOVED***
    e.preventDefault();
    
    if (!validarFormulario()) return;

    // Crear datos del turno con fechas correctas
    const datosTurno = ***REMOVED***
      fecha: formData.fecha,
      fechaInicio: formData.fecha,
      fechaFin: fechaFin,
      horaInicio: formData.horaInicio,
      horaFin: formData.horaFin,
      trabajoId: formData.trabajoSeleccionado,
      tipo: 'delivery',
      numeroPedidos: Number(formData.numeroPedidos) || 0,
      gananciaTotal: Number(formData.gananciaTotal) || 0,
      propinas: Number(formData.propinas) || 0,
      kilometros: Number(formData.kilometros) || 0,
      gastoCombustible: Number(formData.gastoCombustible) || 0,
      notas: formData.notas.trim(),
      cruzaMedianoche: cruzaMedianoche
    ***REMOVED***;

    await onSubmit(datosTurno);
  ***REMOVED***;

  // Determinar si mostrar advertencia
  const trabajoSeleccionadoInfo = trabajosParaSelector.find(t => t.id === formData.trabajoSeleccionado);
  const esTrabajoNoDelivery = trabajoSeleccionadoInfo && 
    trabajoSeleccionadoInfo.tipo !== 'delivery' && 
    trabajoSeleccionadoInfo.type !== 'delivery';

  return (
    <div className="modal-content">
      <form 
        onSubmit=***REMOVED***manejarSubmit***REMOVED*** 
        className=***REMOVED***`space-y-4 $***REMOVED***isMobile ? 'mobile-form' : ''***REMOVED***`***REMOVED***
      >
        ***REMOVED***/* Trabajo seleccionado */***REMOVED***
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Package size=***REMOVED***16***REMOVED*** className="inline mr-2" />
            Trabajo *
          </label>
          <select
            value=***REMOVED***formData.trabajoSeleccionado***REMOVED***
            onChange=***REMOVED***handleTrabajoChange***REMOVED***
            className="w-full border border-gray-300 rounded-lg p-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:border-transparent bg-white"
            style=***REMOVED******REMOVED*** 
              '--tw-ring-color': coloresTemáticos?.base || '#EC4899',
            ***REMOVED******REMOVED***
            required
          >
            <option value="">Seleccionar trabajo</option>
            ***REMOVED***trabajosParaSelector.map(trabajo => (
              <option key=***REMOVED***trabajo.id***REMOVED*** value=***REMOVED***trabajo.id***REMOVED***>
                ***REMOVED***trabajo.nombre***REMOVED***
                ***REMOVED***trabajo.tipo === 'delivery' || trabajo.type === 'delivery' 
                  ? ' (Delivery)' 
                  : ''***REMOVED***
              </option>
            ))***REMOVED***
          </select>
          
          ***REMOVED***/* Advertencia si se selecciona un trabajo no-delivery */***REMOVED***
          ***REMOVED***esTrabajoNoDelivery && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>Nota:</strong> Has seleccionado un trabajo tradicional. 
                Este turno se guardará como delivery con ganancias manuales.
              </p>
            </div>
          )***REMOVED***
          
          ***REMOVED***trabajosParaSelector.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">
              No hay trabajos disponibles. Crea uno primero.
            </p>
          )***REMOVED***
        </div>

        ***REMOVED***/* Fecha y horario - GRID CORREGIDO */***REMOVED***
        <div className="space-y-4">
          ***REMOVED***/* Fecha - ancho limitado */***REMOVED***
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size=***REMOVED***16***REMOVED*** className="inline mr-2" />
              Fecha de inicio *
            </label>
            <ThemeInput
              type="date"
              value=***REMOVED***formData.fecha***REMOVED***
              onChange=***REMOVED***(e) => handleInputChange('fecha', e.target.value)***REMOVED***
              className="w-full"
              required
              themeColor=***REMOVED***coloresTemáticos?.base***REMOVED***
            />
          </div>
          
          ***REMOVED***/* Horarios - mismo ancho que los inputs de pedidos/kilómetros */***REMOVED***
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock size=***REMOVED***16***REMOVED*** className="inline mr-2" />
                Hora inicio *
              </label>
              <ThemeInput
                type="time"
                value=***REMOVED***formData.horaInicio***REMOVED***
                onChange=***REMOVED***(e) => handleInputChange('horaInicio', e.target.value)***REMOVED***
                className="w-full"
                required
                themeColor=***REMOVED***coloresTemáticos?.base***REMOVED***
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
                className="w-full"
                required
                themeColor=***REMOVED***coloresTemáticos?.base***REMOVED***
              />
            </div>
          </div>

          ***REMOVED***/* Mostrar información del turno nocturno */***REMOVED***
          ***REMOVED***cruzaMedianoche && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
              <AlertCircle size=***REMOVED***16***REMOVED*** className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-800">Turno Nocturno Detectado</p>
                <p className="text-blue-700 mt-1">
                  Este turno finalizará el ***REMOVED***" "***REMOVED***
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
        </div>

        ***REMOVED***/* Información de pedidos - GRID CORREGIDO */***REMOVED***
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Información del turno</h3>
          
          ***REMOVED***/* Grid limitado para inputs numéricos pequeños */***REMOVED***
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package size=***REMOVED***16***REMOVED*** className="inline mr-2" />
                Número de pedidos
              </label>
              <ThemeInput
                type="number"
                value=***REMOVED***formData.numeroPedidos***REMOVED***
                onChange=***REMOVED***(e) => handleInputChange('numeroPedidos', e.target.value)***REMOVED***
                className="w-full"
                placeholder="0"
                min="0"
                themeColor=***REMOVED***coloresTemáticos?.base***REMOVED***
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Car size=***REMOVED***16***REMOVED*** className="inline mr-2" />
                Kilómetros recorridos
              </label>
              <ThemeInput
                type="number"
                value=***REMOVED***formData.kilometros***REMOVED***
                onChange=***REMOVED***(e) => handleInputChange('kilometros', e.target.value)***REMOVED***
                className="w-full"
                placeholder="0"
                min="0"
                step="0.1"
                themeColor=***REMOVED***coloresTemáticos?.base***REMOVED***
              />
            </div>
          </div>
        </div>

        ***REMOVED***/* Información financiera - GRID CORREGIDO */***REMOVED***
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Ganancias *</h3>
          
          ***REMOVED***/* Grid limitado para inputs de dinero */***REMOVED***
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign size=***REMOVED***16***REMOVED*** className="inline mr-2" />
                Ganancia total *
              </label>
              <ThemeInput
                type="number"
                value=***REMOVED***formData.gananciaTotal***REMOVED***
                onChange=***REMOVED***(e) => handleInputChange('gananciaTotal', e.target.value)***REMOVED***
                className="w-full"
                placeholder="0.00"
                step="0.01"
                required
                themeColor=***REMOVED***coloresTemáticos?.base***REMOVED***
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TrendingUp size=***REMOVED***16***REMOVED*** className="inline mr-2" />
                Propinas
              </label>
              <ThemeInput
                type="number"
                value=***REMOVED***formData.propinas***REMOVED***
                onChange=***REMOVED***(e) => handleInputChange('propinas', e.target.value)***REMOVED***
                className="w-full"
                placeholder="0.00"
                step="0.01"
                themeColor=***REMOVED***coloresTemáticos?.base***REMOVED***
              />
            </div>
          </div>
          
          ***REMOVED***/* Gasto combustible - ancho limitado */***REMOVED***
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gasto en combustible
            </label>
            <ThemeInput
              type="number"
              value=***REMOVED***formData.gastoCombustible***REMOVED***
              onChange=***REMOVED***(e) => handleInputChange('gastoCombustible', e.target.value)***REMOVED***
              className="w-full"
              placeholder="0.00"
              step="0.01"
              themeColor=***REMOVED***coloresTemáticos?.base***REMOVED***
            />
          </div>
        </div>

        ***REMOVED***/* Notas */***REMOVED***
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas (opcional)
          </label>
          <textarea
            value=***REMOVED***formData.notas***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('notas', e.target.value)***REMOVED***
            placeholder="ej: Día lluvioso, mucha demanda..."
            rows=***REMOVED***3***REMOVED***
            className="w-full border border-gray-300 rounded-lg p-3 text-sm transition-colors resize-none bg-white focus:outline-none focus:ring-2 focus:border-transparent"
            style=***REMOVED******REMOVED***
              '--tw-ring-color': coloresTemáticos?.base || '#EC4899'
            ***REMOVED******REMOVED***
          />
        </div>

        ***REMOVED***/* Mensajes de error */***REMOVED***
        ***REMOVED***error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">***REMOVED***error***REMOVED***</p>
          </div>
        )***REMOVED***

        ***REMOVED***/* Botones */***REMOVED***
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick=***REMOVED***onCancel***REMOVED***
            variant="outline"
            className="flex-1"
            disabled=***REMOVED***loading***REMOVED***
            themeColor=***REMOVED***coloresTemáticos?.base***REMOVED***
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="flex-1"
            loading=***REMOVED***loading***REMOVED***
            themeColor=***REMOVED***coloresTemáticos?.base***REMOVED***
          >
            ***REMOVED***turno ? 'Guardar Cambios' : 'Crear Turno'***REMOVED***
          </Button>
        </div>

        ***REMOVED***/* Vista previa de ganancias */***REMOVED***
        ***REMOVED***formData.gananciaTotal && (
          <div 
            className="rounded-lg p-4 border-l-4 mt-4"
            style=***REMOVED******REMOVED*** 
              borderLeftColor: coloresTemáticos?.base || '#EC4899',
              backgroundColor: `$***REMOVED***coloresTemáticos?.base || '#EC4899'***REMOVED***10`
            ***REMOVED******REMOVED***
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Ganancia bruta:</span>
                <span className="font-medium">$***REMOVED***formData.gananciaTotal***REMOVED***</span>
              </div>
              ***REMOVED***formData.gastoCombustible && (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Gasto combustible:</span>
                    <span className="text-red-600">-$***REMOVED***formData.gastoCombustible***REMOVED***</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-medium border-t pt-2">
                    <span>Ganancia neta:</span>
                    <span style=***REMOVED******REMOVED*** color: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED***>
                      $***REMOVED***(Number(formData.gananciaTotal) - Number(formData.gastoCombustible || 0)).toFixed(2)***REMOVED***
                    </span>
                  </div>
                </>
              )***REMOVED***
            </div>
          </div>
        )***REMOVED***
      </form>
    </div>
  );
***REMOVED***;

export default TurnoDeliveryForm;