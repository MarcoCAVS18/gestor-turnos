// src/components/forms/TurnoDeliveryForm/index.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** Calendar, Clock, Package, Car, DollarSign, TrendingUp ***REMOVED*** from 'lucide-react';
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
  loading 
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

  // CORRECCIÓN: Filtrar trabajos de delivery correctamente
  const trabajosDelivery = trabajos.filter(t => t.tipo === 'delivery' || t.type === 'delivery');
  
  // NUEVO: También incluir el trabajo seleccionado si no es de delivery pero ya está seleccionado
  const trabajosParaSelector = React.useMemo(() => ***REMOVED***
    // Si hay un trabajo seleccionado que no es de delivery, incluirlo
    const trabajoSeleccionadoActual = trabajos.find(t => t.id === formData.trabajoSeleccionado);
    
    if (trabajoSeleccionadoActual && trabajoSeleccionadoActual.tipo !== 'delivery' && trabajoSeleccionadoActual.type !== 'delivery') ***REMOVED***
      // Incluir el trabajo seleccionado aunque no sea de delivery
      return [...trabajosDelivery, trabajoSeleccionadoActual];
    ***REMOVED***
    
    return trabajosDelivery;
  ***REMOVED***, [trabajosDelivery, trabajos, formData.trabajoSeleccionado]);

  // Cargar datos si es edición
  useEffect(() => ***REMOVED***
    if (turno) ***REMOVED***
      setFormData(***REMOVED***
        fecha: turno.fecha || '',
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
    ***REMOVED***
  ***REMOVED***, [turno]);

  // CORRECCIÓN: Mantener el trabajoId cuando se pasa como prop
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
    setError(''); // Limpiar error al cambiar datos
  ***REMOVED***;

  const handleTrabajoChange = (e) => ***REMOVED***
    const nuevoTrabajoId = e.target.value;
    console.log('🔄 TurnoDeliveryForm: Cambiando trabajo a:', nuevoTrabajoId);
    handleInputChange('trabajoSeleccionado', nuevoTrabajoId);
    
    // Notificar al modal sobre el cambio
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
    
    // Validar que la hora de fin sea mayor que la de inicio
    const [horaI, minI] = formData.horaInicio.split(':').map(Number);
    const [horaF, minF] = formData.horaFin.split(':').map(Number);
    const minutosInicio = horaI * 60 + minI;
    const minutosFin = horaF * 60 + minF;
    
    if (minutosFin <= minutosInicio) ***REMOVED***
      setError('La hora de fin debe ser posterior a la hora de inicio');
      return false;
    ***REMOVED***
    
    return true;
  ***REMOVED***;

  const manejarSubmit = async (e) => ***REMOVED***
    e.preventDefault();
    
    if (!validarFormulario()) return;

    const datosTurno = ***REMOVED***
      fecha: formData.fecha,
      horaInicio: formData.horaInicio,
      horaFin: formData.horaFin,
      trabajoId: formData.trabajoSeleccionado,
      tipo: 'delivery', // Asegurar que se marque como delivery
      numeroPedidos: Number(formData.numeroPedidos) || 0,
      gananciaTotal: Number(formData.gananciaTotal) || 0,
      propinas: Number(formData.propinas) || 0,
      kilometros: Number(formData.kilometros) || 0,
      gastoCombustible: Number(formData.gastoCombustible) || 0,
      notas: formData.notas.trim()
    ***REMOVED***;

    await onSubmit(datosTurno);
  ***REMOVED***;

  // NUEVO: Función para determinar si mostrar advertencia
  const trabajoSeleccionadoInfo = trabajosParaSelector.find(t => t.id === formData.trabajoSeleccionado);
  const esTrabajoNoDelivery = trabajoSeleccionadoInfo && 
    trabajoSeleccionadoInfo.tipo !== 'delivery' && 
    trabajoSeleccionadoInfo.type !== 'delivery';

  return (
    <form 
      onSubmit=***REMOVED***manejarSubmit***REMOVED*** 
      className=***REMOVED***`space-y-6 $***REMOVED***isMobile ? 'mobile-form' : ''***REMOVED***`***REMOVED***
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
          className=***REMOVED***`
            w-full border rounded-lg transition-colors
            $***REMOVED***isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'***REMOVED***
            $***REMOVED***error && !formData.trabajoSeleccionado ? 'border-red-500' : 'border-gray-300'***REMOVED***
          `***REMOVED***
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
                : ' (Tradicional)'***REMOVED***
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

      ***REMOVED***/* Fecha y horario */***REMOVED***
      <div className=***REMOVED***`grid $***REMOVED***isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-3'***REMOVED***`***REMOVED***>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar size=***REMOVED***16***REMOVED*** className="inline mr-2" />
            Fecha *
          </label>
          <ThemeInput
            type="date"
            value=***REMOVED***formData.fecha***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('fecha', e.target.value)***REMOVED***
            className=***REMOVED***`
              w-full border rounded-lg transition-colors
              $***REMOVED***isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'***REMOVED***
            `***REMOVED***
            required
            themeColor=***REMOVED***coloresTemáticos?.base***REMOVED***
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock size=***REMOVED***16***REMOVED*** className="inline mr-2" />
            Inicio *
          </label>
          <ThemeInput
            type="time"
            value=***REMOVED***formData.horaInicio***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('horaInicio', e.target.value)***REMOVED***
            className=***REMOVED***`
              w-full border rounded-lg transition-colors
              $***REMOVED***isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'***REMOVED***
            `***REMOVED***
            required
            themeColor=***REMOVED***coloresTemáticos?.base***REMOVED***
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock size=***REMOVED***16***REMOVED*** className="inline mr-2" />
            Fin *
          </label>
          <ThemeInput
            type="time"
            value=***REMOVED***formData.horaFin***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('horaFin', e.target.value)***REMOVED***
            className=***REMOVED***`
              w-full border rounded-lg transition-colors
              $***REMOVED***isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'***REMOVED***
            `***REMOVED***
            required
            themeColor=***REMOVED***coloresTemáticos?.base***REMOVED***
          />
        </div>
      </div>

      ***REMOVED***/* Información de pedidos */***REMOVED***
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Información del turno</h3>
        
        <div className=***REMOVED***`grid $***REMOVED***isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-4'***REMOVED***`***REMOVED***>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Package size=***REMOVED***16***REMOVED*** className="inline mr-2" />
              Número de pedidos
            </label>
            <ThemeInput
              type="number"
              value=***REMOVED***formData.numeroPedidos***REMOVED***
              onChange=***REMOVED***(e) => handleInputChange('numeroPedidos', e.target.value)***REMOVED***
              className=***REMOVED***`
                w-full border rounded-lg transition-colors
                $***REMOVED***isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'***REMOVED***
              `***REMOVED***
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
              className=***REMOVED***`
                w-full border rounded-lg transition-colors
                $***REMOVED***isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'***REMOVED***
              `***REMOVED***
              placeholder="0"
              min="0"
              step="0.1"
              themeColor=***REMOVED***coloresTemáticos?.base***REMOVED***
            />
          </div>
        </div>
      </div>

      ***REMOVED***/* Información financiera */***REMOVED***
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Ganancias *</h3>
        
        <div className=***REMOVED***`grid $***REMOVED***isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-4'***REMOVED***`***REMOVED***>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign size=***REMOVED***16***REMOVED*** className="inline mr-2" />
              Ganancia total *
            </label>
            <ThemeInput
              type="number"
              value=***REMOVED***formData.gananciaTotal***REMOVED***
              onChange=***REMOVED***(e) => handleInputChange('gananciaTotal', e.target.value)***REMOVED***
              className=***REMOVED***`
                w-full border rounded-lg transition-colors
                $***REMOVED***isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'***REMOVED***
                $***REMOVED***error && !formData.gananciaTotal ? 'border-red-500' : 'border-gray-300'***REMOVED***
              `***REMOVED***
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
              className=***REMOVED***`
                w-full border rounded-lg transition-colors
                $***REMOVED***isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'***REMOVED***
              `***REMOVED***
              placeholder="0.00"
              step="0.01"
              themeColor=***REMOVED***coloresTemáticos?.base***REMOVED***
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gasto en combustible
          </label>
          <ThemeInput
            type="number"
            value=***REMOVED***formData.gastoCombustible***REMOVED***
            onChange=***REMOVED***(e) => handleInputChange('gastoCombustible', e.target.value)***REMOVED***
            className=***REMOVED***`
              w-full border rounded-lg transition-colors
              $***REMOVED***isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'***REMOVED***
            `***REMOVED***
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
          rows=***REMOVED***isMobile ? 4 : 3***REMOVED***
          className=***REMOVED***`
            w-full border border-gray-300 rounded-lg transition-colors resize-none
            $***REMOVED***isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'***REMOVED***
          `***REMOVED***
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
      <div className=***REMOVED***`flex pt-4 $***REMOVED***isMobile ? 'flex-col space-y-3' : 'gap-3'***REMOVED***`***REMOVED***>
        <Button
          type="button"
          onClick=***REMOVED***onCancel***REMOVED***
          variant="outline"
          className=***REMOVED***isMobile ? 'w-full py-3' : 'flex-1'***REMOVED***
          disabled=***REMOVED***loading***REMOVED***
          themeColor=***REMOVED***coloresTemáticos?.base***REMOVED***
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className=***REMOVED***isMobile ? 'w-full py-3' : 'flex-1'***REMOVED***
          loading=***REMOVED***loading***REMOVED***
          themeColor=***REMOVED***coloresTemáticos?.base***REMOVED***
        >
          ***REMOVED***turno ? 'Guardar Cambios' : 'Crear Turno'***REMOVED***
        </Button>
      </div>

      ***REMOVED***/* Vista previa de ganancias */***REMOVED***
      ***REMOVED***formData.gananciaTotal && (
        <div 
          className=***REMOVED***`rounded-lg p-4 border-l-4 $***REMOVED***isMobile ? 'mt-4' : 'mt-2'***REMOVED***`***REMOVED***
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
  );
***REMOVED***;

export default TurnoDeliveryForm;