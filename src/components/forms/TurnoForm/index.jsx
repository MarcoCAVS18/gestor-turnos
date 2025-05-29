import React, { useState, useEffect } from 'react';
import { Calendar, Clock, FileText } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useFormValidation } from '../../../hooks/useFormValidation';
import { VALIDATION_RULES } from '../../../constants/validation';
import Input from '../../ui/Input';
import Button from '../../ui/Button';

const TurnoForm = ({ turno, fechaInicial, onSubmit, onCancel, loading }) => {
  const { trabajos } = useApp();
  
  const [formData, setFormData] = useState({
    trabajoId: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    notas: ''
  });

  const validationRules = {
    trabajoId: [VALIDATION_RULES.required],
    fecha: [VALIDATION_RULES.required, VALIDATION_RULES.dateFormat],
    horaInicio: [VALIDATION_RULES.required, VALIDATION_RULES.timeFormat],
    horaFin: [VALIDATION_RULES.required, VALIDATION_RULES.timeFormat]
  };

  const { errors, validateForm, handleFieldChange } = useFormValidation(validationRules);

  useEffect(() => {
    if (turno) {
      setFormData({
        trabajoId: turno.trabajoId || '',
        fecha: turno.fecha || '',
        horaInicio: turno.horaInicio || '',
        horaFin: turno.horaFin || '',
        notas: turno.notas || ''
      });
    } else {
      setFormData({
        trabajoId: '',
        fecha: fechaInicial || '',
        horaInicio: '',
        horaFin: '',
        notas: ''
      });
    }
  }, [turno, fechaInicial]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    handleFieldChange(field, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm(formData)) return;

    // Validación adicional de horarios
    const [horaIni, minIni] = formData.horaInicio.split(':').map(Number);
    const [horaFin, minFin] = formData.horaFin.split(':').map(Number);
    
    const inicioMinutos = horaIni * 60 + minIni;
    let finMinutos = horaFin * 60 + minFin;
    
    if (finMinutos <= inicioMinutos) {
      if (finMinutos === inicioMinutos) {
        // Error: horas iguales
        return;
      }
      // OK: turno nocturno que cruza medianoche
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Selección de trabajo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Trabajo *
        </label>
        <select
          value={formData.trabajoId}
          onChange={(e) => handleInputChange('trabajoId', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors"
          required
        >
          <option value="">Selecciona un trabajo</option>
          {trabajos.map(trabajo => (
            <option key={trabajo.id} value={trabajo.id}>
              {trabajo.nombre}
            </option>
          ))}
        </select>
        {errors.trabajoId && (
          <p className="mt-1 text-sm text-red-600">{errors.trabajoId}</p>
        )}
      </div>

      {/* Fecha */}
      <Input
        label="Fecha"
        icon={Calendar}
        type="date"
        value={formData.fecha}
        onChange={(e) => handleInputChange('fecha', e.target.value)}
        error={errors.fecha}
        required
      />

      {/* Horarios */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Hora Inicio"
          icon={Clock}
          type="time"
          value={formData.horaInicio}
          onChange={(e) => handleInputChange('horaInicio', e.target.value)}
          error={errors.horaInicio}
          required
        />

        <Input
          label="Hora Fin"
          icon={Clock}
          type="time"
          value={formData.horaFin}
          onChange={(e) => handleInputChange('horaFin', e.target.value)}
          error={errors.horaFin}
          required
        />
      </div>

      {/* Notas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText size={16} className="inline mr-2" />
          Notas (opcional)
        </label>
        <textarea
          value={formData.notas}
          onChange={(e) => handleInputChange('notas', e.target.value)}
          placeholder="Agrega notas adicionales sobre este turno..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors resize-none"
        />
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="flex-1"
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1"
          loading={loading}
        >
          {turno ? 'Guardar Cambios' : 'Crear Turno'}
        </Button>
      </div>
    </form>
  );
};

export default TurnoForm;
