// src/components/settings/GoalsSection/index.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** Target, Save, X ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';

const GoalsSection = () => ***REMOVED***
  // Usar el nombre correcto de la variable y función del contexto
  const ***REMOVED*** weeklyHoursGoal, updateWeeklyHoursGoal ***REMOVED*** = useApp();
  const colors = useThemeColors();
  const [editando, setEditando] = useState(false);
  const [nuevaMeta, setNuevaMeta] = useState(weeklyHoursGoal || '');

  const handleGuardar = async () => ***REMOVED***
    try ***REMOVED***
      const meta = parseFloat(nuevaMeta);
      if (meta > 0 && meta <= 168) ***REMOVED***
        await updateWeeklyHoursGoal(meta);
        setEditando(false);
      ***REMOVED***
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error al guardar meta:', error);
    ***REMOVED***
  ***REMOVED***;

  const handleCancelar = () => ***REMOVED***
    setNuevaMeta(weeklyHoursGoal || '');
    setEditando(false);
  ***REMOVED***;

  const handleEliminar = async () => ***REMOVED***
    try ***REMOVED***
      await updateWeeklyHoursGoal(null);
      setNuevaMeta('');
      setEditando(false);
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error al eliminar meta:', error);
    ***REMOVED***
  ***REMOVED***;

  return (
    <SettingsSection icon=***REMOVED***Target***REMOVED*** title="Metas Semanales">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta de horas por semana
          </label>
          
          ***REMOVED***!editando ? (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                ***REMOVED***weeklyHoursGoal ? (
                  <>
                    <span className="text-lg font-semibold" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
                      ***REMOVED***weeklyHoursGoal***REMOVED*** horas
                    </span>
                    <p className="text-sm text-gray-500">
                      ~***REMOVED***(weeklyHoursGoal / 7).toFixed(1)***REMOVED*** horas por día
                    </p>
                  </>
                ) : (
                  <span className="text-gray-500">No configurada</span>
                )***REMOVED***
              </div>
              <button
                onClick=***REMOVED***() => setEditando(true)***REMOVED***
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style=***REMOVED******REMOVED***
                  backgroundColor: colors.transparent10,
                  color: colors.primary
                ***REMOVED******REMOVED***
                onMouseEnter=***REMOVED***(e) => ***REMOVED***
                  e.target.style.backgroundColor = colors.transparent20;
                ***REMOVED******REMOVED***
                onMouseLeave=***REMOVED***(e) => ***REMOVED***
                  e.target.style.backgroundColor = colors.transparent10;
                ***REMOVED******REMOVED***
              >
                ***REMOVED***weeklyHoursGoal ? 'Editar' : 'Configurar'***REMOVED***
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value=***REMOVED***nuevaMeta***REMOVED***
                  onChange=***REMOVED***(e) => setNuevaMeta(e.target.value)***REMOVED***
                  placeholder="Ej: 40"
                  min="1"
                  max="168"
                  step="0.5"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                  style=***REMOVED******REMOVED*** '--tw-ring-color': colors.primary ***REMOVED******REMOVED***
                />
                <span className="text-sm text-gray-500">horas</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick=***REMOVED***handleGuardar***REMOVED***
                  disabled=***REMOVED***!nuevaMeta || parseFloat(nuevaMeta) <= 0***REMOVED***
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
                  style=***REMOVED******REMOVED*** backgroundColor: colors.primary ***REMOVED******REMOVED***
                  onMouseEnter=***REMOVED***(e) => ***REMOVED***
                    if (!e.target.disabled) ***REMOVED***
                      e.target.style.backgroundColor = colors.primaryDark;
                    ***REMOVED***
                  ***REMOVED******REMOVED***
                  onMouseLeave=***REMOVED***(e) => ***REMOVED***
                    if (!e.target.disabled) ***REMOVED***
                      e.target.style.backgroundColor = colors.primary;
                    ***REMOVED***
                  ***REMOVED******REMOVED***
                >
                  <Save size=***REMOVED***16***REMOVED*** className="mr-1" />
                  Guardar
                </button>
                
                <button
                  onClick=***REMOVED***handleCancelar***REMOVED***
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style=***REMOVED******REMOVED***
                    backgroundColor: colors.transparent10,
                    color: colors.primary
                  ***REMOVED******REMOVED***
                  onMouseEnter=***REMOVED***(e) => ***REMOVED***
                    e.target.style.backgroundColor = colors.transparent20;
                  ***REMOVED******REMOVED***
                  onMouseLeave=***REMOVED***(e) => ***REMOVED***
                    e.target.style.backgroundColor = colors.transparent10;
                  ***REMOVED******REMOVED***
                >
                  <X size=***REMOVED***16***REMOVED*** className="mr-1" />
                  Cancelar
                </button>

                ***REMOVED***weeklyHoursGoal && (
                  <button
                    onClick=***REMOVED***handleEliminar***REMOVED***
                    className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 transition-colors hover:bg-red-100"
                  >
                    <X size=***REMOVED***16***REMOVED*** className="mr-1" />
                    Eliminar
                  </button>
                )***REMOVED***
              </div>
            </div>
          )***REMOVED***
        </div>

        <div 
          className="p-3 rounded-lg"
          style=***REMOVED******REMOVED*** backgroundColor: colors.transparent5 ***REMOVED******REMOVED***
        >
          <p className="text-sm" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
            <strong>Consejo:</strong> Configura una meta realista para ver tu progreso semanal 
            en la barra de progreso de Estadísticas.
          </p>
        </div>
      </div>
    </SettingsSection>
  );
***REMOVED***;

export default GoalsSection;