// src/components/cards/BaseWorkCard/index.jsx

import React from 'react';
import ***REMOVED*** Edit, Edit2, Trash2, Share2 ***REMOVED*** from 'lucide-react';
import Card from '../../../ui/Card';
import WorkAvatar from '../../../work/WorkAvatar';
import ActionsMenu from '../../../ui/ActionsMenu';
import Badge from '../../../ui/Badge';
import LoadingSpinner from '../../../ui/LoadingSpinner/LoadingSpinner';
import Flex from '../../../ui/Flex';

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

  // Valores por defecto
  const nombreTrabajo = trabajo.nombre || 'Trabajo sin nombre';
  const colorTrabajo = trabajo.color || trabajo.colorAvatar || currentConfig.defaultColor;
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
      <Flex variant="start-between">
        <div className="flex items-start flex-1 min-w-0">
          ***REMOVED***/* Avatar del trabajo */***REMOVED***
          <WorkAvatar
            nombre=***REMOVED***nombreTrabajo***REMOVED***
            color=***REMOVED***colorTrabajo***REMOVED***
            size="lg"
          />

          <div className="flex-1 ml-4 min-w-0">
            ***REMOVED***/* Nombre del trabajo y badge */***REMOVED***
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-800 truncate">
                ***REMOVED***nombreTrabajo***REMOVED***
              </h3>

              ***REMOVED***/* Badge del tipo */***REMOVED***
              <Badge
                variant=***REMOVED***currentConfig.badge.variant***REMOVED***
                size="xs"
                rounded
              >
                ***REMOVED***currentConfig.badge.label***REMOVED***
              </Badge>
            </div>

            ***REMOVED***/* Descripción */***REMOVED***
            <p className="text-gray-600 text-sm mb-3 leading-relaxed italic">
              ***REMOVED***descripcion***REMOVED***
            </p>

            ***REMOVED***/* Contenido personalizado (tarifas para traditional, plataforma/vehículo para delivery) */***REMOVED***
            ***REMOVED***children***REMOVED***
          </div>
        </div>

        ***REMOVED***/* Menú de acciones */***REMOVED***
        ***REMOVED***showActions && (
          <div className="ml-4 flex-shrink-0">
            <ActionsMenu actions=***REMOVED***actions***REMOVED*** />
          </div>
        )***REMOVED***
      </Flex>

      ***REMOVED***/* Indicador de estado compartiendo */***REMOVED***
      ***REMOVED***isSharing && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <Flex variant="center" className="pt-1">
            <Flex variant="center"className="text-sm text-blue-600">
              <LoadingSpinner size="h-4 w-4" color="border-blue-600" className="mr-2" />
              Compartiendo...
            </Flex>
          </Flex>
        </div>
      )***REMOVED***
    </Card>
  );
***REMOVED***;

export default BaseWorkCard;