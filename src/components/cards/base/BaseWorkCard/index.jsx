// src/components/cards/BaseWorkCard/index.jsx

import React from 'react';
import ***REMOVED*** Edit, Edit2, Trash2, Share2 ***REMOVED*** from 'lucide-react';
import Card from '../../../ui/Card';
import WorkAvatar from '../../../work/WorkAvatar';
import ActionsMenu from '../../../ui/ActionsMenu';
import Badge from '../../../ui/Badge';
import ***REMOVED*** DELIVERY_VEHICLES, DELIVERY_PLATFORMS_AUSTRALIA ***REMOVED*** from '../../../../constants/delivery';

const BaseWorkCard = (***REMOVED***
  trabajo,
  type = 'traditional', // 'traditional' | 'delivery'
  onEdit,
  onDelete,
  onShare,
  showActions = true,
  variant = 'default',
  isSharing = false,
  children // Para contenido personalizado
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

  // Configuración según tipo
  const config = ***REMOVED***
    traditional: ***REMOVED***
      badge: ***REMOVED*** variant: 'primary', label: 'Tradicional' ***REMOVED***,
      editIcon: Edit,
      defaultColor: '#EC4899'
    ***REMOVED***,
    delivery: ***REMOVED***
      badge: ***REMOVED*** variant: 'success', label: 'Delivery' ***REMOVED***,
      editIcon: Edit2,
      defaultColor: '#10b981'
    ***REMOVED***
  ***REMOVED***;

  const currentConfig = config[type];

  // --- Avatar & Naming Logic ---
  const nombreTrabajo = trabajo.nombre || 'Trabajo sin nombre';
  let colorTrabajo = trabajo.color || trabajo.colorAvatar || currentConfig.defaultColor;
  let iconName = null;
  
  if (type === 'delivery') ***REMOVED***
    // El color se basa en la plataforma
    if (trabajo.plataforma) ***REMOVED***
      const platformName = trabajo.plataforma.toLowerCase();
      const platformData = DELIVERY_PLATFORMS_AUSTRALIA.find(p => p.nombre.toLowerCase() === platformName);
      if (platformData) ***REMOVED***
        colorTrabajo = platformData.color;
      ***REMOVED***
    ***REMOVED***
    
    // El ícono se basa en el vehículo
    if (trabajo.vehiculo) ***REMOVED***
      const vehicleName = trabajo.vehiculo.toLowerCase();
      const vehicleData = DELIVERY_VEHICLES.find(v => v.id === vehicleName || v.nombre.toLowerCase() === vehicleName);
      if (vehicleData) ***REMOVED***
        iconName = vehicleData.id;
      ***REMOVED*** else ***REMOVED***
        iconName = 'default'; // fallback to truck
      ***REMOVED***
    ***REMOVED*** else ***REMOVED***
      iconName = 'default'; // fallback to truck
    ***REMOVED***
  ***REMOVED***

  const descripcion = trabajo.descripcion && trabajo.descripcion.trim()
    ? trabajo.descripcion
    : 'No olvides guardar más información sobre tu trabajo.';

  // Configurar acciones del menú
  const actions = [
    ***REMOVED***
      icon: currentConfig.editIcon,
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

  return (
    <Card
      variant=***REMOVED***variant***REMOVED***
      hover=***REMOVED***true***REMOVED***
      className=***REMOVED***isSharing ? 'opacity-70' : ''***REMOVED***
    >
      <div className="flex items-center">
        ***REMOVED***/* Columna 1: Avatar */***REMOVED***
        <div className="flex-shrink-0">
          <WorkAvatar
            nombre=***REMOVED***nombreTrabajo***REMOVED***
            color=***REMOVED***colorTrabajo***REMOVED***
            iconName=***REMOVED***iconName***REMOVED***
            size="lg"
          />
        </div>

        ***REMOVED***/* Columna 2: Título, Badge y Descripción */***REMOVED***
        <div className="flex-1 ml-4 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-800 truncate">
              ***REMOVED***nombreTrabajo***REMOVED***
            </h3>
            <Badge
              variant=***REMOVED***currentConfig.badge.variant***REMOVED***
              size="xs"
              rounded
            >
              ***REMOVED***currentConfig.badge.label***REMOVED***
            </Badge>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed italic">
            ***REMOVED***descripcion***REMOVED***
          </p>
        </div>

        ***REMOVED***/* Columna 3: Acciones */***REMOVED***
        ***REMOVED***showActions && (
          <div className="ml-4 flex-shrink-0">
            <ActionsMenu actions=***REMOVED***actions***REMOVED*** />
          </div>
        )***REMOVED***
      </div>

      ***REMOVED***/* Contenido Personalizado (Tarifas) */***REMOVED***
      ***REMOVED***children && <div className="mt-4 border-t border-gray-200 pt-4">***REMOVED***children***REMOVED***</div>***REMOVED***
    </Card>
  );
***REMOVED***;

export default BaseWorkCard;