// src/components/settings/SmokoSection/index.jsx - SIMPLIFICADO

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

  // Detectar cambios
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
    return `${horas}h ${minutosRestantes}min`;
  };

  return (
    <SettingsSection
      icon={Coffee}
      title="Smoko (Descansos)"
    >
      <div className="space-y-6">
        {/* Información explicativa */}
        <div 
          className="p-3 rounded-lg"
          style={{ backgroundColor: colors.transparent5 }}
        >
          <p className="text-sm" style={{ color: colors.primary }}>
            <strong>¿Qué es esto?</strong> Configura el tiempo de descanso no pagado 
            que se descontará automáticamente de tus turnos para obtener cálculos más precisos.
          </p>
        </div>

        {/* Toggle principal */}
        <Flex variant="between">
          <div className="flex-1">
            <p className="font-medium">Habilitar descuento de descansos</p>
            <p className="text-sm text-gray-500">
              Los turnos se calcularán descontando el tiempo de descanso
            </p>
          </div>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => handleToggle(e.target.checked)}
              className="rounded w-4 h-4 mr-2"
              style={{ accentColor: colors.primary }}
            />
          </label>
        </Flex>

        {/* Configuración de minutos - Solo visible si está habilitado */}
        {enabled && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Duración del descanso
              </label>

              {/* Botones rápidos con input personalizado */}
              <div className="grid grid-cols-4 gap-2">
                {[15, 30, 45].map(min => (
                  <button
                    key={min}
                    type="button"
                    onClick={() => handleMinutesChange(min)}
                    className={`
                      px-3 py-2 text-sm rounded-lg border transition-colors
                      ${minutes === min
                        ? 'border-2 text-white'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }
                    `}
                    style={{
                      backgroundColor: minutes === min ? colors.primary : 'transparent',
                      borderColor: minutes === min ? colors.primary : '#D1D5DB'
                    }}
                  >
                    {formatearTiempo(min)}
                  </button>
                ))}

                {/* Input personalizado integrado con sufijo "min" */}
                <div className="relative">
                  <input
                    type="number"
                    value={minutes}
                    onChange={(e) => handleMinutesChange(e.target.value)}
                    className="w-full px-3 py-2 pr-10 text-sm text-center border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                    style={{ '--tw-ring-color': colors.primary }}
                    min="5"
                    max="120"
                    placeholder="30"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
                    min
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botón de guardar - Solo si hay cambios */}
        {hasChanges && (
          <div className="pt-4 border-t border-gray-200">
            <Button
              onClick={handleGuardar}
              disabled={guardando}
              loading={guardando}
              icon={Save}
              className="w-full"
              themeColor={colors.primary}
            >
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        )}

        {/* Información adicional */}
        <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-100">
          <p>• El descanso se aplicará automáticamente a todos tus turnos</p>
          <p>• Podrás desactivar el descanso en turnos específicos si no lo tomaste</p>
        </div>
      </div>
    </SettingsSection>
  );
};

export default SmokoSection;