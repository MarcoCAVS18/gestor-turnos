// src/components/forms/TrabajoDeliveryForm/index.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** Truck, Clock ***REMOVED*** from 'lucide-react';
import ***REMOVED*** calculateShiftHours, formatHoursDecimal ***REMOVED*** from '../../../../utils/time';

const TrabajoDeliveryForm = (***REMOVED*** isOpen, onClose, onSubmit, trabajoId = null, initialData = null ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors, vehiculos = [], plataformasDelivery = [] ***REMOVED*** = useApp();
  
  const [formData, setFormData] = useState(***REMOVED***
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
  ***REMOVED***);

  const [errors, setErrors] = useState(***REMOVED******REMOVED***);

  // Calcular horas trabajadas usando utilidad centralizada
  const horasTrabajadas = formData.horaInicio && formData.horaFin
    ? calculateShiftHours(formData.horaInicio, formData.horaFin)
    : 0;

  useEffect(() => ***REMOVED***
    if (initialData) ***REMOVED***
      setFormData(***REMOVED***
        ...initialData,
        fecha: initialData.fecha || new Date().toISOString().split('T')[0]
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***, [initialData]);

  const validateForm = () => ***REMOVED***
    const newErrors = ***REMOVED******REMOVED***;
    
    if (!formData.horaInicio) newErrors.horaInicio = 'Requerido';
    if (!formData.horaFin) newErrors.horaFin = 'Requerido';
    if (!formData.plataforma) newErrors.plataforma = 'Selecciona una plataforma';
    if (!formData.vehiculo) newErrors.vehiculo = 'Selecciona un vehículo';
    if (formData.ganancia <= 0) newErrors.ganancia = 'Debe ser mayor a 0';
    
    if (formData.horaInicio && formData.horaFin && formData.horaInicio >= formData.horaFin) ***REMOVED***
      newErrors.horaFin = 'Debe ser posterior al inicio';
    ***REMOVED***

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  ***REMOVED***;

  const handleSubmit = (e) => ***REMOVED***
    e.preventDefault();
    
    if (!validateForm()) ***REMOVED***
      return;
    ***REMOVED***

    const turnoData = ***REMOVED***
      ...formData,
      id: trabajoId || Date.now().toString(),
      horasTrabajadas: horasTrabajadas,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    ***REMOVED***;

    onSubmit(turnoData);
    onClose();
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

  if (!isOpen) return null;

  return (
    <Flex variant="center" className="fixed inset-0 bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <Flex variant="between" className="mb-6">
            <h2 className="text-lg font-bold flex items-center">
              <Truck size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED*** className="mr-2" />
              ***REMOVED***trabajoId ? 'Editar' : 'Nuevo'***REMOVED*** Turno
            </h2>
            <button
              onClick=***REMOVED***onClose***REMOVED***
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </Flex>

          <form onSubmit=***REMOVED***handleSubmit***REMOVED*** className="space-y-4">
            ***REMOVED***/* Fecha */***REMOVED***
            <div>
              <label className="block text-sm font-medium mb-1">Fecha</label>
              <input
                type="date"
                value=***REMOVED***formData.fecha***REMOVED***
                onChange=***REMOVED***(e) => handleInputChange('fecha', e.target.value)***REMOVED***
                className="w-full p-2 border rounded-lg text-sm"
              />
            </div>

            ***REMOVED***/* Horarios */***REMOVED***
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1">Inicio</label>
                <input
                  type="time"
                  value=***REMOVED***formData.horaInicio***REMOVED***
                  onChange=***REMOVED***(e) => handleInputChange('horaInicio', e.target.value)***REMOVED***
                  className=***REMOVED***`w-full p-2 border rounded-lg text-sm $***REMOVED***errors.horaInicio ? 'border-red-500' : ''***REMOVED***`***REMOVED***
                />
                ***REMOVED***errors.horaInicio && <p className="text-red-500 text-xs">***REMOVED***errors.horaInicio***REMOVED***</p>***REMOVED***
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Fin</label>
                <input
                  type="time"
                  value=***REMOVED***formData.horaFin***REMOVED***
                  onChange=***REMOVED***(e) => handleInputChange('horaFin', e.target.value)***REMOVED***
                  className=***REMOVED***`w-full p-2 border rounded-lg text-sm $***REMOVED***errors.horaFin ? 'border-red-500' : ''***REMOVED***`***REMOVED***
                />
                ***REMOVED***errors.horaFin && <p className="text-red-500 text-xs">***REMOVED***errors.horaFin***REMOVED***</p>***REMOVED***
              </div>
            </div>

            ***REMOVED***/* Tiempo trabajado */***REMOVED***
            ***REMOVED***horasTrabajadas > 0 && (
              <Flex className="text-xs text-blue-600 bg-blue-50 p-2 rounded-lg">
                <Clock size=***REMOVED***14***REMOVED*** className="mr-1" />
                Tiempo: ***REMOVED***formatHoursDecimal(horasTrabajadas)***REMOVED***
              </Flex>
            )***REMOVED***
            
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
                ***REMOVED***plataformasDelivery.map(plataforma => (
                  <option key=***REMOVED***plataforma.id***REMOVED*** value=***REMOVED***plataforma.nombre***REMOVED***>
                    ***REMOVED***plataforma.nombre***REMOVED***
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
                ***REMOVED***vehiculos.map(vehiculo => (
                  <option key=***REMOVED***vehiculo.id***REMOVED*** value=***REMOVED***vehiculo.nombre***REMOVED***>
                    ***REMOVED***vehiculo.nombre***REMOVED***
                  </option>
                ))***REMOVED***
              </select>
              ***REMOVED***errors.vehiculo && <p className="text-red-500 text-xs mt-1">***REMOVED***errors.vehiculo***REMOVED***</p>***REMOVED***
            </div>
            
            ***REMOVED***/* Pedidos y Kilómetros */***REMOVED***
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1">Pedidos</label>
                <input
                  type="number"
                  min="1"
                  value=***REMOVED***formData.pedidos***REMOVED***
                  onChange=***REMOVED***(e) => handleInputChange('pedidos', parseInt(e.target.value) || 1)***REMOVED***
                  className="w-full p-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Km</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value=***REMOVED***formData.kilometros***REMOVED***
                  onChange=***REMOVED***(e) => handleInputChange('kilometros', parseFloat(e.target.value) || 0)***REMOVED***
                  className="w-full p-2 border rounded-lg text-sm"
                />
              </div>
            </div>

            ***REMOVED***/* Ganancia */***REMOVED***
            <div>
              <label className="block text-sm font-medium mb-1">💰 Ganancia *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value=***REMOVED***formData.ganancia***REMOVED***
                onChange=***REMOVED***(e) => handleInputChange('ganancia', parseFloat(e.target.value) || 0)***REMOVED***
                className=***REMOVED***`w-full p-2 border rounded-lg text-sm $***REMOVED***errors.ganancia ? 'border-red-500' : ''***REMOVED***`***REMOVED***
                placeholder="0.00"
              />
              ***REMOVED***errors.ganancia && <p className="text-red-500 text-xs mt-1">***REMOVED***errors.ganancia***REMOVED***</p>***REMOVED***
            </div>

            ***REMOVED***/* Propinas y Gastos */***REMOVED***
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1">Propinas</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value=***REMOVED***formData.propinas***REMOVED***
                  onChange=***REMOVED***(e) => handleInputChange('propinas', parseFloat(e.target.value) || 0)***REMOVED***
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
                  value=***REMOVED***formData.gastos***REMOVED***
                  onChange=***REMOVED***(e) => handleInputChange('gastos', parseFloat(e.target.value) || 0)***REMOVED***
                  className="w-full p-2 border rounded-lg text-sm"
                  placeholder="0.00"
                />
              </div>
            </div>

            ***REMOVED***/* Botones */***REMOVED***
            <div className="flex space-x-2 pt-4">
              <button
                type="button"
                onClick=***REMOVED***onClose***REMOVED***
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-4 text-white rounded-lg hover:opacity-90 text-sm"
                style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.base || '#3B82F6' ***REMOVED******REMOVED***
              >
                ***REMOVED***trabajoId ? 'Actualizar' : 'Guardar'***REMOVED***
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
***REMOVED***;

export default TrabajoDeliveryForm;