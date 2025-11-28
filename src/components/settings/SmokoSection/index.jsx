// src/components/settings/SmokoSection/index.jsx - SIMPLIFICADO

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** Coffee, Save ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';

const SmokoSection = (***REMOVED*** onError, onSuccess ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** 
    smokoEnabled = false, 
    smokoMinutes = 30,
    savePreferences 
  ***REMOVED*** = useApp();
  
  const colors = useThemeColors();
  const [enabled, setEnabled] = useState(smokoEnabled);
  const [minutes, setMinutes] = useState(smokoMinutes);
  const [guardando, setGuardando] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => ***REMOVED***
    setEnabled(smokoEnabled);
    setMinutes(smokoMinutes);
  ***REMOVED***, [smokoEnabled, smokoMinutes]);

  // Detectar cambios
  useEffect(() => ***REMOVED***
    const cambiosDetectados = enabled !== smokoEnabled || minutes !== smokoMinutes;
    setHasChanges(cambiosDetectados);
  ***REMOVED***, [enabled, minutes, smokoEnabled, smokoMinutes]);

  const handleToggle = (newEnabled) => ***REMOVED***
    setEnabled(newEnabled);
  ***REMOVED***;

  const handleMinutesChange = (newMinutes) => ***REMOVED***
    setMinutes(Math.max(5, Math.min(120, parseInt(newMinutes) || 0)));
  ***REMOVED***;

  const handleGuardar = async () => ***REMOVED***
    try ***REMOVED***
      setGuardando(true);
      
      await savePreferences(***REMOVED*** 
        smokoEnabled: enabled,
        smokoMinutes: enabled ? minutes : 0
      ***REMOVED***);
      
      onSuccess?.('Configuración de descansos guardada correctamente');
    ***REMOVED*** catch (error) ***REMOVED***
      onError?.('Error al guardar configuración de descansos: ' + error.message);
    ***REMOVED*** finally ***REMOVED***
      setGuardando(false);
    ***REMOVED***
  ***REMOVED***;

  const formatearTiempo = (mins) => ***REMOVED***
    if (mins < 60) return `$***REMOVED***mins***REMOVED*** min`;
    const horas = Math.floor(mins / 60);
    const minutosRestantes = mins % 60;
    if (minutosRestantes === 0) return `$***REMOVED***horas***REMOVED***h`;
    return `$***REMOVED***horas***REMOVED***h $***REMOVED***minutosRestantes***REMOVED***min`;
  ***REMOVED***;

  return (
    <SettingsSection
      icon=***REMOVED***Coffee***REMOVED***
      title="Smoko (Descansos)"
    >
      <div className="space-y-6">
        ***REMOVED***/* Información explicativa */***REMOVED***
        <div 
          className="p-3 rounded-lg"
          style=***REMOVED******REMOVED*** backgroundColor: colors.transparent5 ***REMOVED******REMOVED***
        >
          <p className="text-sm" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
            <strong>¿Qué es esto?</strong> Configura el tiempo de descanso no pagado 
            que se descontará automáticamente de tus turnos para obtener cálculos más precisos.
          </p>
        </div>

        ***REMOVED***/* Toggle principal */***REMOVED***
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-medium">Habilitar descuento de descansos</p>
            <p className="text-sm text-gray-500">
              Los turnos se calcularán descontando el tiempo de descanso
            </p>
          </div>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked=***REMOVED***enabled***REMOVED***
              onChange=***REMOVED***(e) => handleToggle(e.target.checked)***REMOVED***
              className="rounded w-4 h-4 mr-2"
              style=***REMOVED******REMOVED*** accentColor: colors.primary ***REMOVED******REMOVED***
            />
          </label>
        </div>

        ***REMOVED***/* Configuración de minutos - Solo visible si está habilitado */***REMOVED***
        ***REMOVED***enabled && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Duración del descanso
              </label>

              ***REMOVED***/* Botones rápidos con input personalizado */***REMOVED***
              <div className="grid grid-cols-4 gap-2">
                ***REMOVED***[15, 30, 45].map(min => (
                  <button
                    key=***REMOVED***min***REMOVED***
                    type="button"
                    onClick=***REMOVED***() => handleMinutesChange(min)***REMOVED***
                    className=***REMOVED***`
                      px-3 py-2 text-sm rounded-lg border transition-colors
                      $***REMOVED***minutes === min
                        ? 'border-2 text-white'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      ***REMOVED***
                    `***REMOVED***
                    style=***REMOVED******REMOVED***
                      backgroundColor: minutes === min ? colors.primary : 'transparent',
                      borderColor: minutes === min ? colors.primary : '#D1D5DB'
                    ***REMOVED******REMOVED***
                  >
                    ***REMOVED***formatearTiempo(min)***REMOVED***
                  </button>
                ))***REMOVED***

                ***REMOVED***/* Input personalizado integrado con sufijo "min" */***REMOVED***
                <div className="relative">
                  <input
                    type="number"
                    value=***REMOVED***minutes***REMOVED***
                    onChange=***REMOVED***(e) => handleMinutesChange(e.target.value)***REMOVED***
                    className="w-full px-3 py-2 pr-10 text-sm text-center border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                    style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
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
        )***REMOVED***

        ***REMOVED***/* Botón de guardar - Solo si hay cambios */***REMOVED***
        ***REMOVED***hasChanges && (
          <div className="pt-4 border-t border-gray-200">
            <Button
              onClick=***REMOVED***handleGuardar***REMOVED***
              disabled=***REMOVED***guardando***REMOVED***
              loading=***REMOVED***guardando***REMOVED***
              icon=***REMOVED***Save***REMOVED***
              className="w-full"
              themeColor=***REMOVED***colors.primary***REMOVED***
            >
              ***REMOVED***guardando ? 'Guardando...' : 'Guardar cambios'***REMOVED***
            </Button>
          </div>
        )***REMOVED***

        ***REMOVED***/* Información adicional */***REMOVED***
        <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-100">
          <p>• El descanso se aplicará automáticamente a todos tus turnos</p>
          <p>• Podrás desactivar el descanso en turnos específicos si no lo tomaste</p>
        </div>
      </div>
    </SettingsSection>
  );
***REMOVED***;

export default SmokoSection;