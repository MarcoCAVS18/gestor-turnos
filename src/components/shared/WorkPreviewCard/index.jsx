// src/components/shared/WorkPreviewCard/index.jsx

import React from 'react';
import { Briefcase, Truck, Bike, Car, User, Package } from 'lucide-react';
import { formatCurrency } from '../../../utils/currency';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import Flex from '../../ui/Flex';

const WorkPreviewCard = ({ trabajo }) => {
  if (!trabajo) return null;

  const esDelivery = trabajo.tipo === 'delivery';

  // Obtener el ícono del vehículo para delivery
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
    <Card>
      <Flex variant="start-between" className="mb-4">
        <div className="flex items-center">
          <Flex variant="center"
            className="w-12 h-12 rounded-lg mr-4"
            style={{ backgroundColor: trabajo.color }}
          >
            {esDelivery ? (
              <Truck className="h-6 w-6 text-white" />
            ) : (
              <Briefcase className="h-6 w-6 text-white" />
            )}
          </Flex>
          <div>
            <Flex className="gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-800">{trabajo.nombre}</h2>
              {esDelivery && (
                <Badge variant="success" size="xs" rounded>
                  Delivery
                </Badge>
              )}
            </Flex>
            {trabajo.descripcion && (
              <p className="text-gray-600 text-sm">{trabajo.descripcion}</p>
            )}
          </div>
        </div>
      </Flex>
      
      {esDelivery ? (
        // Información específica para trabajos de delivery
        <div className="space-y-3">
          {trabajo.plataforma && (
            <Flex>
              <Package className="h-5 w-5 text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Plataforma</p>
                <p className="font-semibold">{trabajo.plataforma}</p>
              </div>
            </Flex>
          )}
          
          {trabajo.vehiculo && (
            <Flex>
              {getVehicleIcon(trabajo.vehiculo)}
              <div className="ml-2">
                <p className="text-sm text-gray-600">Vehículo</p>
                <p className="font-semibold">{trabajo.vehiculo}</p>
              </div>
            </Flex>
          )}
          
          <Flex>
            <Package className="h-5 w-5 text-green-500 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Tipo de trabajo</p>
              <p className="font-semibold">Ganancias variables por entrega</p>
            </div>
          </Flex>
        </div>
      ) : (
        // Información para trabajos tradicionales
        <div className="space-y-3">
          {trabajo.tarifaBase && (
            <Flex>
              <Briefcase className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Tarifa base</p>
                <p className="font-semibold">{formatCurrency(trabajo.tarifaBase)}/hora</p>
              </div>
            </Flex>
          )}
          
          {trabajo.tarifas && (
            <div className="space-y-3 mt-3">
              <p className="text-sm font-medium text-gray-700">Tarifas especiales:</p>
              <div className="grid grid-cols-2 gap-2">
                {trabajo.tarifas.diurno && (
                  <div className="text-center p-2 bg-yellow-50 rounded-lg border">
                    <p className="text-xs text-gray-600">Diurno</p>
                    <p className="font-semibold text-sm">{formatCurrency(trabajo.tarifas.diurno)}/h</p>
                  </div>
                )}
                
                {trabajo.tarifas.tarde && (
                  <div className="text-center p-2 bg-orange-50 rounded-lg border">
                    <p className="text-xs text-gray-600">Tarde</p>
                    <p className="font-semibold text-sm">{formatCurrency(trabajo.tarifas.tarde)}/h</p>
                  </div>
                )}
                
                {trabajo.tarifas.noche && (
                  <div className="text-center p-2 bg-blue-50 rounded-lg border">
                    <p className="text-xs text-gray-600">Noche</p>
                    <p className="font-semibold text-sm">{formatCurrency(trabajo.tarifas.noche)}/h</p>
                  </div>
                )}
                
                {trabajo.tarifas.sabado && (
                  <div className="text-center p-2 bg-purple-50 rounded-lg border">
                    <p className="text-xs text-gray-600">Sábado</p>
                    <p className="font-semibold text-sm">{formatCurrency(trabajo.tarifas.sabado)}/h</p>
                  </div>
                )}
                
                {trabajo.tarifas.domingo && (
                  <div className="text-center p-2 bg-red-50 rounded-lg border">
                    <p className="text-xs text-gray-600">Domingo</p>
                    <p className="font-semibold text-sm">{formatCurrency(trabajo.tarifas.domingo)}/h</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default WorkPreviewCard;