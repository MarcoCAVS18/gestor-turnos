// src/components/cards/TarjetaTrabajoDelivery/index.jsx - Versión actualizada

import React from 'react';
import ***REMOVED*** Edit2, Trash2, Share2, Package, Bike, Car, Truck, User ***REMOVED*** from 'lucide-react';
import Card from '../../ui/Card';
import WorkAvatar from '../../work/WorkAvatar';
import ActionsMenu from '../../ui/ActionsMenu';

const TarjetaTrabajoDelivery = (***REMOVED*** 
  trabajo, 
  onEdit, 
  onDelete, 
  onShare, 
  showActions = true,
  variant = 'default',
  isSharing = false 
***REMOVED***) => ***REMOVED***
  // Validación defensiva
  if (!trabajo) ***REMOVED***
    return (
      <Card variant="outlined" className="opacity-50">
        <div className="text-center text-gray-500">
          <p className="text-sm">Trabajo no encontrado</p>
        </div>
      </Card>
    );
  ***REMOVED***

  const descripcion = trabajo.descripcion && trabajo.descripcion.trim()
    ? trabajo.descripcion
    : 'No olvides guardar más información sobre tu trabajo.';

  // Configurar acciones del menú
  const actions = [
    ***REMOVED*** 
      icon: Edit2, 
      label: 'Editar', 
      onClick: () => onEdit?.(trabajo)
    ***REMOVED***,
    ...(onShare ? [***REMOVED*** 
      icon: Share2, 
      label: 'Compartir', 
      onClick: () => onShare?.(trabajo),
      disabled: isSharing
    ***REMOVED***] : []),
    ***REMOVED*** 
      icon: Trash2, 
      label: 'Eliminar', 
      onClick: () => onDelete?.(trabajo), 
      variant: 'danger' 
    ***REMOVED***
  ];

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
    <Card 
      variant=***REMOVED***variant***REMOVED***
      hover=***REMOVED***true***REMOVED***
      className=***REMOVED***isSharing ? 'opacity-70' : ''***REMOVED***
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1 min-w-0">
          ***REMOVED***/* Avatar del trabajo delivery */***REMOVED***
          <WorkAvatar
            nombre=***REMOVED***trabajo.nombre***REMOVED***
            color=***REMOVED***trabajo.colorAvatar || '#10b981'***REMOVED***
            size="lg"
          />

          <div className="flex-1 ml-4 min-w-0">
            ***REMOVED***/* Nombre del trabajo y badge */***REMOVED***
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900 truncate">***REMOVED***trabajo.nombre***REMOVED***</h3>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Delivery
              </span>
            </div>
            
            ***REMOVED***/* Descripción */***REMOVED***
            <p className="text-gray-600 text-sm mb-3 leading-relaxed italic">
              ***REMOVED***descripcion***REMOVED***
            </p>

            ***REMOVED***/* Información del trabajo de delivery */***REMOVED***
            <div className="space-y-2">
              ***REMOVED***/* Plataforma */***REMOVED***
              ***REMOVED***trabajo.plataforma && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package size=***REMOVED***14***REMOVED*** className="text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600">Plataforma:</span>
                  </div>
                  <span className="text-sm font-medium">***REMOVED***trabajo.plataforma***REMOVED***</span>
                </div>
              )***REMOVED***

              ***REMOVED***/* Vehículo */***REMOVED***
              ***REMOVED***trabajo.vehiculo && (
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
          </div>
        </div>

        ***REMOVED***/* Menú de acciones */***REMOVED***
        ***REMOVED***showActions && (
          <div className="ml-4 flex-shrink-0">
            <ActionsMenu actions=***REMOVED***actions***REMOVED*** />
          </div>
        )***REMOVED***
      </div>

      ***REMOVED***/* Indicador de estado compartiendo */***REMOVED***
      ***REMOVED***isSharing && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-center">
            <div className="flex items-center text-sm text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Compartiendo...
            </div>
          </div>
        </div>
      )***REMOVED***
    </Card>
  );
***REMOVED***;

export default TarjetaTrabajoDelivery;