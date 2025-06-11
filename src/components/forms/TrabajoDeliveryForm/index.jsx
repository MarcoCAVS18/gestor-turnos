// src/components/forms/TrabajoDeliveryForm.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** AlertCircle ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';

const TrabajoDeliveryForm = (***REMOVED*** trabajo, onSubmit, onCancel ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** coloresTemáticos ***REMOVED*** = useApp();
  
  // Plataformas australianas con sus colores
  const plataformasAustralia = [
    ***REMOVED*** nombre: 'Uber Eats', color: '#06C167', colorDark: '#049C52' ***REMOVED***,
    ***REMOVED*** nombre: 'Menulog', color: '#FF8000', colorDark: '#E67300' ***REMOVED***,
    ***REMOVED*** nombre: 'DoorDash', color: '#FF3008', colorDark: '#E62A07' ***REMOVED***,
    ***REMOVED*** nombre: 'Deliveroo', color: '#00CCBC', colorDark: '#00B3A6' ***REMOVED***,
    ***REMOVED*** nombre: 'Independiente', color: '#6B7280', colorDark: '#4B5563' ***REMOVED***
  ];
  
  // Estados del formulario
  const [plataforma, setPlataforma] = useState('');
  const [vehiculo, setVehiculo] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  // Cargar datos si es edición
  useEffect(() => ***REMOVED***
    if (trabajo) ***REMOVED***
      setPlataforma(trabajo.plataforma || trabajo.nombre || '');
      setVehiculo(trabajo.vehiculo || '');
    ***REMOVED***
  ***REMOVED***, [trabajo]);

  const validarFormulario = () => ***REMOVED***
    if (!plataforma) ***REMOVED***
      setError('Debes seleccionar una plataforma');
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
      // Encontrar los colores de la plataforma
      const plataformaSeleccionada = plataformasAustralia.find(p => p.nombre === plataforma);
      
      const datosDelivery = ***REMOVED***
        nombre: plataforma, // El nombre será la plataforma
        tipo: 'delivery',
        plataforma: plataforma,
        vehiculo: vehiculo || 'No especificado',
        // Agregar colores para el WorkAvatar
        colorAvatar: plataformaSeleccionada?.color || '#6B7280',
        colorAvatarDark: plataformaSeleccionada?.colorDark || '#4B5563'
      ***REMOVED***;

      await onSubmit(datosDelivery);
    ***REMOVED*** catch (err) ***REMOVED***
      setError(err.message || 'Error al guardar el trabajo');
      setGuardando(false);
    ***REMOVED***
  ***REMOVED***;

  return (
    <form onSubmit=***REMOVED***manejarSubmit***REMOVED*** className="space-y-4">
      ***REMOVED***/* Indicador de tipo */***REMOVED***
      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
        <p className="text-sm font-medium text-green-700">
          Trabajo de Delivery
        </p>
      </div>

      ***REMOVED***/* Plataforma */***REMOVED***
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Plataforma de delivery
        </label>
        <select
          value=***REMOVED***plataforma***REMOVED***
          onChange=***REMOVED***(e) => setPlataforma(e.target.value)***REMOVED***
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
          required
        >
          <option value="">Seleccionar plataforma</option>
          ***REMOVED***plataformasAustralia.map(p => (
            <option key=***REMOVED***p.nombre***REMOVED*** value=***REMOVED***p.nombre***REMOVED***>***REMOVED***p.nombre***REMOVED***</option>
          ))***REMOVED***
        </select>
      </div>

      ***REMOVED***/* Vehículo */***REMOVED***
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Vehículo
        </label>
        <select
          value=***REMOVED***vehiculo***REMOVED***
          onChange=***REMOVED***(e) => setVehiculo(e.target.value)***REMOVED***
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
        >
          <option value="">Seleccionar vehículo</option>
          <option value="Bicicleta">Bicicleta</option>
          <option value="Moto">Moto</option>
          <option value="Auto">Auto</option>
          <option value="A pie">A pie</option>
        </select>
      </div>

      ***REMOVED***/* Información adicional */***REMOVED***
      <div className="p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700 flex items-start">
          <AlertCircle size=***REMOVED***16***REMOVED*** className="mr-2 mt-0.5 flex-shrink-0" />
          Las ganancias, propinas y gastos se registrarán al crear cada turno de delivery
        </p>
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
          ***REMOVED***guardando ? 'Guardando...' : (trabajo ? 'Guardar Cambios' : 'Crear Trabajo')***REMOVED***
        </button>
      </div>
    </form>
  );
***REMOVED***;

export default TrabajoDeliveryForm;