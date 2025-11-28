// src/components/forms/TrabajoDeliveryForm/index.jsx

import React, { useState, useEffect } from 'react';
import { useApp } from '../../../contexts/AppContext';
import { Truck, Clock } from 'lucide-react';
import { calculateShiftHours, formatHoursDecimal } from '../../../../utils/time';

const TrabajoDeliveryForm = ({ isOpen, onClose, onSubmit, trabajoId = null, initialData = null }) => {
  const { thematicColors, vehiculos = [], plataformasDelivery = [] } = useApp();
  
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    horaInicio: '',
    horaFin: '',
    tipoTrabajo: 'delivery',
    plataforma: '',
    vehiculo: '',
    pedidos: 1,
    kilometros: 0,
    ganancia: 0,
    propinas: 0,
    gastos: 0,
    notas: ''
  });

  const [errors, setErrors] = useState({});

  // Calcular horas trabajadas usando utilidad centralizada
  const horasTrabajadas = formData.horaInicio && formData.horaFin
    ? calculateShiftHours(formData.horaInicio, formData.horaFin)
    : 0;

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        fecha: initialData.fecha || new Date().toISOString().split('T')[0]
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.horaInicio) newErrors.horaInicio = 'Requerido';
    if (!formData.horaFin) newErrors.horaFin = 'Requerido';
    if (!formData.plataforma) newErrors.plataforma = 'Selecciona una plataforma';
    if (!formData.vehiculo) newErrors.vehiculo = 'Selecciona un vehículo';
    if (formData.ganancia <= 0) newErrors.ganancia = 'Debe ser mayor a 0';
    
    if (formData.horaInicio && formData.horaFin && formData.horaInicio >= formData.horaFin) {
      newErrors.horaFin = 'Debe ser posterior al inicio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const turnoData = {
      ...formData,
      id: trabajoId || Date.now().toString(),
      horasTrabajadas: horasTrabajadas,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSubmit(turnoData);
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center">
              <Truck size={20} style={{ color: thematicColors?.base }} className="mr-2" />
              {trabajoId ? 'Editar' : 'Nuevo'} Turno
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Fecha */}
            <div>
              <label className="block text-sm font-medium mb-1">Fecha</label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => handleInputChange('fecha', e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
              />
            </div>

            {/* Horarios */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1">Inicio</label>
                <input
                  type="time"
                  value={formData.horaInicio}
                  onChange={(e) => handleInputChange('horaInicio', e.target.value)}
                  className={`w-full p-2 border rounded-lg text-sm ${errors.horaInicio ? 'border-red-500' : ''}`}
                />
                {errors.horaInicio && <p className="text-red-500 text-xs">{errors.horaInicio}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Fin</label>
                <input
                  type="time"
                  value={formData.horaFin}
                  onChange={(e) => handleInputChange('horaFin', e.target.value)}
                  className={`w-full p-2 border rounded-lg text-sm ${errors.horaFin ? 'border-red-500' : ''}`}
                />
                {errors.horaFin && <p className="text-red-500 text-xs">{errors.horaFin}</p>}
              </div>
            </div>

            {/* Tiempo trabajado */}
            {horasTrabajadas > 0 && (
              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded-lg flex items-center">
                <Clock size={14} className="mr-1" />
                Tiempo: {formatHoursDecimal(horasTrabajadas)}
              </div>
            )}
            
            {/* PLATAFORMA */}
            <div>
              <label className="block text-sm font-medium mb-1">
                🚗 Plataforma *
              </label>
              <select
                value={formData.plataforma}
                onChange={(e) => handleInputChange('plataforma', e.target.value)}
                className={`w-full p-3 border rounded-lg text-sm ${errors.plataforma ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">-- Seleccionar Plataforma --</option>
                {plataformasDelivery.map(plataforma => (
                  <option key={plataforma.id} value={plataforma.nombre}>
                    {plataforma.nombre}
                  </option>
                ))}
              </select>
              {errors.plataforma && <p className="text-red-500 text-xs mt-1">{errors.plataforma}</p>}
            </div>

            {/* VEHÍCULO */}
            <div>
              <label className="block text-sm font-medium mb-1">
                🚴 Vehículo *
              </label>
              <select
                value={formData.vehiculo}
                onChange={(e) => handleInputChange('vehiculo', e.target.value)}
                className={`w-full p-3 border rounded-lg text-sm ${errors.vehiculo ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">-- Seleccionar Vehículo --</option>
                {vehiculos.map(vehiculo => (
                  <option key={vehiculo.id} value={vehiculo.nombre}>
                    {vehiculo.nombre}
                  </option>
                ))}
              </select>
              {errors.vehiculo && <p className="text-red-500 text-xs mt-1">{errors.vehiculo}</p>}
            </div>
            
            {/* Pedidos y Kilómetros */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1">Pedidos</label>
                <input
                  type="number"
                  min="1"
                  value={formData.pedidos}
                  onChange={(e) => handleInputChange('pedidos', parseInt(e.target.value) || 1)}
                  className="w-full p-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Km</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.kilometros}
                  onChange={(e) => handleInputChange('kilometros', parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Ganancia */}
            <div>
              <label className="block text-sm font-medium mb-1">💰 Ganancia *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.ganancia}
                onChange={(e) => handleInputChange('ganancia', parseFloat(e.target.value) || 0)}
                className={`w-full p-2 border rounded-lg text-sm ${errors.ganancia ? 'border-red-500' : ''}`}
                placeholder="0.00"
              />
              {errors.ganancia && <p className="text-red-500 text-xs mt-1">{errors.ganancia}</p>}
            </div>

            {/* Propinas y Gastos */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1">Propinas</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.propinas}
                  onChange={(e) => handleInputChange('propinas', parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border rounded-lg text-sm"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Combustible</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.gastos}
                  onChange={(e) => handleInputChange('gastos', parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border rounded-lg text-sm"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex space-x-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-4 text-white rounded-lg hover:opacity-90 text-sm"
                style={{ backgroundColor: thematicColors?.base || '#3B82F6' }}
              >
                {trabajoId ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TrabajoDeliveryForm;