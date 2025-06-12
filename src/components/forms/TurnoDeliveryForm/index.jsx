// src/components/forms/TurnoDeliveryForm.jsx

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Package, Car, DollarSign, TrendingUp } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';

const TurnoDeliveryForm = ({ turno, trabajoId, onSubmit, onCancel, onTrabajoChange }) => {
  const { coloresTemáticos, trabajos } = useApp();
  
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
  useEffect(() => {
    if (turno) {
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
    }
  }, [turno]);

  // Actualizar trabajo seleccionado si cambia el prop
  useEffect(() => {
    if (trabajoId && trabajoId !== trabajoSeleccionado) {
      setTrabajoSeleccionado(trabajoId);
    }
  }, [trabajoId, trabajoSeleccionado]);

  const handleTrabajoChange = (e) => {
    const nuevoTrabajoId = e.target.value;
    setTrabajoSeleccionado(nuevoTrabajoId);
    
    // Notificar al modal sobre el cambio
    if (onTrabajoChange) {
      onTrabajoChange(nuevoTrabajoId);
    }
  };

  // Calcular ganancia neta
  const gananciaBase = Number(gananciaTotal) - Number(propinas || 0);
  const gananciaNeta = Number(gananciaTotal) - Number(gastoCombustible || 0);
  const promedioPorPedido = numeroPedidos > 0 ? gananciaBase / Number(numeroPedidos) : 0;

  const validarFormulario = () => {
    if (!fecha) {
      setError('La fecha es requerida');
      return false;
    }
    if (!horaInicio || !horaFin) {
      setError('Las horas de inicio y fin son requeridas');
      return false;
    }
    if (!trabajoSeleccionado) {
      setError('Debes seleccionar un trabajo de delivery');
      return false;
    }
    if (!gananciaTotal || Number(gananciaTotal) <= 0) {
      setError('La ganancia total debe ser mayor a 0');
      return false;
    }
    return true;
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    setGuardando(true);
    setError('');

    try {
      const datosTurno = {
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
      };

      await onSubmit(datosTurno);
    } catch (err) {
      setError(err.message || 'Error al guardar el turno');
      setGuardando(false);
    }
  };

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  };

  return (
    <form onSubmit={manejarSubmit} className="space-y-4">
      {/* Trabajo de delivery */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Trabajo de delivery
        </label>
        <select
          value={trabajoSeleccionado}
          onChange={handleTrabajoChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
          required
          disabled={turno} // No permitir cambiar trabajo en edición
        >
          <option value="">Seleccionar trabajo</option>
          {trabajos.map(trabajo => (
            <option key={trabajo.id} value={trabajo.id}>
              {trabajo.nombre} {trabajo.tipo === 'delivery' && '(Delivery)'}
            </option>
          ))}
        </select>
      </div>

      {/* Fecha y horario */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar size={16} className="inline mr-1" />
            Fecha
          </label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Clock size={16} className="inline mr-1" />
            Inicio
          </label>
          <input
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Clock size={16} className="inline mr-1" />
            Fin
          </label>
          <input
            type="time"
            value={horaFin}
            onChange={(e) => setHoraFin(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
            required
          />
        </div>
      </div>

      {/* Información de pedidos */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Información del turno</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              <Package size={14} className="inline mr-1" />
              Número de pedidos
            </label>
            <input
              type="number"
              value={numeroPedidos}
              onChange={(e) => setNumeroPedidos(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              placeholder="0"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              <Car size={14} className="inline mr-1" />
              Kilómetros recorridos
            </label>
            <input
              type="number"
              value={kilometros}
              onChange={(e) => setKilometros(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              placeholder="0"
              min="0"
              step="0.1"
            />
          </div>
        </div>
      </div>

      {/* Información financiera */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Ganancias en App.</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              <DollarSign size={14} className="inline mr-1" />
              Ganancia total
            </label>
            <input
              type="number"
              value={gananciaTotal}
              onChange={(e) => setGananciaTotal(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              placeholder="0"
              min="0"
              step="50"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              <TrendingUp size={14} className="inline mr-1" />
              Propinas
            </label>
            <input
              type="number"
              value={propinas}
              onChange={(e) => setPropinas(e.target.value)}
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
            value={gastoCombustible}
            onChange={(e) => setGastoCombustible(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
            placeholder="0"
            min="0"
            step="10"
          />
        </div>
      </div>

      {/* Resumen de cálculos */}
      {(gananciaTotal > 0 || numeroPedidos > 0) && (
        <div className="p-3 bg-gray-50 rounded-lg space-y-2">
          <p className="text-sm font-medium text-gray-700">Resumen</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Ganancia base:</span>
              <span className="font-medium">{formatearMoneda(gananciaBase)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ganancia neta:</span>
              <span className="font-medium text-green-600">{formatearMoneda(gananciaNeta)}</span>
            </div>
            {numeroPedidos > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Promedio por pedido:</span>
                <span className="font-medium">{formatearMoneda(promedioPorPedido)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notas (opcional)
        </label>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
          rows="2"
          placeholder="ej: Día lluvioso, mucha demanda..."
        />
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={guardando}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={guardando}
          className="flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50"
          style={{ 
            backgroundColor: guardando ? '#9CA3AF' : coloresTemáticos?.base,
          }}
          onMouseEnter={(e) => {
            if (!guardando) e.target.style.backgroundColor = coloresTemáticos?.dark;
          }}
          onMouseLeave={(e) => {
            if (!guardando) e.target.style.backgroundColor = coloresTemáticos?.base;
          }}
        >
          {guardando ? 'Guardando...' : (turno ? 'Guardar Cambios' : 'Crear Turno')}
        </button>
      </div>
    </form>
  );
};

export default TurnoDeliveryForm;