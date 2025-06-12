// src/components/modals/ModalTrabajoDelivery.jsx

import React from 'react';
import ***REMOVED*** X ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';

const ModalTrabajoDelivery = (***REMOVED*** isOpen, onClose, trabajo ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** agregarTrabajo, editarTrabajo, coloresTemáticos ***REMOVED*** = useApp();

  const manejarGuardado = async (datosDelivery) => ***REMOVED***
    try ***REMOVED***
      if (trabajo) ***REMOVED***
        await editarTrabajo(trabajo.id, datosDelivery);
      ***REMOVED*** else ***REMOVED***
        await agregarTrabajo(datosDelivery);
      ***REMOVED***
      onClose();
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error al guardar trabajo:', error);
    ***REMOVED***
  ***REMOVED***;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            ***REMOVED***trabajo ? 'Editar' : 'Nuevo'***REMOVED*** Trabajo Delivery
          </h2>
          <button
            onClick=***REMOVED***onClose***REMOVED***
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size=***REMOVED***20***REMOVED*** />
          </button>
        </div>

        <div className="p-4">
          <TrabajoDeliveryFormContent
            trabajo=***REMOVED***trabajo***REMOVED***
            onSubmit=***REMOVED***manejarGuardado***REMOVED***
            onCancel=***REMOVED***onClose***REMOVED***
            coloresTemáticos=***REMOVED***coloresTemáticos***REMOVED***
          />
        </div>
      </div>
    </div>
  );
***REMOVED***;

// Componente del formulario integrado directamente
const TrabajoDeliveryFormContent = (***REMOVED*** trabajo, onSubmit, onCancel, coloresTemáticos ***REMOVED***) => ***REMOVED***
  const [formData, setFormData] = React.useState(***REMOVED***
    nombre: '',
    tipo: 'delivery',
    plataforma: '',
    vehiculo: '',
    descripcion: ''
  ***REMOVED***);

  const [errors, setErrors] = React.useState(***REMOVED******REMOVED***);
  const [guardando, setGuardando] = React.useState(false);

  // Opciones predefinidas
  const plataformasDisponibles = [
    'Uber Eats',
    'PedidosYa', 
    'Rappi',
    'Glovo',
    'DoorDash',
    'Menulog',
    'Deliveroo'
  ];

  const vehiculosDisponibles = [
    'Bicicleta',
    'Moto',
    'Auto',
    'A pie'
  ];

  React.useEffect(() => ***REMOVED***
    if (trabajo) ***REMOVED***
      setFormData(***REMOVED***
        nombre: trabajo.nombre || '',
        tipo: trabajo.tipo || 'delivery',
        plataforma: trabajo.plataforma || '',
        vehiculo: trabajo.vehiculo || '',
        descripcion: trabajo.descripcion || ''
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***, [trabajo]);

  const validarFormulario = () => ***REMOVED***
    const newErrors = ***REMOVED******REMOVED***;
    
    if (!formData.nombre.trim()) ***REMOVED***
      newErrors.nombre = 'El nombre es requerido';
    ***REMOVED***
    if (!formData.plataforma) ***REMOVED***
      newErrors.plataforma = 'Selecciona una plataforma';
    ***REMOVED***
    if (!formData.vehiculo) ***REMOVED***
      newErrors.vehiculo = 'Selecciona un vehículo';
    ***REMOVED***

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  ***REMOVED***;

  const handleSubmit = async (e) => ***REMOVED***
    e.preventDefault();
    
    if (!validarFormulario()) ***REMOVED***
      return;
    ***REMOVED***

    setGuardando(true);

    try ***REMOVED***
      const datosCompletos = ***REMOVED***
        ...formData,
        id: trabajo?.id || Date.now().toString(),
        createdAt: trabajo?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      ***REMOVED***;

      await onSubmit(datosCompletos);
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error:', error);
    ***REMOVED*** finally ***REMOVED***
      setGuardando(false);
    ***REMOVED***
  ***REMOVED***;

  const handleInputChange = (field, value) => ***REMOVED***
    setFormData(prev => (***REMOVED***
      ...prev,
      [field]: value
    ***REMOVED***));
    
    if (errors[field]) ***REMOVED***
      setErrors(prev => (***REMOVED***
        ...prev,
        [field]: undefined
      ***REMOVED***));
    ***REMOVED***
  ***REMOVED***;

  return (
    <form onSubmit=***REMOVED***handleSubmit***REMOVED*** className="space-y-4">
      ***REMOVED***/* Nombre del trabajo */***REMOVED***
      <div>
        <label className="block text-sm font-medium mb-1">
          Nombre del trabajo *
        </label>
        <input
          type="text"
          value=***REMOVED***formData.nombre***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('nombre', e.target.value)***REMOVED***
          className=***REMOVED***`w-full p-3 border rounded-lg text-sm $***REMOVED***errors.nombre ? 'border-red-500' : 'border-gray-300'***REMOVED***`***REMOVED***
          placeholder="ej: Delivery Zona Norte"
        />
        ***REMOVED***errors.nombre && <p className="text-red-500 text-xs mt-1">***REMOVED***errors.nombre***REMOVED***</p>***REMOVED***
      </div>

      ***REMOVED***/* ========== LAS DOS SELECCIONES PRINCIPALES ========== */***REMOVED***
      
      ***REMOVED***/* PLATAFORMA */***REMOVED***
      <div>
        <label className="block text-sm font-medium mb-1">
          🚗 Plataforma *
        </label>
        <select
          value=***REMOVED***formData.plataforma***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('plataforma', e.target.value)***REMOVED***
          className=***REMOVED***`w-full p-3 border rounded-lg text-sm $***REMOVED***errors.plataforma ? 'border-red-500' : 'border-gray-300'***REMOVED***`***REMOVED***
        >
          <option value="">-- Seleccionar Plataforma --</option>
          ***REMOVED***plataformasDisponibles.map(plataforma => (
            <option key=***REMOVED***plataforma***REMOVED*** value=***REMOVED***plataforma***REMOVED***>
              ***REMOVED***plataforma***REMOVED***
            </option>
          ))***REMOVED***
        </select>
        ***REMOVED***errors.plataforma && <p className="text-red-500 text-xs mt-1">***REMOVED***errors.plataforma***REMOVED***</p>***REMOVED***
      </div>

      ***REMOVED***/* VEHÍCULO */***REMOVED***
      <div>
        <label className="block text-sm font-medium mb-1">
          🚴 Vehículo *
        </label>
        <select
          value=***REMOVED***formData.vehiculo***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('vehiculo', e.target.value)***REMOVED***
          className=***REMOVED***`w-full p-3 border rounded-lg text-sm $***REMOVED***errors.vehiculo ? 'border-red-500' : 'border-gray-300'***REMOVED***`***REMOVED***
        >
          <option value="">-- Seleccionar Vehículo --</option>
          ***REMOVED***vehiculosDisponibles.map(vehiculo => (
            <option key=***REMOVED***vehiculo***REMOVED*** value=***REMOVED***vehiculo***REMOVED***>
              ***REMOVED***vehiculo***REMOVED***
            </option>
          ))***REMOVED***
        </select>
        ***REMOVED***errors.vehiculo && <p className="text-red-500 text-xs mt-1">***REMOVED***errors.vehiculo***REMOVED***</p>***REMOVED***
      </div>

      ***REMOVED***/* Descripción opcional */***REMOVED***
      <div>
        <label className="block text-sm font-medium mb-1">
          Descripción (opcional)
        </label>
        <textarea
          value=***REMOVED***formData.descripcion***REMOVED***
          onChange=***REMOVED***(e) => handleInputChange('descripcion', e.target.value)***REMOVED***
          className="w-full p-2 border rounded-lg text-sm border-gray-300"
          rows="2"
          placeholder="ej: Trabajo de delivery en zona céntrica..."
        />
      </div>

      ***REMOVED***/* Botones */***REMOVED***
      <div className="flex space-x-2 pt-4">
        <button
          type="button"
          onClick=***REMOVED***onCancel***REMOVED***
          className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
          disabled=***REMOVED***guardando***REMOVED***
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled=***REMOVED***guardando***REMOVED***
          className="flex-1 py-2 px-4 text-white rounded-lg hover:opacity-90 text-sm disabled:opacity-50"
          style=***REMOVED******REMOVED*** backgroundColor: coloresTemáticos?.base || '#3B82F6' ***REMOVED******REMOVED***
        >
          ***REMOVED***guardando ? 'Guardando...' : (trabajo ? 'Actualizar' : 'Crear')***REMOVED***
        </button>
      </div>
    </form>
  );
***REMOVED***;

export default ModalTrabajoDelivery;