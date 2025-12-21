// src/components/settings/TurnRangeSection/index.jsx

import React, { useState, useEffect } from 'react';
import { Clock, Sun, Sunset, Moon, Check } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';

const TimeSelect = ({ label, value, onChange, icon: Icon, iconColor, colors }) => {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1 flex items-center">
        {Icon && <Icon className="h-4 w-4 mr-1" style={{ color: iconColor }} />}
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 transition-colors"
        style={{ 
          '--tw-ring-color': colors.primary
        }}
      >
        {Array.from({length: 24}, (_, i) => (
          <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
        ))}
      </select>
    </div>
  );
};

const TurnRange = ({ title, icon: Icon, iconColor, children, colors }) => {
  return (
    <div 
      className="border rounded-lg p-4"
      style={{ borderColor: colors.transparent20 }}
    >
      <div className="flex items-center mb-3">
        <Icon className="h-5 w-5 mr-2" style={{ color: iconColor }} />
        <h3 className="font-medium">{title}</h3>
      </div>
      {children}
    </div>
  );
};

const TurnRangeSection = ({ onError, onSuccess, className }) => {
  const { 
    shiftRanges,
    savePreferences
  } = useApp();
  
  const colors = useThemeColors();
  const [rangosTurnos, setRangosTurnos] = useState(shiftRanges || {
    dayStart: 6,
    dayEnd: 14,
    afternoonStart: 14,
    afternoonEnd: 20,
    nightStart: 20
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (shiftRanges) {
      setRangosTurnos(shiftRanges);
    }
  }, [shiftRanges]);

  // Detectar cambios para habilitar/deshabilitar el botón
  useEffect(() => {
    if (!shiftRanges) return;
    
    const hasChanged = 
      rangosTurnos.dayStart !== shiftRanges.dayStart ||
      rangosTurnos.dayEnd !== shiftRanges.dayEnd ||
      rangosTurnos.afternoonStart !== shiftRanges.afternoonStart ||
      rangosTurnos.afternoonEnd !== shiftRanges.afternoonEnd ||
      rangosTurnos.nightStart !== shiftRanges.nightStart;
    
    setHasChanges(hasChanged);
    
    // Ocultar el ícono de éxito si hay cambios nuevos
    if (hasChanged && showSuccess) {
      setShowSuccess(false);
    }
  }, [rangosTurnos, shiftRanges, showSuccess]);

  const validarRangos = (rangos) => {
    if (rangos.dayStart >= rangos.dayEnd) {
      return 'La hora de inicio del turno diurno debe ser menor a la hora de fin';
    }
    if (rangos.afternoonStart >= rangos.afternoonEnd) {
      return 'La hora de inicio del turno de tarde debe ser menor a la hora de fin';
    }
    if (rangos.dayEnd > rangos.afternoonStart) {
      return 'El turno de tarde debe comenzar después o al mismo tiempo que termina el diurno';
    }
    if (rangos.afternoonEnd > rangos.nightStart) {
      return 'El turno de noche debe comenzar después o al mismo tiempo que termina la tarde';
    }
    return null;
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      const errorValidacion = validarRangos(rangosTurnos);
      if (errorValidacion) {
        onError?.(errorValidacion);
        return;
      }
      
      await savePreferences({ rangosTurnos });
      
      // Mostrar éxito y ocultar después de un tiempo
      setShowSuccess(true);
      setHasChanges(false);
      onSuccess?.('Rangos de turnos guardados correctamente.');
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      
    } catch (error) {
      onError?.('Error al guardar rangos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función helper para actualizar rangos
  const updateRange = (key, value) => {
    setRangosTurnos(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <SettingsSection icon={Clock} title="Rangos de Turnos" className={className}>
      <p className="text-sm text-gray-600 mb-4">
        Configura los rangos de horarios para la detección automática de tipos de turno.
        Los tags de turnos existentes se actualizarán automáticamente.
      </p>
      
      <div className="space-y-4 mb-6">
        {/* Turno Diurno */}
        <TurnRange title="Turno Diurno" icon={Sun} iconColor="#F59E0B" colors={colors}>
          <div className="grid grid-cols-2 gap-4">
            <TimeSelect
              label="Hora de inicio"
              value={rangosTurnos.dayStart}
              onChange={(value) => updateRange('dayStart', value)}
              colors={colors}
            />
            <TimeSelect
              label="Hora de fin"
              value={rangosTurnos.dayEnd}
              onChange={(value) => updateRange('dayEnd', value)}
              colors={colors}
            />
          </div>
        </TurnRange>
        
        {/* Turno Tarde */}
        <TurnRange title="Turno Tarde" icon={Sunset} iconColor="#F97316" colors={colors}>
          <div className="grid grid-cols-2 gap-4">
            <TimeSelect
              label="Hora de inicio"
              value={rangosTurnos.afternoonStart}
              onChange={(value) => updateRange('afternoonStart', value)}
              colors={colors}
            />
            <TimeSelect
              label="Hora de fin"
              value={rangosTurnos.afternoonEnd}
              onChange={(value) => updateRange('afternoonEnd', value)}
              colors={colors}
            />
          </div>
        </TurnRange>
        
        {/* Turno Noche */}
        <TurnRange title="Turno Noche" icon={Moon} iconColor="#6366F1" colors={colors}>
          <TimeSelect
            label="Hora de inicio"
            value={rangosTurnos.nightStart}
            onChange={(value) => updateRange('nightStart', value)}
            colors={colors}
          />
          <p className="text-xs text-gray-500 mt-1">
            El turno de noche se extiende hasta el final del día
          </p>
        </TurnRange>
      </div>

      <Button
        onClick={handleSave}
        disabled={loading || !hasChanges}
        loading={loading}
        className="w-full relative"
        themeColor={colors.primary}
        icon={showSuccess ? Check : undefined}
      >
        {loading ? 'Guardando...' : 
         showSuccess ? 'Guardado correctamente' :
         hasChanges ? 'Guardar rangos de turnos' : 'Sin cambios'}
      </Button>
    </SettingsSection>
  );
};

export default TurnRangeSection;