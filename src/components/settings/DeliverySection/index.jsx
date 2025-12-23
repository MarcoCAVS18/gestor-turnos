// src/components/settings/DeliverySection/index.jsx 

import React from 'react';
import ***REMOVED*** Truck, Info, AlertTriangle ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import SettingsSection from '../SettingsSection';
import Switch from '../../ui/Switch';
import Popover from '../../ui/Popover';
import Flex from '../../ui/Flex';

const DeliverySection = (***REMOVED*** onError, onSuccess, className ***REMOVED***) => ***REMOVED***
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

  // Contenido condicional del Popover
  const popoverContent = deliveryEnabled ? (
    // CONTENIDO SI SE VA A DESACTIVAR
    <div className="p-2 max-w-xs text-sm">
      <p className="mb-2 text-gray-700">
        Al desactivar esta opción, la interfaz se simplificará para trabajos por hora:
      </p>
      <ul className="space-y-2 text-gray-600 list-disc pl-4">
        <li>
          Se mostrarán únicamente estadísticas de <strong>trabajos tradicionales</strong> en el dashboard.
        </li>
        <li className="text-amber-700 bg-amber-50 p-1 rounded -ml-1 pl-4 border-l-2 border-amber-500">
          <strong>Nota:</strong> Tus turnos de delivery anteriores <strong>seguirán visibles</strong> en el historial, pero <strong>no podrás agregar nuevos</strong> turnos de este tipo hasta volver a activar.
        </li>
      </ul>
    </div>
  ) : (
    // CONTENIDO SI SE VA A ACTIVAR
    <div className="p-2 max-w-xs text-sm">
      <p className="mb-2 text-gray-700">
        El <strong>modo delivery</strong> adapta la aplicación para trabajos de reparto (Gig Economy):
      </p>
      <ul className="space-y-1.5 text-gray-600 list-disc pl-4">
        <li>Los trabajos <strong>no requieren</strong> tarifa por hora fija.</li>
        <li>Registras <strong>ganancias totales</strong> por cada turno.</li>
        <li>Campos para <strong>propinas</strong> y cantidad de pedidos.</li>
        <li>Seguimiento detallado de <strong>km y combustible</strong>.</li>
      </ul>
    </div>
  );

  return (
    <SettingsSection icon=***REMOVED***Truck***REMOVED*** title="Trabajos de Delivery" className=***REMOVED***className***REMOVED***>
      <div className="space-y-4">
        <Flex variant="between" className="items-start">
          <div className="flex-1 pr-4">
            <p className="font-medium text-gray-900">
              ***REMOVED***deliveryEnabled ? 'Deshabilitar modo delivery' : 'Habilitar modo delivery'***REMOVED***
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Permite registrar trabajos de reparto con ganancias variables.
            </p>

            <Popover 
              content=***REMOVED***popoverContent***REMOVED*** 
              title=***REMOVED***deliveryEnabled ? "Consecuencias de desactivar" : "¿Cómo funciona?"***REMOVED***
              position="bottom-start"
            >
              <button 
                className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:opacity-80 focus:outline-none"
                style=***REMOVED******REMOVED*** color: deliveryEnabled ? colors.warning : colors.primary ***REMOVED******REMOVED***
              >
                ***REMOVED***deliveryEnabled ? <AlertTriangle size=***REMOVED***14***REMOVED*** /> : <Info size=***REMOVED***14***REMOVED*** />***REMOVED***
                <span>
                  ***REMOVED***deliveryEnabled 
                    ? '¿Qué pasa si lo desactivo?' 
                    : '¿Qué cambia al activarlo?'***REMOVED***
                </span>
              </button>
            </Popover>
          </div>
          
          <Switch
            checked=***REMOVED***deliveryEnabled***REMOVED***
            onChange=***REMOVED***handleToggle***REMOVED***
          />
        </Flex>
      </div>
    </SettingsSection>
  );
***REMOVED***;

export default DeliverySection;