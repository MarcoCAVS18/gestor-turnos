// src/components/shared/WorkPreviewCard/index.jsx

import React from 'react';
import ***REMOVED*** Briefcase, Truck, Bike, Car, User, Package ***REMOVED*** from 'lucide-react';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';

const WorkPreviewCard = (***REMOVED*** trabajo ***REMOVED***) => ***REMOVED***
  if (!trabajo) return null;

  const esDelivery = trabajo.tipo === 'delivery';

  // Obtener el ícono del vehículo para delivery
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
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
            style=***REMOVED******REMOVED*** backgroundColor: trabajo.color ***REMOVED******REMOVED***
          >
            ***REMOVED***esDelivery ? (
              <Truck className="h-6 w-6 text-white" />
            ) : (
              <Briefcase className="h-6 w-6 text-white" />
            )***REMOVED***
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-800">***REMOVED***trabajo.nombre***REMOVED***</h2>
              ***REMOVED***esDelivery && (
                <Badge variant="success" size="xs" rounded>
                  Delivery
                </Badge>
              )***REMOVED***
            </div>
            ***REMOVED***trabajo.descripcion && (
              <p className="text-gray-600 text-sm">***REMOVED***trabajo.descripcion***REMOVED***</p>
            )***REMOVED***
          </div>
        </div>
      </div>
      
      ***REMOVED***esDelivery ? (
        // Información específica para trabajos de delivery
        <div className="space-y-3">
          ***REMOVED***trabajo.plataforma && (
            <div className="flex items-center">
              <Package className="h-5 w-5 text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Plataforma</p>
                <p className="font-semibold">***REMOVED***trabajo.plataforma***REMOVED***</p>
              </div>
            </div>
          )***REMOVED***
          
          ***REMOVED***trabajo.vehiculo && (
            <div className="flex items-center">
              ***REMOVED***getVehicleIcon(trabajo.vehiculo)***REMOVED***
              <div className="ml-2">
                <p className="text-sm text-gray-600">Vehículo</p>
                <p className="font-semibold">***REMOVED***trabajo.vehiculo***REMOVED***</p>
              </div>
            </div>
          )***REMOVED***
          
          <div className="flex items-center">
            <Package className="h-5 w-5 text-green-500 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Tipo de trabajo</p>
              <p className="font-semibold">Ganancias variables por entrega</p>
            </div>
          </div>
        </div>
      ) : (
        // Información para trabajos tradicionales
        <div className="space-y-3">
          ***REMOVED***trabajo.tarifaBase && (
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Tarifa base</p>
                <p className="font-semibold">***REMOVED***formatCurrency(trabajo.tarifaBase)***REMOVED***/hora</p>
              </div>
            </div>
          )***REMOVED***
          
          ***REMOVED***trabajo.tarifas && (
            <div className="space-y-3 mt-3">
              <p className="text-sm font-medium text-gray-700">Tarifas especiales:</p>
              <div className="grid grid-cols-2 gap-2">
                ***REMOVED***trabajo.tarifas.diurno && (
                  <div className="text-center p-2 bg-yellow-50 rounded-lg border">
                    <p className="text-xs text-gray-600">Diurno</p>
                    <p className="font-semibold text-sm">***REMOVED***formatCurrency(trabajo.tarifas.diurno)***REMOVED***/h</p>
                  </div>
                )***REMOVED***
                
                ***REMOVED***trabajo.tarifas.tarde && (
                  <div className="text-center p-2 bg-orange-50 rounded-lg border">
                    <p className="text-xs text-gray-600">Tarde</p>
                    <p className="font-semibold text-sm">***REMOVED***formatCurrency(trabajo.tarifas.tarde)***REMOVED***/h</p>
                  </div>
                )***REMOVED***
                
                ***REMOVED***trabajo.tarifas.noche && (
                  <div className="text-center p-2 bg-blue-50 rounded-lg border">
                    <p className="text-xs text-gray-600">Noche</p>
                    <p className="font-semibold text-sm">***REMOVED***formatCurrency(trabajo.tarifas.noche)***REMOVED***/h</p>
                  </div>
                )***REMOVED***
                
                ***REMOVED***trabajo.tarifas.sabado && (
                  <div className="text-center p-2 bg-purple-50 rounded-lg border">
                    <p className="text-xs text-gray-600">Sábado</p>
                    <p className="font-semibold text-sm">***REMOVED***formatCurrency(trabajo.tarifas.sabado)***REMOVED***/h</p>
                  </div>
                )***REMOVED***
                
                ***REMOVED***trabajo.tarifas.domingo && (
                  <div className="text-center p-2 bg-red-50 rounded-lg border">
                    <p className="text-xs text-gray-600">Domingo</p>
                    <p className="font-semibold text-sm">***REMOVED***formatCurrency(trabajo.tarifas.domingo)***REMOVED***/h</p>
                  </div>
                )***REMOVED***
              </div>
            </div>
          )***REMOVED***
        </div>
      )***REMOVED***
    </Card>
  );
***REMOVED***;

export default WorkPreviewCard;