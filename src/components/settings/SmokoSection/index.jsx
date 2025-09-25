// src/components/settings/SmokoSection/index.jsx

import React, { useState, useEffect } from 'react';
import { Clock, Coffee, Save, X } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';
import New from '../../ui/New';

const SmokoSection = ({ onError, onSuccess }) => {
  const { 
    smokoEnabled = false, 
    smokoMinutes = 30,
    savePreferences 
  } = useApp();
  
  const colors = useThemeColors();
  const [editando, setEditando] = useState(false);
  const [enabled, setEnabled] = useState(smokoEnabled);
  const [minutes, setMinutes] = useState(smokoMinutes);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    setEnabled(smokoEnabled);
    setMinutes(smokoMinutes);
  }, [smokoEnabled, smokoMinutes]);

  const handleGuardar = async () => {
    try {
      setGuardando(true);
      
      await savePreferences({ 
        smokoEnabled: enabled,
        smokoMinutes: enabled ? minutes : 0
      });
      
      setEditando(false);
      onSuccess?.('Configuración de descansos guardada correctamente');
    } catch (error) {
      onError?.('Error al guardar configuración de descansos: ' + error.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleCancelar = () => {
    setEnabled(smokoEnabled);
    setMinutes(smokoMinutes);
    setEditando(false);
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
      title={
        <div className="flex items-center gap-2">
          <span>Smoko (Descansos)</span>
          <New size="xs">NUEVO</New>
        </div>
      }
    >
      <div className="space-y-4">
        <div 
          className="p-3 rounded-lg"
          style={{ backgroundColor: colors.transparent5 }}
        >
          <p className="text-sm" style={{ color: colors.primary }}>
            <strong>¿Qué es esto?</strong> Configura el tiempo de descanso no pagado 
            que se descontará automáticamente de tus turnos para obtener cálculos más precisos.
          </p>
        </div>

        {!editando ? (
          // Vista de solo lectura
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Clock size={20} style={{ color: colors.primary }} className="mr-3" />
              <div>
                <p className="font-medium">
                  {enabled ? (
                    <>Descanso: {formatearTiempo(minutes)}</>
                  ) : (
                    'Sin descansos configurados'
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  {enabled 
                    ? `Se descontará automáticamente de tus turnos`
                    : 'Los turnos se calculan sin descontar tiempo de descanso'
                  }
                </p>
              </div>
            </div>
            <Button
              onClick={() => setEditando(true)}
              variant="outline"
              size="sm"
              className="flex-shrink-0"
              themeColor={colors.primary}
            >
              {enabled ? 'Editar' : 'Configurar'}
            </Button>
          </div>
        ) : (
          // Vista de edición
          <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="rounded w-4 h-4"
                  style={{ accentColor: colors.primary }}
                />
                <span className="text-sm font-medium">
                  Habilitar descuento de descansos
                </span>
              </label>
            </div>

            {enabled && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Duración del descanso (minutos)
                </label>
                
                {/* Botones rápidos */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[15, 30, 45, 60].map(min => (
                    <button
                      key={min}
                      type="button"
                      onClick={() => setMinutes(min)}
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
                </div>

                {/* Input personalizado */}
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={minutes}
                    onChange={(e) => setMinutes(Math.max(5, Math.min(120, parseInt(e.target.value) || 0)))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                    style={{ '--tw-ring-color': colors.primary }}
                    min="5"
                    max="120"
                    placeholder="30"
                  />
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    minutos
                  </span>
                </div>
                
                <p className="text-xs text-gray-500">
                  Mínimo 5 minutos, máximo 2 horas
                </p>

                {/* Ejemplo de cálculo */}
                <div 
                  className="p-3 rounded-lg border"
                  style={{ 
                    backgroundColor: colors.transparent10,
                    borderColor: colors.transparent20 
                  }}
                >
                  <p className="text-sm font-medium mb-1" style={{ color: colors.primary }}>
                    Ejemplo:
                  </p>
                  <p className="text-xs text-gray-600">
                    Turno de 8 horas con descanso de {formatearTiempo(minutes)} = 
                    <strong> {formatearTiempo((8 * 60) - minutes)} pagados</strong>
                  </p>
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex items-center space-x-2 pt-2">
              <Button
                onClick={handleGuardar}
                disabled={guardando}
                loading={guardando}
                size="sm"
                icon={Save}
                themeColor={colors.primary}
              >
                Guardar
              </Button>
              
              <Button
                onClick={handleCancelar}
                disabled={guardando}
                variant="outline"
                size="sm"
                icon={X}
                themeColor={colors.primary}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• El descanso se aplicará automáticamente a todos tus turnos</p>
          <p>• Podrás desactivar el descanso en turnos específicos si no lo tomaste</p>
          <p>• Los cálculos de pago se ajustarán según el tiempo trabajado real</p>
        </div>
      </div>
    </SettingsSection>
  );
};

export default SmokoSection;