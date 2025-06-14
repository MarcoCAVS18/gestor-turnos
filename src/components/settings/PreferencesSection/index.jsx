// src/components/settings/PreferencesSection/index.jsx

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import SettingsSection from '../SettingsSection';
import Button from '../../ui/Button';

const PreferencesSection = ({ onError, onSuccess }) => {
  const { 
    descuentoDefault: appDescuento, 
    guardarPreferencias,
    coloresTemáticos 
  } = useApp();
  
  const [descuentoDefault, setDescuentoDefault] = useState(appDescuento);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDescuentoDefault(appDescuento);
  }, [appDescuento]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await guardarPreferencias({ descuentoDefault });
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Porcentaje de descuento
        </label>
        <div className="flex rounded-md shadow-sm">
          <input
            type="number"
            min="0"
            max="100"
            value={descuentoDefault}
            onChange={(e) => setDescuentoDefault(Number(e.target.value))}
            className="flex-1 px-3 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2"
            style={{ '--tw-ring-color': coloresTemáticos?.base || '#EC4899' }}
            placeholder="15"
          />
          <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            %
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Este descuento se aplicará por defecto a todos tus turnos y trabajos. Podrás modificarlo más adelante.
        </p>
        
        <Button
          onClick={handleSave}
          disabled={loading}
          loading={loading}
          className="w-full mt-4"
        >
          Guardar cambios
        </Button>
      </div>
    </SettingsSection>
  );
};

export default PreferencesSection;