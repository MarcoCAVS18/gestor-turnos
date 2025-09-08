// src/components/cards/TarjetaTrabajoDelivery/index.jsx - Versión actualizada

import React from 'react';
import { Edit2, Trash2, Share2, Package, Bike, Car, Truck, User } from 'lucide-react';
import Card from '../../ui/Card';
import WorkAvatar from '../../work/WorkAvatar';
import ActionsMenu from '../../ui/ActionsMenu';

const TarjetaTrabajoDelivery = ({ 
  trabajo, 
  onEdit, 
  onDelete, 
  onShare, 
  showActions = true,
  variant = 'default',
  isSharing = false 
}) => {
  // Validación defensiva
  if (!trabajo) {
    return (
      <Card variant="outlined" className="opacity-50">
        <div className="text-center text-gray-500">
          <p className="text-sm">Trabajo no encontrado</p>
        </div>
      </Card>
    );
  }

  const descripcion = trabajo.descripcion && trabajo.descripcion.trim()
    ? trabajo.descripcion
    : 'No olvides guardar más información sobre tu trabajo.';

  // Configurar acciones del menú
  const actions = [
    { 
      icon: Edit2, 
      label: 'Editar', 
      onClick: () => onEdit?.(trabajo)
    },
    ...(onShare ? [{ 
      icon: Share2, 
      label: 'Compartir', 
      onClick: () => onShare?.(trabajo),
      disabled: isSharing
    }] : []),
    { 
      icon: Trash2, 
      label: 'Eliminar', 
      onClick: () => onDelete?.(trabajo), 
      variant: 'danger' 
    }
  ];

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
    <Card 
      variant={variant}
      hover={true}
      className={isSharing ? 'opacity-70' : ''}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1 min-w-0">
          {/* Avatar del trabajo delivery */}
          <WorkAvatar
            nombre={trabajo.nombre}
            color={trabajo.colorAvatar || '#10b981'}
            size="lg"
          />

          <div className="flex-1 ml-4 min-w-0">
            {/* Nombre del trabajo y badge */}
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900 truncate">{trabajo.nombre}</h3>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Delivery
              </span>
            </div>
            
            {/* Descripción */}
            <p className="text-gray-600 text-sm mb-3 leading-relaxed italic">
              {descripcion}
            </p>

            {/* Información del trabajo de delivery */}
            <div className="space-y-2">
              {/* Plataforma */}
              {trabajo.plataforma && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package size={14} className="text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600">Plataforma:</span>
                  </div>
                  <span className="text-sm font-medium">{trabajo.plataforma}</span>
                </div>
              )}

              {/* Vehículo */}
              {trabajo.vehiculo && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getVehicleIcon(trabajo.vehiculo)}
                    <span className="text-sm text-gray-600 ml-2">Vehículo:</span>
                  </div>
                  <span className="text-sm font-medium">{trabajo.vehiculo}</span>
                </div>
              )}

              {/* Información sobre ganancias variables */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-500 italic">
                  <Package size={14} className="text-gray-400 mr-2" />
                  <span>Ganancias variables por pedido</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menú de acciones */}
        {showActions && (
          <div className="ml-4 flex-shrink-0">
            <ActionsMenu actions={actions} />
          </div>
        )}
      </div>

      {/* Indicador de estado compartiendo */}
      {isSharing && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-center">
            <div className="flex items-center text-sm text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Compartiendo...
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TarjetaTrabajoDelivery;