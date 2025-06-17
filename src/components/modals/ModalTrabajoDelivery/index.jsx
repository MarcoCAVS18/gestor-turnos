// src/components/modals/ModalTrabajoDelivery/index.jsx

import React from 'react';
import { X, Truck } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import PlatformSelector from '../../delivery/PlatformSelector';
import { DELIVERY_VEHICLES } from '../../../constants/delivery';

const ModalTrabajoDelivery = ({ isOpen, onClose, trabajo }) => {
  const { agregarTrabajo, editarTrabajo, coloresTemáticos } = useApp();

  const manejarGuardado = async (datosDelivery) => {
    try {
      if (trabajo) {
        await editarTrabajo(trabajo.id, datosDelivery);
      } else {
        await agregarTrabajo(datosDelivery);
      }
      onClose();
    } catch (error) {
      console.error('Error al guardar trabajo:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center">
            <Truck size={20} style={{ color: coloresTemáticos?.base }} className="mr-2" />
            {trabajo ? 'Editar' : 'Nuevo'} Trabajo Delivery
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <TrabajoDeliveryFormContent
            trabajo={trabajo}
            onSubmit={manejarGuardado}
            onCancel={onClose}
            coloresTemáticos={coloresTemáticos}
          />
        </div>
      </div>
    </div>
  );
};

const TrabajoDeliveryFormContent = ({ trabajo, onSubmit, onCancel, coloresTemáticos }) => {
  const [formData, setFormData] = React.useState({
    nombre: '',
    tipo: 'delivery',
    plataforma: '',
    vehiculo: '',
    descripcion: ''
  });

  const [errors, setErrors] = React.useState({});
  const [guardando, setGuardando] = React.useState(false);

  React.useEffect(() => {
    if (trabajo) {
      setFormData({
        nombre: trabajo.nombre || '',
        tipo: trabajo.tipo || 'delivery',
        plataforma: trabajo.plataforma || '',
        vehiculo: trabajo.vehiculo || '',
        descripcion: trabajo.descripcion || ''
      });
    }
  }, [trabajo]);

  const validarFormulario = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    if (!formData.plataforma) {
      newErrors.plataforma = 'Selecciona una plataforma';
    }
    if (!formData.vehiculo) {
      newErrors.vehiculo = 'Selecciona un vehículo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setGuardando(true);

    try {
      const datosCompletos = {
        ...formData,
        id: trabajo?.id || Date.now().toString(),
        createdAt: trabajo?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await onSubmit(datosCompletos);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setGuardando(false);
    }
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombre del trabajo */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Nombre del trabajo
        </label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => handleInputChange('nombre', e.target.value)}
          className={`w-full p-3 border rounded-lg text-sm ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="ej: Delivery Zona Norte"
        />
        {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
      </div>

      {/* Selector de plataforma */}
      <div>
        <PlatformSelector
          selectedPlatform={formData.plataforma}
          onPlatformSelect={(plataforma) => handleInputChange('plataforma', plataforma)}
        />
        {errors.plataforma && <p className="text-red-500 text-xs mt-1">{errors.plataforma}</p>}
      </div>

      {/* Selector de vehículo */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Vehículo
        </label>
        <select
          value={formData.vehiculo}
          onChange={(e) => handleInputChange('vehiculo', e.target.value)}
          className={`w-full p-3 border rounded-lg text-sm ${errors.vehiculo ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value="">-- Seleccionar Vehículo --</option>
          {DELIVERY_VEHICLES.map(vehiculo => (
            <option key={vehiculo} value={vehiculo}>
              {vehiculo}
            </option>
          ))}
        </select>
        {errors.vehiculo && <p className="text-red-500 text-xs mt-1">{errors.vehiculo}</p>}
      </div>

      {/* Descripción opcional */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Descripción (opcional)
        </label>
        <textarea
          value={formData.descripcion}
          onChange={(e) => handleInputChange('descripcion', e.target.value)}
          className="w-full p-2 border rounded-lg text-sm border-gray-300"
          rows="2"
          placeholder="ej: Trabajo de delivery en zona céntrica..."
        />
      </div>

      {/* Botones */}
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
          disabled={guardando}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={guardando}
          className="flex-1 py-3 px-4 text-white rounded-lg hover:opacity-90 text-sm font-medium disabled:opacity-50"
          style={{ backgroundColor: coloresTemáticos?.base || '#3B82F6' }}
        >
          {guardando ? 'Guardando...' : (trabajo ? 'Actualizar' : 'Crear')}
        </button>
      </div>
    </form>
  );
};

export default ModalTrabajoDelivery;