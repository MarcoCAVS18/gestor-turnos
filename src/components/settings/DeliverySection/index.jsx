// src/components/settings/DeliverySection/index.jsx
import React from 'react';
import { Truck, Info, Package, DollarSign } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import SettingsSection from '../SettingsSection';
import Switch from '../../ui/Switch';

const DeliverySection = ({ onError, onSuccess }) => {
  const { deliveryEnabled, guardarPreferencias, coloresTemáticos } = useApp();
  
  console.log('DeliverySection - deliveryEnabled:', deliveryEnabled);
  
  const handleToggle = async (checked) => {
    console.log('DeliverySection - handleToggle called with:', checked);
    try {
      await guardarPreferencias({ deliveryEnabled: checked });
      console.log('DeliverySection - guardarPreferencias success');
      onSuccess?.(`Modo delivery ${checked ? 'activado' : 'desactivado'}`);
    } catch (error) {
      console.error('DeliverySection - Error:', error);
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
          <>
            <div 
              className="p-4 rounded-lg border"
              style={{ 
                backgroundColor: coloresTemáticos?.transparent5 || 'rgba(236, 72, 153, 0.05)',
                borderColor: coloresTemáticos?.transparent20 || 'rgba(236, 72, 153, 0.2)'
              }}
            >
              <div className="flex items-start">
                <Info size={16} className="mt-0.5 mr-2 flex-shrink-0" style={{ color: coloresTemáticos?.base }} />
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

            {/* Plataformas soportadas */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Plataformas soportadas:</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { nombre: 'Uber Eats', icono: '🚗' },
                  { nombre: 'DoorDash', icono: '🛵' },
                  { nombre: 'Rappi', icono: '📦' },
                  { nombre: 'PedidosYa', icono: '🏍️' }
                ].map(plataforma => (
                  <div key={plataforma.nombre} className="flex items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-xl mr-2">{plataforma.icono}</span>
                    <span className="text-sm">{plataforma.nombre}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                También puedes agregar plataformas personalizadas
              </p>
            </div>

            {/* Estadísticas preview */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Con el modo delivery podrás ver:
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign size={16} className="mr-2 text-green-500" />
                  Ganancia promedio por pedido
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Package size={16} className="mr-2 text-blue-500" />
                  Total de pedidos completados
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Truck size={16} className="mr-2 text-purple-500" />
                  Kilómetros recorridos y gastos
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </SettingsSection>
  );
};

export default DeliverySection;