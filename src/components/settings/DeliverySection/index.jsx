// src/components/settings/DeliverySection/index.jsx

import React from 'react';
import { Truck, Info } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import SettingsSection from '../SettingsSection';
import Switch from '../../ui/Switch';

const DeliverySection = ({ onError, onSuccess }) => {
  const { deliveryEnabled, savePreferences, thematicColors } = useApp();
  
  const handleToggle = async (newValue) => {
    try {
      
      await savePreferences({ deliveryEnabled: newValue });
      
      onSuccess?.(`Modo delivery ${newValue ? 'activado' : 'desactivado'}`);
    } catch (error) {
      console.error('Error al cambiar configuración de delivery:', error);
      onError?.('Error al cambiar configuración de delivery');
    }
  };

  return (
    <SettingsSection icon={Truck} title="Trabajos de Delivery">
      <div className="space-y-4">
        {/* Toggle principal */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-medium">Habilitar modo delivery</p>
            <p className="text-sm text-gray-500">
              Permite registrar trabajos de reparto con ganancias variables
            </p>
          </div>
          <Switch
            checked={deliveryEnabled}
            onChange={handleToggle}
          />
        </div>
        
        {/* Información cuando está activado */}
        {deliveryEnabled && (
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: thematicColors?.transparent5 || 'rgba(236, 72, 153, 0.05)',
              borderColor: thematicColors?.transparent20 || 'rgba(236, 72, 153, 0.2)'
            }}
          >
            <div className="flex items-start">
              <Info size={16} className="mt-0.5 mr-2 flex-shrink-0" style={{ color: thematicColors?.base }} />
              <div className="text-sm space-y-1">
                <p className="font-medium" style={{ color: thematicColors?.base }}>¿Cómo funciona?</p>
                <ul className="space-y-1 text-gray-600">
                  <li>• Los trabajos de delivery no requieren tarifa por hora</li>
                  <li>• Registra tus ganancias totales por cada turno</li>
                  <li>• Incluye propinas y cantidad de pedidos realizados</li>
                  <li>• Opcionalmente agrega kilómetros y gastos de combustible</li>
                  <li>• Soporta múltiples plataformas (Uber Eats, Doordash, Didi, etc.)</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </SettingsSection>
  );
};

export default DeliverySection;