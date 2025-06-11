// src/components/forms/TrabajoDeliveryForm.jsx

import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';

const TrabajoDeliveryForm = ({ trabajo, onSubmit, onCancel }) => {
  const { coloresTemáticos } = useApp();
  
  // Plataformas australianas con sus colores
  const plataformasAustralia = [
    { nombre: 'Uber Eats', color: '#06C167', colorDark: '#049C52' },
    { nombre: 'Menulog', color: '#FF8000', colorDark: '#E67300' },
    { nombre: 'DoorDash', color: '#FF3008', colorDark: '#E62A07' },
    { nombre: 'Deliveroo', color: '#00CCBC', colorDark: '#00B3A6' },
    { nombre: 'Independiente', color: '#6B7280', colorDark: '#4B5563' }
  ];
  
  // Estados del formulario
  const [plataforma, setPlataforma] = useState('');
  const [vehiculo, setVehiculo] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  // Cargar datos si es edición
  useEffect(() => {
    if (trabajo) {
      setPlataforma(trabajo.plataforma || trabajo.nombre || '');
      setVehiculo(trabajo.vehiculo || '');
    }
  }, [trabajo]);

  const validarFormulario = () => {
    if (!plataforma) {
      setError('Debes seleccionar una plataforma');
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
      // Encontrar los colores de la plataforma
      const plataformaSeleccionada = plataformasAustralia.find(p => p.nombre === plataforma);
      
      const datosDelivery = {
        nombre: plataforma, // El nombre será la plataforma
        tipo: 'delivery',
        plataforma: plataforma,
        vehiculo: vehiculo || 'No especificado',
        // Agregar colores para el WorkAvatar
        colorAvatar: plataformaSeleccionada?.color || '#6B7280',
        colorAvatarDark: plataformaSeleccionada?.colorDark || '#4B5563'
      };

      await onSubmit(datosDelivery);
    } catch (err) {
      setError(err.message || 'Error al guardar el trabajo');
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={manejarSubmit} className="space-y-4">
      {/* Indicador de tipo */}
      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
        <p className="text-sm font-medium text-green-700">
          Trabajo de Delivery
        </p>
      </div>

      {/* Plataforma */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Plataforma de delivery
        </label>
        <select
          value={plataforma}
          onChange={(e) => setPlataforma(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
          required
        >
          <option value="">Seleccionar plataforma</option>
          {plataformasAustralia.map(p => (
            <option key={p.nombre} value={p.nombre}>{p.nombre}</option>
          ))}
        </select>
      </div>

      {/* Vehículo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Vehículo
        </label>
        <select
          value={vehiculo}
          onChange={(e) => setVehiculo(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
        >
          <option value="">Seleccionar vehículo</option>
          <option value="Bicicleta">Bicicleta</option>
          <option value="Moto">Moto</option>
          <option value="Auto">Auto</option>
          <option value="A pie">A pie</option>
        </select>
      </div>

      {/* Información adicional */}
      <div className="p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700 flex items-start">
          <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
          Las ganancias, propinas y gastos se registrarán al crear cada turno de delivery
        </p>
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
          {guardando ? 'Guardando...' : (trabajo ? 'Guardar Cambios' : 'Crear Trabajo')}
        </button>
      </div>
    </form>
  );
};

export default TrabajoDeliveryForm;