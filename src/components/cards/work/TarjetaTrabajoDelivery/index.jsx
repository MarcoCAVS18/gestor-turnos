// src/components/cards/TarjetaTrabajoDelivery/index.jsx - Refactorizado usando BaseWorkCard

import React from 'react';
import { Package, Bike, Car, Truck, User } from 'lucide-react';
import BaseWorkCard from '../../base/BaseWorkCard';
import Flex from '../../../ui/Flex';

const TarjetaTrabajoDelivery = (props) => {
  const { trabajo } = props;

  // Obtener ícono del vehículo
  const getVehicleIcon = (vehiculo) => {
    switch (vehiculo) {
      case 'Bicicleta': return <Bike size={16} className="text-green-500" />;
      case 'Moto': return <Truck size={16} className="text-orange-500" />;
      case 'Auto': return <Car size={16} className="text-blue-500" />;
      case 'A pie': return <User size={16} className="text-gray-500" />;
      default: return <Package size={16} className="text-gray-400" />;
    }
  };

  return (
    <BaseWorkCard {...props} type="delivery">
      {/* Información del trabajo de delivery */}
      <div className="space-y-2">
        {/* Plataforma */}
        {trabajo?.plataforma && (
          <Flex variant="between">
            <Flex variant="center">
              <Package size={14} className="text-blue-500 mr-2" />
              <span className="text-sm text-gray-600">Plataforma:</span>
            </Flex>
            <span className="text-sm font-medium">{trabajo.plataforma}</span>
          </Flex>
        )}

        {/* Vehículo */}
        {trabajo?.vehiculo && (
          <Flex variant="between">
            <Flex variant="center">
              {getVehicleIcon(trabajo.vehiculo)}
              <span className="text-sm text-gray-600 ml-2">Vehículo:</span>
            </Flex>
            <span className="text-sm font-medium">{trabajo.vehiculo}</span>
          </Flex>
        )}

        {/* Información sobre ganancias variables */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <Flex variant="center" className="text-sm text-gray-500 italic">
            <Package size={14} className="text-gray-400 mr-2" />
            <span>Ganancias variables por pedido</span>
          </Flex>
        </div>
      </div>
    </BaseWorkCard>
  );
};

export default TarjetaTrabajoDelivery;