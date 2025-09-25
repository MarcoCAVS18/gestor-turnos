// src/components/settings/SmokoSection/index.jsx

import React, ***REMOVED*** useState, useEffect ***REMOVED*** from 'react';
import ***REMOVED*** Clock, Coffee, Save, X ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';
import New from '../../ui/New';

const SmokoSection = (***REMOVED*** onError, onSuccess ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** 
    smokoEnabled = false, 
    smokoMinutes = 30,
    savePreferences 
  ***REMOVED*** = useApp();
  
  const colors = useThemeColors();
  const [editando, setEditando] = useState(false);
  const [enabled, setEnabled] = useState(smokoEnabled);
  const [minutes, setMinutes] = useState(smokoMinutes);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => ***REMOVED***
    setEnabled(smokoEnabled);
    setMinutes(smokoMinutes);
  ***REMOVED***, [smokoEnabled, smokoMinutes]);

  const handleGuardar = async () => ***REMOVED***
    try ***REMOVED***
      setGuardando(true);
      
      await savePreferences(***REMOVED*** 
        smokoEnabled: enabled,
        smokoMinutes: enabled ? minutes : 0
      ***REMOVED***);
      
      setEditando(false);
      onSuccess?.('Configuración de descansos guardada correctamente');
    ***REMOVED*** catch (error) ***REMOVED***
      onError?.('Error al guardar configuración de descansos: ' + error.message);
    ***REMOVED*** finally ***REMOVED***
      setGuardando(false);
    ***REMOVED***
  ***REMOVED***;

  const handleCancelar = () => ***REMOVED***
    setEnabled(smokoEnabled);
    setMinutes(smokoMinutes);
    setEditando(false);
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
      title=***REMOVED***
        <div className="flex items-center gap-2">
          <span>Smoko (Descansos)</span>
          <New size="xs">NUEVO</New>
        </div>
      ***REMOVED***
    >
      <div className="space-y-4">
        <div 
          className="p-3 rounded-lg"
          style=***REMOVED******REMOVED*** backgroundColor: colors.transparent5 ***REMOVED******REMOVED***
        >
          <p className="text-sm" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
            <strong>¿Qué es esto?</strong> Configura el tiempo de descanso no pagado 
            que se descontará automáticamente de tus turnos para obtener cálculos más precisos.
          </p>
        </div>

        ***REMOVED***!editando ? (
          // Vista de solo lectura
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Clock size=***REMOVED***20***REMOVED*** style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** className="mr-3" />
              <div>
                <p className="font-medium">
                  ***REMOVED***enabled ? (
                    <>Descanso: ***REMOVED***formatearTiempo(minutes)***REMOVED***</>
                  ) : (
                    'Sin descansos configurados'
                  )***REMOVED***
                </p>
                <p className="text-sm text-gray-500">
                  ***REMOVED***enabled 
                    ? `Se descontará automáticamente de tus turnos`
                    : 'Los turnos se calculan sin descontar tiempo de descanso'
                  ***REMOVED***
                </p>
              </div>
            </div>
            <Button
              onClick=***REMOVED***() => setEditando(true)***REMOVED***
              variant="outline"
              size="sm"
              className="flex-shrink-0"
              themeColor=***REMOVED***colors.primary***REMOVED***
            >
              ***REMOVED***enabled ? 'Editar' : 'Configurar'***REMOVED***
            </Button>
          </div>
        ) : (
          // Vista de edición
          <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked=***REMOVED***enabled***REMOVED***
                  onChange=***REMOVED***(e) => setEnabled(e.target.checked)***REMOVED***
                  className="rounded w-4 h-4"
                  style=***REMOVED******REMOVED*** accentColor: colors.primary ***REMOVED******REMOVED***
                />
                <span className="text-sm font-medium">
                  Habilitar descuento de descansos
                </span>
              </label>
            </div>

            ***REMOVED***enabled && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Duración del descanso (minutos)
                </label>
                
                ***REMOVED***/* Botones rápidos */***REMOVED***
                <div className="grid grid-cols-4 gap-2 mb-3">
                  ***REMOVED***[15, 30, 45, 60].map(min => (
                    <button
                      key=***REMOVED***min***REMOVED***
                      type="button"
                      onClick=***REMOVED***() => setMinutes(min)***REMOVED***
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
                </div>

                ***REMOVED***/* Input personalizado */***REMOVED***
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value=***REMOVED***minutes***REMOVED***
                    onChange=***REMOVED***(e) => setMinutes(Math.max(5, Math.min(120, parseInt(e.target.value) || 0)))***REMOVED***
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                    style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
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

                ***REMOVED***/* Ejemplo de cálculo */***REMOVED***
                <div 
                  className="p-3 rounded-lg border"
                  style=***REMOVED******REMOVED*** 
                    backgroundColor: colors.transparent10,
                    borderColor: colors.transparent20 
                  ***REMOVED******REMOVED***
                >
                  <p className="text-sm font-medium mb-1" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
                    Ejemplo:
                  </p>
                  <p className="text-xs text-gray-600">
                    Turno de 8 horas con descanso de ***REMOVED***formatearTiempo(minutes)***REMOVED*** = 
                    <strong> ***REMOVED***formatearTiempo((8 * 60) - minutes)***REMOVED*** pagados</strong>
                  </p>
                </div>
              </div>
            )***REMOVED***

            ***REMOVED***/* Botones de acción */***REMOVED***
            <div className="flex items-center space-x-2 pt-2">
              <Button
                onClick=***REMOVED***handleGuardar***REMOVED***
                disabled=***REMOVED***guardando***REMOVED***
                loading=***REMOVED***guardando***REMOVED***
                size="sm"
                icon=***REMOVED***Save***REMOVED***
                themeColor=***REMOVED***colors.primary***REMOVED***
              >
                Guardar
              </Button>
              
              <Button
                onClick=***REMOVED***handleCancelar***REMOVED***
                disabled=***REMOVED***guardando***REMOVED***
                variant="outline"
                size="sm"
                icon=***REMOVED***X***REMOVED***
                themeColor=***REMOVED***colors.primary***REMOVED***
              >
                Cancelar
              </Button>
            </div>
          </div>
        )***REMOVED***

        ***REMOVED***/* Información adicional */***REMOVED***
        <div className="text-xs text-gray-500 space-y-1">
          <p>• El descanso se aplicará automáticamente a todos tus turnos</p>
          <p>• Podrás desactivar el descanso en turnos específicos si no lo tomaste</p>
          <p>• Los cálculos de pago se ajustarán según el tiempo trabajado real</p>
        </div>
      </div>
    </SettingsSection>
  );
***REMOVED***;

export default SmokoSection;