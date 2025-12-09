// src/components/settings/SmokoSection/index.jsx -

import React, { useState, useEffect } from 'react';
import { Coffee, Save } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';
import Flex from '../../ui/Flex';

const SmokoSection = ({ onError, onSuccess }) => {
  const { 
    smokoEnabled = false, 
    smokoMinutes = 30,
    savePreferences 
  } = useApp();
  
  const colors = useThemeColors();
  const [enabled, setEnabled] = useState(smokoEnabled);
  const [minutes, setMinutes] = useState(smokoMinutes);
  const [guardando, setGuardando] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setEnabled(smokoEnabled);
    setMinutes(smokoMinutes);
  }, [smokoEnabled, smokoMinutes]);

  useEffect(() => {
    const cambiosDetectados = enabled !== smokoEnabled || minutes !== smokoMinutes;
    setHasChanges(cambiosDetectados);
  }, [enabled, minutes, smokoEnabled, smokoMinutes]);

  const handleToggle = (newEnabled) => {
    setEnabled(newEnabled);
  };

  const handleMinutesChange = (newMinutes) => {
    setMinutes(Math.max(5, Math.min(120, parseInt(newMinutes) || 0)));
  };

  const handleGuardar = async () => {
    try {
      setGuardando(true);
      await savePreferences({ 
        smokoEnabled: enabled,
        smokoMinutes: enabled ? minutes : 0
      });
      onSuccess?.('Configuración de descansos guardada correctamente');
    } catch (error) {
      onError?.('Error al guardar configuración de descansos: ' + error.message);
    } finally {
      setGuardando(false);
    }
  };

  const formatearTiempo = (mins) => {
    if (mins < 60) return `${mins} min`;
    const horas = Math.floor(mins / 60);
    const minutosRestantes = mins % 60;
    if (minutosRestantes === 0) return `${horas}h`;
    return `${horas}h ${minutosRestantes}m`;
  };

  return (
    <SettingsSection
      icon={Coffee}
      title="Smoko (Descansos)"
    >
      <div className="space-y-6">
        <div 
          className="p-3 rounded-lg"
          style={{ backgroundColor: colors.transparent5 }}
        >
          <p className="text-sm" style={{ color: colors.primary }}>
            <strong>¿Qué es esto?</strong> Configura el tiempo de descanso no pagado 
            que se descontará automáticamente de tus turnos.
          </p>
        </div>

        <Flex variant="between">
          <div className="flex-1 pr-4">
            <p className="font-medium text-gray-900">Habilitar descuento</p>
            <p className="text-sm text-gray-500">
              Descontar tiempo de descanso automáticamente
            </p>
          </div>
          <label className="flex items-center cursor-pointer relative">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => handleToggle(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
          </label>
        </Flex>

        {enabled && (
          <div className="space-y-4 pt-4 border-t border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Duración del descanso
              </label>

              {/* GRID RESPONSIVO: 2 columnas en móvil, 4 en desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[15, 30, 45].map(min => (
                  <button
                    key={min}
                    type="button"
                    onClick={() => handleMinutesChange(min)}
                    // h-12 fija la altura para igualar al input
                    className={`
                      relative h-12 w-full text-sm font-medium rounded-lg border transition-all
                      flex items-center justify-center
                      ${minutes === min
                        ? 'border-2 text-white shadow-sm'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                    style={{
                      backgroundColor: minutes === min ? colors.primary : 'transparent',
                      borderColor: minutes === min ? colors.primary : undefined
                    }}
                  >
                    {formatearTiempo(min)}
                  </button>
                ))}

                {/* INPUT PERSONALIZADO */}
                <div className="relative h-12 w-full">
                  <input
                    type="number"
                    value={minutes}
                    onChange={(e) => handleMinutesChange(e.target.value)}
                    // pb-4 levanta el texto del input para dejar espacio a "min" abajo
                    className="block w-full h-full px-2 pt-1 pb-4 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors bg-white font-medium text-gray-900"
                    style={{ 
                      borderColor: [15, 30, 45].includes(minutes) ? '#E5E7EB' : colors.primary,
                      '--tw-ring-color': colors.primary 
                    }}
                    min="5"
                    max="120"
                    placeholder="--"
                  />
                  {/* Etiqueta "min" en la parte inferior */}
                  <span className="absolute bottom-1.5 left-0 right-0 text-[10px] font-medium text-gray-400 text-center pointer-events-none uppercase tracking-wide">
                    min
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {hasChanges && (
          <div className="pt-4 border-t border-gray-200">
            <Button
              onClick={handleGuardar}
              disabled={guardando}
              loading={guardando}
              icon={Save}
              className="w-full sm:w-auto" // Botón full width en móvil
              themeColor={colors.primary}
            >
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        )}
      </div>
    </SettingsSection>
  );
};

export default SmokoSection;