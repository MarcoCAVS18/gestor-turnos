// src/components/settings/SmokoSection/index.jsx -

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** Coffee, Save ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';
import Flex from '../../ui/Flex';

const SmokoSection = (***REMOVED*** onError, onSuccess, className ***REMOVED***) => ***REMOVED***
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
    return `$***REMOVED***horas***REMOVED***h $***REMOVED***minutosRestantes***REMOVED***m`;
  ***REMOVED***;

  return (
    <SettingsSection
      icon=***REMOVED***Coffee***REMOVED***
      title="Smoko (Descansos)"
      className=***REMOVED***className***REMOVED***
    >
      <div className="space-y-6">
        <div 
          className="p-3 rounded-lg"
          style=***REMOVED******REMOVED*** backgroundColor: colors.transparent5 ***REMOVED******REMOVED***
        >
          <p className="text-sm" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
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
              checked=***REMOVED***enabled***REMOVED***
              onChange=***REMOVED***(e) => handleToggle(e.target.checked)***REMOVED***
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
          </label>
        </Flex>

        ***REMOVED***enabled && (
          <div className="space-y-4 pt-4 border-t border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Duración del descanso
              </label>

              ***REMOVED***/* GRID RESPONSIVO: 2 columnas en móvil, 4 en desktop */***REMOVED***
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                ***REMOVED***[15, 30, 45].map(min => (
                  <button
                    key=***REMOVED***min***REMOVED***
                    type="button"
                    onClick=***REMOVED***() => handleMinutesChange(min)***REMOVED***
                    // h-12 fija la altura para igualar al input
                    className=***REMOVED***`
                      relative h-12 w-full text-sm font-medium rounded-lg border transition-all
                      flex items-center justify-center
                      $***REMOVED***minutes === min
                        ? 'border-2 text-white shadow-sm'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      ***REMOVED***
                    `***REMOVED***
                    style=***REMOVED******REMOVED***
                      backgroundColor: minutes === min ? colors.primary : 'transparent',
                      borderColor: minutes === min ? colors.primary : undefined
                    ***REMOVED******REMOVED***
                  >
                    ***REMOVED***formatearTiempo(min)***REMOVED***
                  </button>
                ))***REMOVED***

                ***REMOVED***/* INPUT PERSONALIZADO */***REMOVED***
                <div className="relative h-12 w-full">
                  <input
                    type="number"
                    value=***REMOVED***minutes***REMOVED***
                    onChange=***REMOVED***(e) => handleMinutesChange(e.target.value)***REMOVED***
                    // pb-4 levanta el texto del input para dejar espacio a "min" abajo
                    className="block w-full h-full px-2 pt-1 pb-4 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors bg-white font-medium text-gray-900"
                    style=***REMOVED******REMOVED*** 
                      borderColor: [15, 30, 45].includes(minutes) ? '#E5E7EB' : colors.primary,
                      '--tw-ring-color': colors.primary 
                    ***REMOVED******REMOVED***
                    min="5"
                    max="120"
                    placeholder="--"
                  />
                  ***REMOVED***/* Etiqueta "min" en la parte inferior */***REMOVED***
                  <span className="absolute bottom-1.5 left-0 right-0 text-[10px] font-medium text-gray-400 text-center pointer-events-none uppercase tracking-wide">
                    min
                  </span>
                </div>
              </div>
            </div>
          </div>
        )***REMOVED***

        ***REMOVED***hasChanges && (
          <div className="pt-4 border-t border-gray-200">
            <Button
              onClick=***REMOVED***handleGuardar***REMOVED***
              disabled=***REMOVED***guardando***REMOVED***
              loading=***REMOVED***guardando***REMOVED***
              icon=***REMOVED***Save***REMOVED***
              className="w-full sm:w-auto" // Botón full width en móvil
              themeColor=***REMOVED***colors.primary***REMOVED***
            >
              ***REMOVED***guardando ? 'Guardando...' : 'Guardar cambios'***REMOVED***
            </Button>
          </div>
        )***REMOVED***
      </div>
    </SettingsSection>
  );
***REMOVED***;

export default SmokoSection;