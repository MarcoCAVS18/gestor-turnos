// src/components/forms/TurnoDeliveryForm.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** Calendar, Clock, Package, Car, DollarSign, TrendingUp ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';

const TurnoDeliveryForm = (***REMOVED*** turno, trabajoId, onSubmit, onCancel, onTrabajoChange ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** coloresTemáticos, trabajos ***REMOVED*** = useApp();
  
  // Estados del formulario
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(trabajoId || '');
  const [numeroPedidos, setNumeroPedidos] = useState('');
  const [gananciaTotal, setGananciaTotal] = useState('');
  const [propinas, setPropinas] = useState('');
  const [kilometros, setKilometros] = useState('');
  const [gastoCombustible, setGastoCombustible] = useState('');
  const [notas, setNotas] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  // Cargar datos si es edición
  useEffect(() => ***REMOVED***
    if (turno) ***REMOVED***
      setFecha(turno.fecha || '');
      setHoraInicio(turno.horaInicio || '');
      setHoraFin(turno.horaFin || '');
      setTrabajoSeleccionado(turno.trabajoId || '');
      setNumeroPedidos(turno.numeroPedidos || '');
      setGananciaTotal(turno.gananciaTotal || '');
      setPropinas(turno.propinas || '');
      setKilometros(turno.kilometros || '');
      setGastoCombustible(turno.gastoCombustible || '');
      setNotas(turno.notas || '');
    ***REMOVED***
  ***REMOVED***, [turno]);

  // Actualizar trabajo seleccionado si cambia el prop
  useEffect(() => ***REMOVED***
    if (trabajoId && trabajoId !== trabajoSeleccionado) ***REMOVED***
      setTrabajoSeleccionado(trabajoId);
    ***REMOVED***
  ***REMOVED***, [trabajoId, trabajoSeleccionado]);

  const handleTrabajoChange = (e) => ***REMOVED***
    const nuevoTrabajoId = e.target.value;
    setTrabajoSeleccionado(nuevoTrabajoId);
    
    // Notificar al modal sobre el cambio
    if (onTrabajoChange) ***REMOVED***
      onTrabajoChange(nuevoTrabajoId);
    ***REMOVED***
  ***REMOVED***;

  // Calcular ganancia neta
  const gananciaBase = Number(gananciaTotal) - Number(propinas || 0);
  const gananciaNeta = Number(gananciaTotal) - Number(gastoCombustible || 0);
  const promedioPorPedido = numeroPedidos > 0 ? gananciaBase / Number(numeroPedidos) : 0;

  const validarFormulario = () => ***REMOVED***
    if (!fecha) ***REMOVED***
      setError('La fecha es requerida');
      return false;
    ***REMOVED***
    if (!horaInicio || !horaFin) ***REMOVED***
      setError('Las horas de inicio y fin son requeridas');
      return false;
    ***REMOVED***
    if (!trabajoSeleccionado) ***REMOVED***
      setError('Debes seleccionar un trabajo de delivery');
      return false;
    ***REMOVED***
    if (!gananciaTotal || Number(gananciaTotal) <= 0) ***REMOVED***
      setError('La ganancia total debe ser mayor a 0');
      return false;
    ***REMOVED***
    return true;
  ***REMOVED***;

  const manejarSubmit = async (e) => ***REMOVED***
    e.preventDefault();
    
    if (!validarFormulario()) return;

    setGuardando(true);
    setError('');

    try ***REMOVED***
      const datosTurno = ***REMOVED***
        fecha,
        horaInicio,
        horaFin,
        trabajoId: trabajoSeleccionado,
        tipo: 'delivery',
        numeroPedidos: Number(numeroPedidos) || 0,
        gananciaTotal: Number(gananciaTotal),
        propinas: Number(propinas) || 0,
        kilometros: Number(kilometros) || 0,
        gastoCombustible: Number(gastoCombustible) || 0,
        notas: notas.trim()
      ***REMOVED***;

      await onSubmit(datosTurno);
    ***REMOVED*** catch (err) ***REMOVED***
      setError(err.message || 'Error al guardar el turno');
      setGuardando(false);
    ***REMOVED***
  ***REMOVED***;

  const formatearMoneda = (valor) => ***REMOVED***
    return new Intl.NumberFormat('es-AR', ***REMOVED***
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    ***REMOVED***).format(valor);
  ***REMOVED***;

  return (
    <form onSubmit=***REMOVED***manejarSubmit***REMOVED*** className="space-y-4">
      ***REMOVED***/* Trabajo de delivery */***REMOVED***
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Trabajo de delivery
        </label>
        <select
          value=***REMOVED***trabajoSeleccionado***REMOVED***
          onChange=***REMOVED***handleTrabajoChange***REMOVED***
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
          required
          disabled=***REMOVED***turno***REMOVED*** // No permitir cambiar trabajo en edición
        >
          <option value="">Seleccionar trabajo</option>
          ***REMOVED***trabajos.map(trabajo => (
            <option key=***REMOVED***trabajo.id***REMOVED*** value=***REMOVED***trabajo.id***REMOVED***>
              ***REMOVED***trabajo.nombre***REMOVED*** ***REMOVED***trabajo.tipo === 'delivery' && '(Delivery)'***REMOVED***
            </option>
          ))***REMOVED***
        </select>
      </div>

      ***REMOVED***/* Fecha y horario */***REMOVED***
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar size=***REMOVED***16***REMOVED*** className="inline mr-1" />
            Fecha
          </label>
          <input
            type="date"
            value=***REMOVED***fecha***REMOVED***
            onChange=***REMOVED***(e) => setFecha(e.target.value)***REMOVED***
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Clock size=***REMOVED***16***REMOVED*** className="inline mr-1" />
            Inicio
          </label>
          <input
            type="time"
            value=***REMOVED***horaInicio***REMOVED***
            onChange=***REMOVED***(e) => setHoraInicio(e.target.value)***REMOVED***
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Clock size=***REMOVED***16***REMOVED*** className="inline mr-1" />
            Fin
          </label>
          <input
            type="time"
            value=***REMOVED***horaFin***REMOVED***
            onChange=***REMOVED***(e) => setHoraFin(e.target.value)***REMOVED***
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
            required
          />
        </div>
      </div>

      ***REMOVED***/* Información de pedidos */***REMOVED***
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Información del turno</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              <Package size=***REMOVED***14***REMOVED*** className="inline mr-1" />
              Número de pedidos
            </label>
            <input
              type="number"
              value=***REMOVED***numeroPedidos***REMOVED***
              onChange=***REMOVED***(e) => setNumeroPedidos(e.target.value)***REMOVED***
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              placeholder="0"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              <Car size=***REMOVED***14***REMOVED*** className="inline mr-1" />
              Kilómetros recorridos
            </label>
            <input
              type="number"
              value=***REMOVED***kilometros***REMOVED***
              onChange=***REMOVED***(e) => setKilometros(e.target.value)***REMOVED***
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              placeholder="0"
              min="0"
              step="0.1"
            />
          </div>
        </div>
      </div>

      ***REMOVED***/* Información financiera */***REMOVED***
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Ganancias en App.</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              <DollarSign size=***REMOVED***14***REMOVED*** className="inline mr-1" />
              Ganancia total
            </label>
            <input
              type="number"
              value=***REMOVED***gananciaTotal***REMOVED***
              onChange=***REMOVED***(e) => setGananciaTotal(e.target.value)***REMOVED***
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              placeholder="0"
              min="0"
              step="50"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              <TrendingUp size=***REMOVED***14***REMOVED*** className="inline mr-1" />
              Propinas
            </label>
            <input
              type="number"
              value=***REMOVED***propinas***REMOVED***
              onChange=***REMOVED***(e) => setPropinas(e.target.value)***REMOVED***
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              placeholder="0"
              min="0"
              step="10"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Gasto en combustible
          </label>
          <input
            type="number"
            value=***REMOVED***gastoCombustible***REMOVED***
            onChange=***REMOVED***(e) => setGastoCombustible(e.target.value)***REMOVED***
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
            placeholder="0"
            min="0"
            step="10"
          />
        </div>
      </div>

      ***REMOVED***/* Resumen de cálculos */***REMOVED***
      ***REMOVED***(gananciaTotal > 0 || numeroPedidos > 0) && (
        <div className="p-3 bg-gray-50 rounded-lg space-y-2">
          <p className="text-sm font-medium text-gray-700">Resumen</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Ganancia base:</span>
              <span className="font-medium">***REMOVED***formatearMoneda(gananciaBase)***REMOVED***</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ganancia neta:</span>
              <span className="font-medium text-green-600">***REMOVED***formatearMoneda(gananciaNeta)***REMOVED***</span>
            </div>
            ***REMOVED***numeroPedidos > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Promedio por pedido:</span>
                <span className="font-medium">***REMOVED***formatearMoneda(promedioPorPedido)***REMOVED***</span>
              </div>
            )***REMOVED***
          </div>
        </div>
      )***REMOVED***

      ***REMOVED***/* Notas */***REMOVED***
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notas (opcional)
        </label>
        <textarea
          value=***REMOVED***notas***REMOVED***
          onChange=***REMOVED***(e) => setNotas(e.target.value)***REMOVED***
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
          rows="2"
          placeholder="ej: Día lluvioso, mucha demanda..."
        />
      </div>

      ***REMOVED***/* Mensajes de error */***REMOVED***
      ***REMOVED***error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">***REMOVED***error***REMOVED***</p>
        </div>
      )***REMOVED***

      ***REMOVED***/* Botones */***REMOVED***
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick=***REMOVED***onCancel***REMOVED***
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          disabled=***REMOVED***guardando***REMOVED***
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled=***REMOVED***guardando***REMOVED***
          className="flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50"
          style=***REMOVED******REMOVED*** 
            backgroundColor: guardando ? '#9CA3AF' : coloresTemáticos?.base,
          ***REMOVED******REMOVED***
          onMouseEnter=***REMOVED***(e) => ***REMOVED***
            if (!guardando) e.target.style.backgroundColor = coloresTemáticos?.dark;
          ***REMOVED******REMOVED***
          onMouseLeave=***REMOVED***(e) => ***REMOVED***
            if (!guardando) e.target.style.backgroundColor = coloresTemáticos?.base;
          ***REMOVED******REMOVED***
        >
          ***REMOVED***guardando ? 'Guardando...' : (turno ? 'Guardar Cambios' : 'Crear Turno')***REMOVED***
        </button>
      </div>
    </form>
  );
***REMOVED***;

export default TurnoDeliveryForm;