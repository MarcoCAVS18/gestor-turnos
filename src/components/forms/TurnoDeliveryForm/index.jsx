// src/components/forms/TurnoDeliveryForm/index.jsx

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Package, Car, DollarSign, TrendingUp } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import ThemeInput from '../../ui/ThemeInput';
import Button from '../../ui/Button';

const TurnoDeliveryForm = ({ 
  turno, 
  trabajoId, 
  trabajos, 
  onSubmit, 
  onCancel, 
  onTrabajoChange,
  thematicColors,
  isMobile,
  loading 
}) => {
  const { thematicColors: contextColors } = useApp();
  const coloresTemáticos = thematicColors || contextColors;
  
  // Estados del formulario
  const [formData, setFormData] = useState({
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
  });
  
  const [error, setError] = useState('');

  // CORRECCIÓN: Filtrar trabajos de delivery correctamente
  const trabajosDelivery = trabajos.filter(t => t.tipo === 'delivery' || t.type === 'delivery');
  
  // NUEVO: También incluir el trabajo seleccionado si no es de delivery pero ya está seleccionado
  const trabajosParaSelector = React.useMemo(() => {
    // Si hay un trabajo seleccionado que no es de delivery, incluirlo
    const trabajoSeleccionadoActual = trabajos.find(t => t.id === formData.trabajoSeleccionado);
    
    if (trabajoSeleccionadoActual && trabajoSeleccionadoActual.tipo !== 'delivery' && trabajoSeleccionadoActual.type !== 'delivery') {
      // Incluir el trabajo seleccionado aunque no sea de delivery
      return [...trabajosDelivery, trabajoSeleccionadoActual];
    }
    
    return trabajosDelivery;
  }, [trabajosDelivery, trabajos, formData.trabajoSeleccionado]);

  // Cargar datos si es edición
  useEffect(() => {
    if (turno) {
      setFormData({
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
      });
    }
  }, [turno]);

  // CORRECCIÓN: Mantener el trabajoId cuando se pasa como prop
  useEffect(() => {
    if (trabajoId && trabajoId) {
      setFormData(prev => ({
        ...prev,
        trabajoSeleccionado: trabajoId
      }));
    }
  }, [trabajoId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(''); // Limpiar error al cambiar datos
  };

  const handleTrabajoChange = (e) => {
    const nuevoTrabajoId = e.target.value;
    handleInputChange('trabajoSeleccionado', nuevoTrabajoId);
    
    // Notificar al modal sobre el cambio
    if (onTrabajoChange) {
      onTrabajoChange(nuevoTrabajoId);
    }
  };

  const validarFormulario = () => {
    if (!formData.fecha) {
      setError('La fecha es requerida');
      return false;
    }
    if (!formData.horaInicio || !formData.horaFin) {
      setError('Las horas de inicio y fin son requeridas');
      return false;
    }
    if (!formData.trabajoSeleccionado) {
      setError('Debes seleccionar un trabajo');
      return false;
    }
    if (!formData.gananciaTotal || isNaN(Number(formData.gananciaTotal))) {
      setError('La ganancia total debe ser un número válido');
      return false;
    }
    
    // Validar que la hora de fin sea mayor que la de inicio
    const [horaI, minI] = formData.horaInicio.split(':').map(Number);
    const [horaF, minF] = formData.horaFin.split(':').map(Number);
    const minutosInicio = horaI * 60 + minI;
    const minutosFin = horaF * 60 + minF;
    
    if (minutosFin <= minutosInicio) {
      setError('La hora de fin debe ser posterior a la hora de inicio');
      return false;
    }
    
    return true;
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    const datosTurno = {
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
    };

    await onSubmit(datosTurno);
  };

  // NUEVO: Función para determinar si mostrar advertencia
  const trabajoSeleccionadoInfo = trabajosParaSelector.find(t => t.id === formData.trabajoSeleccionado);
  const esTrabajoNoDelivery = trabajoSeleccionadoInfo && 
    trabajoSeleccionadoInfo.tipo !== 'delivery' && 
    trabajoSeleccionadoInfo.type !== 'delivery';

  return (
    <form 
      onSubmit={manejarSubmit} 
      className={`space-y-6 ${isMobile ? 'mobile-form' : ''}`}
    >
      {/* Trabajo seleccionado */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Package size={16} className="inline mr-2" />
          Trabajo *
        </label>
        <select
          value={formData.trabajoSeleccionado}
          onChange={handleTrabajoChange}
          className={`
            w-full border rounded-lg transition-colors
            ${isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'}
            ${error && !formData.trabajoSeleccionado ? 'border-red-500' : 'border-gray-300'}
          `}
          style={{ 
            '--tw-ring-color': coloresTemáticos?.base || '#EC4899',
          }}
          required
        >
          <option value="">Seleccionar trabajo</option>
          {trabajosParaSelector.map(trabajo => (
            <option key={trabajo.id} value={trabajo.id}>
              {trabajo.nombre}
              {trabajo.tipo === 'delivery' || trabajo.type === 'delivery' 
                ? ' (Delivery)' 
                : ' (Tradicional)'}
            </option>
          ))}
        </select>
        
        {/* Advertencia si se selecciona un trabajo no-delivery */}
        {esTrabajoNoDelivery && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Nota:</strong> Has seleccionado un trabajo tradicional. 
              Este turno se guardará como delivery con ganancias manuales.
            </p>
          </div>
        )}
        
        {trabajosParaSelector.length === 0 && (
          <p className="text-sm text-gray-500 mt-1">
            No hay trabajos disponibles. Crea uno primero.
          </p>
        )}
      </div>

      {/* Fecha y horario */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-3'}`}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar size={16} className="inline mr-2" />
            Fecha *
          </label>
          <ThemeInput
            type="date"
            value={formData.fecha}
            onChange={(e) => handleInputChange('fecha', e.target.value)}
            className={`
              w-full border rounded-lg transition-colors
              ${isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'}
            `}
            required
            themeColor={coloresTemáticos?.base}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock size={16} className="inline mr-2" />
            Inicio *
          </label>
          <ThemeInput
            type="time"
            value={formData.horaInicio}
            onChange={(e) => handleInputChange('horaInicio', e.target.value)}
            className={`
              w-full border rounded-lg transition-colors
              ${isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'}
            `}
            required
            themeColor={coloresTemáticos?.base}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock size={16} className="inline mr-2" />
            Fin *
          </label>
          <ThemeInput
            type="time"
            value={formData.horaFin}
            onChange={(e) => handleInputChange('horaFin', e.target.value)}
            className={`
              w-full border rounded-lg transition-colors
              ${isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'}
            `}
            required
            themeColor={coloresTemáticos?.base}
          />
        </div>
      </div>

      {/* Información de pedidos */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Información del turno</h3>
        
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-4'}`}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Package size={16} className="inline mr-2" />
              Número de pedidos
            </label>
            <ThemeInput
              type="number"
              value={formData.numeroPedidos}
              onChange={(e) => handleInputChange('numeroPedidos', e.target.value)}
              className={`
                w-full border rounded-lg transition-colors
                ${isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'}
              `}
              placeholder="0"
              min="0"
              themeColor={coloresTemáticos?.base}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Car size={16} className="inline mr-2" />
              Kilómetros recorridos
            </label>
            <ThemeInput
              type="number"
              value={formData.kilometros}
              onChange={(e) => handleInputChange('kilometros', e.target.value)}
              className={`
                w-full border rounded-lg transition-colors
                ${isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'}
              `}
              placeholder="0"
              min="0"
              step="0.1"
              themeColor={coloresTemáticos?.base}
            />
          </div>
        </div>
      </div>

      {/* Información financiera */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Ganancias *</h3>
        
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-4'}`}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign size={16} className="inline mr-2" />
              Ganancia total *
            </label>
            <ThemeInput
              type="number"
              value={formData.gananciaTotal}
              onChange={(e) => handleInputChange('gananciaTotal', e.target.value)}
              className={`
                w-full border rounded-lg transition-colors
                ${isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'}
                ${error && !formData.gananciaTotal ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="0.00"
              step="0.01"
              required
              themeColor={coloresTemáticos?.base}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <TrendingUp size={16} className="inline mr-2" />
              Propinas
            </label>
            <ThemeInput
              type="number"
              value={formData.propinas}
              onChange={(e) => handleInputChange('propinas', e.target.value)}
              className={`
                w-full border rounded-lg transition-colors
                ${isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'}
              `}
              placeholder="0.00"
              step="0.01"
              themeColor={coloresTemáticos?.base}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gasto en combustible
          </label>
          <ThemeInput
            type="number"
            value={formData.gastoCombustible}
            onChange={(e) => handleInputChange('gastoCombustible', e.target.value)}
            className={`
              w-full border rounded-lg transition-colors
              ${isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'}
            `}
            placeholder="0.00"
            step="0.01"
            themeColor={coloresTemáticos?.base}
          />
        </div>
      </div>

      {/* Notas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notas (opcional)
        </label>
        <textarea
          value={formData.notas}
          onChange={(e) => handleInputChange('notas', e.target.value)}
          placeholder="ej: Día lluvioso, mucha demanda..."
          rows={isMobile ? 4 : 3}
          className={`
            w-full border border-gray-300 rounded-lg transition-colors resize-none
            ${isMobile ? 'p-3 text-base' : 'px-3 py-2 text-sm'}
          `}
          style={{
            '--tw-ring-color': coloresTemáticos?.base || '#EC4899'
          }}
        />
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Botones */}
      <div className={`flex pt-4 ${isMobile ? 'flex-col space-y-3' : 'gap-3'}`}>
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className={isMobile ? 'w-full py-3' : 'flex-1'}
          disabled={loading}
          themeColor={coloresTemáticos?.base}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className={isMobile ? 'w-full py-3' : 'flex-1'}
          loading={loading}
          themeColor={coloresTemáticos?.base}
        >
          {turno ? 'Guardar Cambios' : 'Crear Turno'}
        </Button>
      </div>

      {/* Vista previa de ganancias */}
      {formData.gananciaTotal && (
        <div 
          className={`rounded-lg p-4 border-l-4 ${isMobile ? 'mt-4' : 'mt-2'}`}
          style={{ 
            borderLeftColor: coloresTemáticos?.base || '#EC4899',
            backgroundColor: `${coloresTemáticos?.base || '#EC4899'}10`
          }}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Ganancia bruta:</span>
              <span className="font-medium">${formData.gananciaTotal}</span>
            </div>
            {formData.gastoCombustible && (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Gasto combustible:</span>
                  <span className="text-red-600">-${formData.gastoCombustible}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-medium border-t pt-2">
                  <span>Ganancia neta:</span>
                  <span style={{ color: coloresTemáticos?.base || '#EC4899' }}>
                    ${(Number(formData.gananciaTotal) - Number(formData.gastoCombustible || 0)).toFixed(2)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </form>
  );
};

export default TurnoDeliveryForm;