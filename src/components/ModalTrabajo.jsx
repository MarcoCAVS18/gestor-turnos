// src/components/ModalTrabajo.jsx 

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** X, Briefcase, DollarSign, Palette, FileText ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import Button from './ui/Button';
const ModalTrabajo = (***REMOVED*** visible, onClose, trabajoSeleccionado ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** agregarTrabajo, editarTrabajo, coloresTemáticos ***REMOVED*** = useApp();
  
  // Estados del formulario
  const [formData, setFormData] = useState(***REMOVED***
    nombre: '',
    descripcion: '',
    color: '#EC4899',
    tarifaBase: '',
    tarifas: ***REMOVED***
      diurno: '',
      tarde: '',
      noche: '',
      sabado: '',
      domingo: ''
    ***REMOVED***
  ***REMOVED***);
  
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  // Colores predefinidos para selección rápida
  const coloresPredefinidos = [
    '#EC4899', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B',
    '#EF4444', '#6366F1', '#84CC16', '#F97316', '#06B6D4'
  ];

  // Efecto para cargar datos del trabajo seleccionado
  useEffect(() => ***REMOVED***
    if (trabajoSeleccionado) ***REMOVED***
      setFormData(***REMOVED***
        nombre: trabajoSeleccionado.nombre || '',
        descripcion: trabajoSeleccionado.descripcion || '',
        color: trabajoSeleccionado.color || '#EC4899',
        tarifaBase: trabajoSeleccionado.tarifaBase?.toString() || '',
        tarifas: ***REMOVED***
          diurno: trabajoSeleccionado.tarifas?.diurno?.toString() || '',
          tarde: trabajoSeleccionado.tarifas?.tarde?.toString() || '',
          noche: trabajoSeleccionado.tarifas?.noche?.toString() || '',
          sabado: trabajoSeleccionado.tarifas?.sabado?.toString() || '',
          domingo: trabajoSeleccionado.tarifas?.domingo?.toString() || ''
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED*** else ***REMOVED***
      // Resetear formulario para nuevo trabajo
      setFormData(***REMOVED***
        nombre: '',
        descripcion: '',
        color: '#EC4899',
        tarifaBase: '',
        tarifas: ***REMOVED***
          diurno: '',
          tarde: '',
          noche: '',
          sabado: '',
          domingo: ''
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***
    setError('');
  ***REMOVED***, [trabajoSeleccionado, visible]);

  // Manejar cambios en inputs básicos
  const handleInputChange = (field, value) => ***REMOVED***
    setFormData(prev => (***REMOVED***
      ...prev,
      [field]: value
    ***REMOVED***));
    setError('');
  ***REMOVED***;

  // Manejar cambios en tarifas
  const handleTarifaChange = (tipo, value) => ***REMOVED***
    setFormData(prev => (***REMOVED***
      ...prev,
      tarifas: ***REMOVED***
        ...prev.tarifas,
        [tipo]: value
      ***REMOVED***
    ***REMOVED***));
    setError('');
  ***REMOVED***;

  // Validar formulario
  const validarFormulario = () => ***REMOVED***
    if (!formData.nombre.trim()) ***REMOVED***
      setError('El nombre de la empresa es requerido');
      return false;
    ***REMOVED***
    if (!formData.tarifaBase || parseFloat(formData.tarifaBase) <= 0) ***REMOVED***
      setError('La tarifa base debe ser mayor a 0');
      return false;
    ***REMOVED***
    
    // Validar que todas las tarifas sean números positivos
    const tarifasValidas = Object.entries(formData.tarifas).every(([tipo, tarifa]) => ***REMOVED***
      if (!tarifa || tarifa.trim() === '') ***REMOVED***
        setError(`La tarifa $***REMOVED***tipo***REMOVED*** es requerida`);
        return false;
      ***REMOVED***
      if (parseFloat(tarifa) <= 0) ***REMOVED***
        setError(`La tarifa $***REMOVED***tipo***REMOVED*** debe ser mayor a 0`);
        return false;
      ***REMOVED***
      return true;
    ***REMOVED***);
    
    return tarifasValidas;
  ***REMOVED***;

  // Manejar envío del formulario
  const handleSubmit = async (e) => ***REMOVED***
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    setCargando(true);
    setError('');
    
    try ***REMOVED***
      const datosCompletos = ***REMOVED***
        ...formData,
        tarifaBase: parseFloat(formData.tarifaBase),
        tarifas: ***REMOVED***
          diurno: parseFloat(formData.tarifas.diurno),
          tarde: parseFloat(formData.tarifas.tarde),
          noche: parseFloat(formData.tarifas.noche),
          sabado: parseFloat(formData.tarifas.sabado),
          domingo: parseFloat(formData.tarifas.domingo)
        ***REMOVED***
      ***REMOVED***;
      
      if (trabajoSeleccionado) ***REMOVED***
        // Editar trabajo existente
        await editarTrabajo(trabajoSeleccionado.id, datosCompletos);
      ***REMOVED*** else ***REMOVED***
        // Crear nuevo trabajo
        await agregarTrabajo(datosCompletos);
      ***REMOVED***
      
      onClose();
    ***REMOVED*** catch (err) ***REMOVED***
      setError(err.message || 'Error al guardar el trabajo');
    ***REMOVED*** finally ***REMOVED***
      setCargando(false);
    ***REMOVED***
  ***REMOVED***;

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-xl border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              ***REMOVED***trabajoSeleccionado ? 'Editar Trabajo' : 'Nuevo Trabajo'***REMOVED***
            </h2>
            <button
              onClick=***REMOVED***onClose***REMOVED***
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size=***REMOVED***24***REMOVED*** />
            </button>
          </div>
        </div>

        <form onSubmit=***REMOVED***handleSubmit***REMOVED*** className="p-6 space-y-6">
          ***REMOVED***/* Nombre de la empresa */***REMOVED***
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Briefcase size=***REMOVED***16***REMOVED*** className="inline mr-2" />
              Nombre de la empresa *
            </label>
            <input
              type="text"
              value=***REMOVED***formData.nombre***REMOVED***
              onChange=***REMOVED***(e) => handleInputChange('nombre', e.target.value)***REMOVED***
              placeholder="Ej: Tech Company Inc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors"
              style=***REMOVED******REMOVED*** 
                focusRingColor: coloresTemáticos?.base || '#EC4899',
                borderColor: formData.nombre ? coloresTemáticos?.base || '#EC4899' : undefined
              ***REMOVED******REMOVED***
              required
            />
          </div>

          ***REMOVED***/* Color */***REMOVED***
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Palette size=***REMOVED***16***REMOVED*** className="inline mr-2" />
              Color del trabajo
            </label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                ***REMOVED***coloresPredefinidos.map(color => (
                  <button
                    key=***REMOVED***color***REMOVED***
                    type="button"
                    onClick=***REMOVED***() => handleInputChange('color', color)***REMOVED***
                    className=***REMOVED***`w-8 h-8 rounded-full border-2 transition-all $***REMOVED***
                      formData.color === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                    ***REMOVED***`***REMOVED***
                    style=***REMOVED******REMOVED*** backgroundColor: color ***REMOVED******REMOVED***
                  />
                ))***REMOVED***
              </div>
              <input
                type="color"
                value=***REMOVED***formData.color***REMOVED***
                onChange=***REMOVED***(e) => handleInputChange('color', e.target.value)***REMOVED***
                className="w-16 h-8 border border-gray-300 rounded cursor-pointer"
              />
            </div>
          </div>

          ***REMOVED***/* Tarifa base */***REMOVED***
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign size=***REMOVED***16***REMOVED*** className="inline mr-2" />
              Tarifa base por hora *
            </label>
            <input
              type="number"
              value=***REMOVED***formData.tarifaBase***REMOVED***
              onChange=***REMOVED***(e) => handleInputChange('tarifaBase', e.target.value)***REMOVED***
              placeholder="15.00"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors"
              style=***REMOVED******REMOVED*** 
                focusRingColor: coloresTemáticos?.base || '#EC4899',
                borderColor: formData.tarifaBase ? coloresTemáticos?.base || '#EC4899' : undefined
              ***REMOVED******REMOVED***
              required
            />
          </div>

          ***REMOVED***/* Tarifas específicas */***REMOVED***
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tarifas por tipo de turno *
            </label>
            <div className="grid grid-cols-2 gap-4">
              ***REMOVED***Object.entries(***REMOVED***
                diurno: 'Diurno',
                tarde: 'Tarde', 
                noche: 'Nocturno',
                sabado: 'Sábado',
                domingo: 'Domingo'
              ***REMOVED***).map(([tipo, label]) => (
                <div key=***REMOVED***tipo***REMOVED***>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    ***REMOVED***label***REMOVED***
                  </label>
                  <input
                    type="number"
                    value=***REMOVED***formData.tarifas[tipo]***REMOVED***
                    onChange=***REMOVED***(e) => handleTarifaChange(tipo, e.target.value)***REMOVED***
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors text-sm"
                    style=***REMOVED******REMOVED*** 
                      focusRingColor: coloresTemáticos?.base || '#EC4899',
                      borderColor: formData.tarifas[tipo] ? coloresTemáticos?.base || '#EC4899' : undefined
                    ***REMOVED******REMOVED***
                    required
                  />
                </div>
              ))***REMOVED***
            </div>
          </div>

          ***REMOVED***/* Descripción */***REMOVED***
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText size=***REMOVED***16***REMOVED*** className="inline mr-2" />
              Descripción (opcional)
            </label>
            <textarea
              value=***REMOVED***formData.descripcion***REMOVED***
              onChange=***REMOVED***(e) => handleInputChange('descripcion', e.target.value)***REMOVED***
              placeholder="Detalles adicionales sobre este trabajo..."
              rows=***REMOVED***3***REMOVED***
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors resize-none"
              style=***REMOVED******REMOVED*** 
                focusRingColor: coloresTemáticos?.base || '#EC4899',
                borderColor: formData.descripcion ? coloresTemáticos?.base || '#EC4899' : undefined
              ***REMOVED******REMOVED***
            />
          </div>

          ***REMOVED***/* Error */***REMOVED***
          ***REMOVED***error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">***REMOVED***error***REMOVED***</p>
            </div>
          )***REMOVED***

          ***REMOVED***/* Botones */***REMOVED***
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick=***REMOVED***onClose***REMOVED***
              variant="outline"
              className="flex-1"
              disabled=***REMOVED***cargando***REMOVED***
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled=***REMOVED***cargando***REMOVED***
            >
              ***REMOVED***cargando 
                ? (trabajoSeleccionado ? 'Guardando...' : 'Creando...') 
                : (trabajoSeleccionado ? 'Guardar Cambios' : 'Crear Trabajo')
              ***REMOVED***
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
***REMOVED***;

export default ModalTrabajo;