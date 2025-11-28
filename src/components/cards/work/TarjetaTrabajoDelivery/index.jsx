// src/components/cards/TarjetaTrabajoDelivery/index.jsx - Refactorizado usando BaseWorkCard

import React from 'react';
import ***REMOVED*** Package, Bike, Car, Truck, User ***REMOVED*** from 'lucide-react';
import BaseWorkCard from '../../base/BaseWorkCard';

const TarjetaTrabajoDelivery = (props) => ***REMOVED***
  const ***REMOVED*** trabajo ***REMOVED*** = props;

  // Obtener ícono del vehículo
  const getVehicleIcon = (vehiculo) => ***REMOVED***
    switch (vehiculo) ***REMOVED***
      case 'Bicicleta': return <Bike size=***REMOVED***16***REMOVED*** className="text-green-500" />;
      case 'Moto': return <Truck size=***REMOVED***16***REMOVED*** className="text-orange-500" />;
      case 'Auto': return <Car size=***REMOVED***16***REMOVED*** className="text-blue-500" />;
      case 'A pie': return <User size=***REMOVED***16***REMOVED*** className="text-gray-500" />;
      default: return <Package size=***REMOVED***16***REMOVED*** className="text-gray-400" />;
    ***REMOVED***
  ***REMOVED***;

  return (
    <BaseWorkCard ***REMOVED***...props***REMOVED*** type="delivery">
      ***REMOVED***/* Información del trabajo de delivery */***REMOVED***
      <div className="space-y-2">
        ***REMOVED***/* Plataforma */***REMOVED***
        ***REMOVED***trabajo?.plataforma && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Package size=***REMOVED***14***REMOVED*** className="text-blue-500 mr-2" />
              <span className="text-sm text-gray-600">Plataforma:</span>
            </div>
            <span className="text-sm font-medium">***REMOVED***trabajo.plataforma***REMOVED***</span>
          </div>
        )***REMOVED***

        ***REMOVED***/* Vehículo */***REMOVED***
        ***REMOVED***trabajo?.vehiculo && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              ***REMOVED***getVehicleIcon(trabajo.vehiculo)***REMOVED***
              <span className="text-sm text-gray-600 ml-2">Vehículo:</span>
            </div>
            <span className="text-sm font-medium">***REMOVED***trabajo.vehiculo***REMOVED***</span>
          </div>
        )***REMOVED***

        ***REMOVED***/* Información sobre ganancias variables */***REMOVED***
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500 italic">
            <Package size=***REMOVED***14***REMOVED*** className="text-gray-400 mr-2" />
            <span>Ganancias variables por pedido</span>
          </div>
        </div>
      </div>
    </BaseWorkCard>
  );
***REMOVED***;

export default TarjetaTrabajoDelivery;