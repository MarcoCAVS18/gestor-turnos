// src/components/settings/TurnRangeSection/index.jsx

import React, { useState, useEffect } from 'react';
import { Clock, Sun, Sunset, Moon } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';

const TimeSelect = ({ label, value, onChange, icon: Icon, iconColor }) => {
  const { thematicColors } = useApp();
  
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1 flex items-center">
        {Icon && <Icon className="h-4 w-4 mr-1" style={{ color: iconColor }} />}
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
        style={{ 
          '--tw-ring-color': thematicColors?.base || '#EC4899'
        }}
      >
        {Array.from({length: 24}, (_, i) => (
          <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
        ))}
      </select>
    </div>
  );
};

const TurnRange = ({ title, icon: Icon, iconColor, children }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center mb-3">
        <Icon className="h-5 w-5 mr-2" style={{ color: iconColor }} />
        <h3 className="font-medium">{title}</h3>
      </div>
      {children}
    </div>
  );
};

const TurnRangeSection = ({ onError, onSuccess }) => {
  const { 
    rangosTurnos: appRangos, 
    guardarPreferencias 
  } = useApp();
  
  const [rangosTurnos, setRangosTurnos] = useState(appRangos || {
    diurnoInicio: 6,
    diurnoFin: 14,
    tardeInicio: 14,
    tardeFin: 20,
    nocheInicio: 20
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (appRangos) {
      setRangosTurnos(appRangos);
    }
  }, [appRangos]);

  const validarRangos = (rangos) => {
    if (rangos.diurnoInicio >= rangos.diurnoFin) {
      return 'La hora de inicio del turno diurno debe ser menor a la hora de fin';
    }
    if (rangos.tardeInicio >= rangos.tardeFin) {
      return 'La hora de inicio del turno de tarde debe ser menor a la hora de fin';
    }
    if (rangos.diurnoFin > rangos.tardeInicio) {
      return 'El turno de tarde debe comenzar después o al mismo tiempo que termina el diurno';
    }
    if (rangos.tardeFin > rangos.nocheInicio) {
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
      
      await guardarPreferencias({ rangosTurnos });
      onSuccess?.('Rangos de turnos guardados correctamente');
    } catch (error) {
      onError?.('Error al guardar rangos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsSection icon={Clock} title="Rangos de Turnos">
      <p className="text-sm text-gray-600 mb-4">
        Configura los rangos de horarios para la detección automática de tipos de turno.
      </p>
      
      <div className="space-y-4 mb-6">
        {/* Turno Diurno */}
        <TurnRange title="Turno Diurno" icon={Sun} iconColor="#F59E0B">
          <div className="grid grid-cols-2 gap-4">
            <TimeSelect
              label="Hora de inicio"
              value={rangosTurnos.diurnoInicio}
              onChange={(value) => setRangosTurnos({
                ...rangosTurnos,
                diurnoInicio: value
              })}
            />
            <TimeSelect
              label="Hora de fin"
              value={rangosTurnos.diurnoFin}
              onChange={(value) => setRangosTurnos({
                ...rangosTurnos,
                diurnoFin: value
              })}
            />
          </div>
        </TurnRange>
        
        {/* Turno Tarde */}
        <TurnRange title="Turno Tarde" icon={Sunset} iconColor="#F97316">
          <div className="grid grid-cols-2 gap-4">
            <TimeSelect
              label="Hora de inicio"
              value={rangosTurnos.tardeInicio}
              onChange={(value) => setRangosTurnos({
                ...rangosTurnos,
                tardeInicio: value
              })}
            />
            <TimeSelect
              label="Hora de fin"
              value={rangosTurnos.tardeFin}
              onChange={(value) => setRangosTurnos({
                ...rangosTurnos,
                tardeFin: value
              })}
            />
          </div>
        </TurnRange>
        
        {/* Turno Noche */}
        <TurnRange title="Turno Noche" icon={Moon} iconColor="#6366F1">
          <TimeSelect
            label="Hora de inicio"
            value={rangosTurnos.nocheInicio}
            onChange={(value) => setRangosTurnos({
              ...rangosTurnos,
              nocheInicio: value
            })}
          />
          <p className="text-xs text-gray-500 mt-1">
            El turno de noche se extiende hasta el final del día
          </p>
        </TurnRange>
      </div>

      <Button
        onClick={handleSave}
        disabled={loading}
        loading={loading}
        className="w-full"
      >
        Guardar rangos de turnos
      </Button>
    </SettingsSection>
  );
};

export default TurnRangeSection;