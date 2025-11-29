// src/components/settings/DeliverySection/index.jsx 

import React from 'react';
import ***REMOVED*** Truck, Info ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';
import Switch from '../../ui/Switch';

import Flex from '../../ui/Flex';

const DeliverySection = (***REMOVED*** onError, onSuccess ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** deliveryEnabled, savePreferences ***REMOVED*** = useApp();
  const colors = useThemeColors();
  
  const handleToggle = async (newValue) => ***REMOVED***
    try ***REMOVED***
      await savePreferences(***REMOVED*** deliveryEnabled: newValue ***REMOVED***);
      onSuccess?.(`Modo delivery $***REMOVED***newValue ? 'activado' : 'desactivado'***REMOVED***`);
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error al cambiar configuración de delivery:', error);
      onError?.('Error al cambiar configuración de delivery');
    ***REMOVED***
  ***REMOVED***;

  return (
    <SettingsSection icon=***REMOVED***Truck***REMOVED*** title="Trabajos de Delivery">
      <div className="space-y-4">
        ***REMOVED***/* Toggle principal */***REMOVED***
        <Flex variant="between">
          <div className="flex-1">
            <p className="font-medium">Habilitar modo delivery</p>
            <p className="text-sm text-gray-500">
              Permite registrar trabajos de reparto con ganancias variables
            </p>
          </div>
          <Switch
            checked=***REMOVED***deliveryEnabled***REMOVED***
            onChange=***REMOVED***handleToggle***REMOVED***
          />
        </Flex>
        
        ***REMOVED***/* Información cuando está activado */***REMOVED***
        ***REMOVED***deliveryEnabled && (
          <div 
            className="p-4 rounded-lg border"
            style=***REMOVED******REMOVED*** 
              backgroundColor: colors.transparent5,
              borderColor: colors.transparent20
            ***REMOVED******REMOVED***
          >
            <Flex variant="start">
              <Info size=***REMOVED***16***REMOVED*** className="mt-0.5 mr-2 flex-shrink-0" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** />
              <div className="text-sm space-y-1">
                <p className="font-medium" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>¿Cómo funciona?</p>
                <ul className="space-y-1 text-gray-600">
                  <li>• Los trabajos de delivery no requieren tarifa por hora</li>
                  <li>• Registra tus ganancias totales por cada turno</li>
                  <li>• Incluye propinas y cantidad de pedidos realizados</li>
                  <li>• Opcionalmente agrega kilómetros y gastos de combustible</li>
                  <li>• Soporta múltiples plataformas (Uber Eats, Doordash, Didi, etc.)</li>
                </ul>
              </div>
            </Flex>
          </div>
        )***REMOVED***
      </div>
    </SettingsSection>
  );
***REMOVED***;

export default DeliverySection;