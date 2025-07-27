// src/components/settings/GoalsSection/index.jsx

import React, { useState } from 'react';
import { Target, Save, X } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';

const GoalsSection = () => {
  // Usar el nombre correcto de la variable y función del contexto
  const { weeklyHoursGoal, updateWeeklyHoursGoal } = useApp();
  const colors = useThemeColors();
  const [editando, setEditando] = useState(false);
  const [nuevaMeta, setNuevaMeta] = useState(weeklyHoursGoal || '');

  const handleGuardar = async () => {
    try {
      const meta = parseFloat(nuevaMeta);
      if (meta > 0 && meta <= 168) {
        await updateWeeklyHoursGoal(meta);
        setEditando(false);
      }
    } catch (error) {
      console.error('Error al guardar meta:', error);
    }
  };

  const handleCancelar = () => {
    setNuevaMeta(weeklyHoursGoal || '');
    setEditando(false);
  };

  const handleEliminar = async () => {
    try {
      await updateWeeklyHoursGoal(null);
      setNuevaMeta('');
      setEditando(false);
    } catch (error) {
      console.error('Error al eliminar meta:', error);
    }
  };

  return (
    <SettingsSection icon={Target} title="Metas Semanales">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta de horas por semana
          </label>
          
          {!editando ? (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                {weeklyHoursGoal ? (
                  <>
                    <span className="text-lg font-semibold" style={{ color: colors.primary }}>
                      {weeklyHoursGoal} horas
                    </span>
                    <p className="text-sm text-gray-500">
                      ~{(weeklyHoursGoal / 7).toFixed(1)} horas por día
                    </p>
                  </>
                ) : (
                  <span className="text-gray-500">No configurada</span>
                )}
              </div>
              <button
                onClick={() => setEditando(true)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: colors.transparent10,
                  color: colors.primary
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = colors.transparent20;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = colors.transparent10;
                }}
              >
                {weeklyHoursGoal ? 'Editar' : 'Configurar'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={nuevaMeta}
                  onChange={(e) => setNuevaMeta(e.target.value)}
                  placeholder="Ej: 40"
                  min="1"
                  max="168"
                  step="0.5"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                  style={{ '--tw-ring-color': colors.primary }}
                />
                <span className="text-sm text-gray-500">horas</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleGuardar}
                  disabled={!nuevaMeta || parseFloat(nuevaMeta) <= 0}
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
                  style={{ backgroundColor: colors.primary }}
                  onMouseEnter={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.backgroundColor = colors.primaryDark;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.backgroundColor = colors.primary;
                    }
                  }}
                >
                  <Save size={16} className="mr-1" />
                  Guardar
                </button>
                
                <button
                  onClick={handleCancelar}
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: colors.transparent10,
                    color: colors.primary
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = colors.transparent20;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = colors.transparent10;
                  }}
                >
                  <X size={16} className="mr-1" />
                  Cancelar
                </button>

                {weeklyHoursGoal && (
                  <button
                    onClick={handleEliminar}
                    className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 transition-colors hover:bg-red-100"
                  >
                    <X size={16} className="mr-1" />
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div 
          className="p-3 rounded-lg"
          style={{ backgroundColor: colors.transparent5 }}
        >
          <p className="text-sm" style={{ color: colors.primary }}>
            <strong>Consejo:</strong> Configura una meta realista para ver tu progreso semanal 
            en la barra de progreso de Estadísticas.
          </p>
        </div>
      </div>
    </SettingsSection>
  );
};

export default GoalsSection;