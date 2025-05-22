// src/components/ModalTrabajo.jsx 

import React, { useState, useEffect } from 'react';
import { X, Briefcase, DollarSign, Palette, FileText } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import DynamicButton from './DynamicButton';

const ModalTrabajo = ({ visible, onClose, trabajoSeleccionado }) => {
  const { agregarTrabajo, editarTrabajo, coloresTemáticos } = useApp();
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    color: '#EC4899',
    tarifaBase: '',
    tarifas: {
      diurno: '',
      tarde: '',
      noche: '',
      sabado: '',
      domingo: ''
    }
  });
  
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  // Colores predefinidos para selección rápida
  const coloresPredefinidos = [
    '#EC4899', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B',
    '#EF4444', '#6366F1', '#84CC16', '#F97316', '#06B6D4'
  ];

  // Efecto para cargar datos del trabajo seleccionado
  useEffect(() => {
    if (trabajoSeleccionado) {
      setFormData({
        nombre: trabajoSeleccionado.nombre || '',
        descripcion: trabajoSeleccionado.descripcion || '',
        color: trabajoSeleccionado.color || '#EC4899',
        tarifaBase: trabajoSeleccionado.tarifaBase?.toString() || '',
        tarifas: {
          diurno: trabajoSeleccionado.tarifas?.diurno?.toString() || '',
          tarde: trabajoSeleccionado.tarifas?.tarde?.toString() || '',
          noche: trabajoSeleccionado.tarifas?.noche?.toString() || '',
          sabado: trabajoSeleccionado.tarifas?.sabado?.toString() || '',
          domingo: trabajoSeleccionado.tarifas?.domingo?.toString() || ''
        }
      });
    } else {
      // Resetear formulario para nuevo trabajo
      setFormData({
        nombre: '',
        descripcion: '',
        color: '#EC4899',
        tarifaBase: '',
        tarifas: {
          diurno: '',
          tarde: '',
          noche: '',
          sabado: '',
          domingo: ''
        }
      });
    }
    setError('');
  }, [trabajoSeleccionado, visible]);

  // Manejar cambios en inputs básicos
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  // Manejar cambios en tarifas
  const handleTarifaChange = (tipo, value) => {
    setFormData(prev => ({
      ...prev,
      tarifas: {
        ...prev.tarifas,
        [tipo]: value
      }
    }));
    setError('');
  };

  // Validar formulario
  const validarFormulario = () => {
    if (!formData.nombre.trim()) {
      setError('El nombre de la empresa es requerido');
      return false;
    }
    if (!formData.tarifaBase || parseFloat(formData.tarifaBase) <= 0) {
      setError('La tarifa base debe ser mayor a 0');
      return false;
    }
    
    // Validar que todas las tarifas sean números positivos
    const tarifasValidas = Object.entries(formData.tarifas).every(([tipo, tarifa]) => {
      if (!tarifa || tarifa.trim() === '') {
        setError(`La tarifa ${tipo} es requerida`);
        return false;
      }
      if (parseFloat(tarifa) <= 0) {
        setError(`La tarifa ${tipo} debe ser mayor a 0`);
        return false;
      }
      return true;
    });
    
    return tarifasValidas;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    setCargando(true);
    setError('');
    
    try {
      const datosCompletos = {
        ...formData,
        tarifaBase: parseFloat(formData.tarifaBase),
        tarifas: {
          diurno: parseFloat(formData.tarifas.diurno),
          tarde: parseFloat(formData.tarifas.tarde),
          noche: parseFloat(formData.tarifas.noche),
          sabado: parseFloat(formData.tarifas.sabado),
          domingo: parseFloat(formData.tarifas.domingo)
        }
      };
      
      if (trabajoSeleccionado) {
        // Editar trabajo existente
        await editarTrabajo(trabajoSeleccionado.id, datosCompletos);
      } else {
        // Crear nuevo trabajo
        await agregarTrabajo(datosCompletos);
      }
      
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar el trabajo');
    } finally {
      setCargando(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-xl border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {trabajoSeleccionado ? 'Editar Trabajo' : 'Nuevo Trabajo'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nombre de la empresa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Briefcase size={16} className="inline mr-2" />
              Nombre de la empresa *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              placeholder="Ej: Tech Company Inc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors"
              style={{ 
                focusRingColor: coloresTemáticos?.base || '#EC4899',
                borderColor: formData.nombre ? coloresTemáticos?.base || '#EC4899' : undefined
              }}
              required
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Palette size={16} className="inline mr-2" />
              Color del trabajo
            </label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {coloresPredefinidos.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleInputChange('color', color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.color === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                className="w-16 h-8 border border-gray-300 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Tarifa base */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign size={16} className="inline mr-2" />
              Tarifa base por hora *
            </label>
            <input
              type="number"
              value={formData.tarifaBase}
              onChange={(e) => handleInputChange('tarifaBase', e.target.value)}
              placeholder="15.00"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors"
              style={{ 
                focusRingColor: coloresTemáticos?.base || '#EC4899',
                borderColor: formData.tarifaBase ? coloresTemáticos?.base || '#EC4899' : undefined
              }}
              required
            />
          </div>

          {/* Tarifas específicas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tarifas por tipo de turno *
            </label>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries({
                diurno: 'Diurno',
                tarde: 'Tarde', 
                noche: 'Nocturno',
                sabado: 'Sábado',
                domingo: 'Domingo'
              }).map(([tipo, label]) => (
                <div key={tipo}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {label}
                  </label>
                  <input
                    type="number"
                    value={formData.tarifas[tipo]}
                    onChange={(e) => handleTarifaChange(tipo, e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors text-sm"
                    style={{ 
                      focusRingColor: coloresTemáticos?.base || '#EC4899',
                      borderColor: formData.tarifas[tipo] ? coloresTemáticos?.base || '#EC4899' : undefined
                    }}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText size={16} className="inline mr-2" />
              Descripción (opcional)
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              placeholder="Detalles adicionales sobre este trabajo..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors resize-none"
              style={{ 
                focusRingColor: coloresTemáticos?.base || '#EC4899',
                borderColor: formData.descripcion ? coloresTemáticos?.base || '#EC4899' : undefined
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <DynamicButton
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={cargando}
            >
              Cancelar
            </DynamicButton>
            <DynamicButton
              type="submit"
              className="flex-1"
              disabled={cargando}
            >
              {cargando 
                ? (trabajoSeleccionado ? 'Guardando...' : 'Creando...') 
                : (trabajoSeleccionado ? 'Guardar Cambios' : 'Crear Trabajo')
              }
            </DynamicButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalTrabajo;