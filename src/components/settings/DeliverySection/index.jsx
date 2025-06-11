// src/components/settings/DeliverySection/index.jsx
import React from 'react';
import ***REMOVED*** Truck, Info, Package, DollarSign ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import SettingsSection from '../SettingsSection';
import Switch from '../../ui/Switch';

const DeliverySection = (***REMOVED*** onError, onSuccess ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** deliveryEnabled, guardarPreferencias, coloresTemáticos ***REMOVED*** = useApp();
  
  console.log('DeliverySection - deliveryEnabled:', deliveryEnabled);
  
  const handleToggle = async (checked) => ***REMOVED***
    console.log('DeliverySection - handleToggle called with:', checked);
    try ***REMOVED***
      await guardarPreferencias(***REMOVED*** deliveryEnabled: checked ***REMOVED***);
      console.log('DeliverySection - guardarPreferencias success');
      onSuccess?.(`Modo delivery $***REMOVED***checked ? 'activado' : 'desactivado'***REMOVED***`);
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('DeliverySection - Error:', error);
      onError?.('Error al cambiar configuración de delivery');
    ***REMOVED***
  ***REMOVED***;

  return (
    <SettingsSection icon=***REMOVED***Truck***REMOVED*** title="Trabajos de Delivery">
      <div className="space-y-4">
        ***REMOVED***/* Toggle principal */***REMOVED***
        <div className="flex items-center justify-between">
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
        </div>
        
        ***REMOVED***/* Información cuando está activado */***REMOVED***
        ***REMOVED***deliveryEnabled && (
          <>
            <div 
              className="p-4 rounded-lg border"
              style=***REMOVED******REMOVED*** 
                backgroundColor: coloresTemáticos?.transparent5 || 'rgba(236, 72, 153, 0.05)',
                borderColor: coloresTemáticos?.transparent20 || 'rgba(236, 72, 153, 0.2)'
              ***REMOVED******REMOVED***
            >
              <div className="flex items-start">
                <Info size=***REMOVED***16***REMOVED*** className="mt-0.5 mr-2 flex-shrink-0" style=***REMOVED******REMOVED*** color: coloresTemáticos?.base ***REMOVED******REMOVED*** />
                <div className="text-sm space-y-1">
                  <p className="font-medium">¿Cómo funciona?</p>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Los trabajos de delivery no requieren tarifa por hora</li>
                    <li>• Registra tus ganancias totales por cada turno</li>
                    <li>• Incluye propinas y cantidad de pedidos realizados</li>
                    <li>• Opcionalmente agrega kilómetros y gastos de combustible</li>
                  </ul>
                </div>
              </div>
            </div>

            ***REMOVED***/* Plataformas soportadas */***REMOVED***
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Plataformas soportadas:</p>
              <div className="grid grid-cols-2 gap-2">
                ***REMOVED***[
                  ***REMOVED*** nombre: 'Uber Eats', icono: '🚗' ***REMOVED***,
                  ***REMOVED*** nombre: 'DoorDash', icono: '🛵' ***REMOVED***,
                  ***REMOVED*** nombre: 'Rappi', icono: '📦' ***REMOVED***,
                  ***REMOVED*** nombre: 'PedidosYa', icono: '🏍️' ***REMOVED***
                ].map(plataforma => (
                  <div key=***REMOVED***plataforma.nombre***REMOVED*** className="flex items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-xl mr-2">***REMOVED***plataforma.icono***REMOVED***</span>
                    <span className="text-sm">***REMOVED***plataforma.nombre***REMOVED***</span>
                  </div>
                ))***REMOVED***
              </div>
              <p className="text-xs text-gray-500 mt-2">
                También puedes agregar plataformas personalizadas
              </p>
            </div>

            ***REMOVED***/* Estadísticas preview */***REMOVED***
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Con el modo delivery podrás ver:
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign size=***REMOVED***16***REMOVED*** className="mr-2 text-green-500" />
                  Ganancia promedio por pedido
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Package size=***REMOVED***16***REMOVED*** className="mr-2 text-blue-500" />
                  Total de pedidos completados
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Truck size=***REMOVED***16***REMOVED*** className="mr-2 text-purple-500" />
                  Kilómetros recorridos y gastos
                </div>
              </div>
            </div>
          </>
        )***REMOVED***
      </div>
    </SettingsSection>
  );
***REMOVED***;

export default DeliverySection;