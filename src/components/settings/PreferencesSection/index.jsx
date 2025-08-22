// src/components/settings/PreferencesSection/index.jsx - REFACTORIZADO

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';
import InfoTooltip from '../../ui/InfoTooltip';

const PreferencesSection = ({ onError, onSuccess }) => {
  const { 
    defaultDiscount,
    savePreferences
  } = useApp();
  
  const colors = useThemeColors();
  const [descuentoDefault, setDescuentoDefault] = useState(defaultDiscount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDescuentoDefault(defaultDiscount);
  }, [defaultDiscount]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await savePreferences({ descuentoDefault });
      onSuccess?.('Configuración guardada correctamente');
    } catch (error) {
      onError?.('Error al guardar ajustes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsSection icon={Clock} title="Configuración de trabajo">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Porcentaje de descuento
          </label>
          <InfoTooltip 
            content="El 15% es el cálculo promedio para empleados con contrato casual. Este descuento se aplicará por defecto a todos tus turnos."
            position="top"
            size="sm"
          />
        </div>
        <div className="flex rounded-md shadow-sm">
          <input
            type="number"
            min="0"
            max="100"
            value={descuentoDefault}
            onChange={(e) => setDescuentoDefault(Number(e.target.value))}
            className="flex-1 px-3 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 transition-colors"
            style={{ '--tw-ring-color': colors.primary }}
            placeholder="15"
          />
          <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            %
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Podrás modificarlo más adelante para cada trabajo específico.
        </p>
        
        <Button
          onClick={handleSave}
          disabled={loading}
          loading={loading}
          className="w-full mt-4"
          themeColor={colors.primary}
        >
          Guardar cambios
        </Button>
      </div>
    </SettingsSection>
  );
};

export default PreferencesSection;