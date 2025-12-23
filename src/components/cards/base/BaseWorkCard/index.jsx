// src/components/cards/BaseWorkCard/index.jsx

import React from 'react';
import { Edit, Edit2, Trash2, Share2 } from 'lucide-react';
import Card from '../../../ui/Card';
import WorkAvatar from '../../../work/WorkAvatar';
import ActionsMenu from '../../../ui/ActionsMenu';
import Badge from '../../../ui/Badge';
import { DELIVERY_VEHICLES, DELIVERY_PLATFORMS_AUSTRALIA } from '../../../../constants/delivery';

const BaseWorkCard = ({
  trabajo,
  type = 'traditional', // 'traditional' | 'delivery'
  onEdit,
  onDelete,
  onShare,
  showActions = true,
  variant = 'default',
  isSharing = false,
  children // Para contenido personalizado
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

  // Configuración según tipo
  const config = {
    traditional: {
      badge: { variant: 'primary', label: 'Tradicional' },
      editIcon: Edit,
      defaultColor: '#EC4899'
    },
    delivery: {
      badge: { variant: 'success', label: 'Delivery' },
      editIcon: Edit2,
      defaultColor: '#10b981'
    }
  };

  const currentConfig = config[type];

  // --- Avatar & Naming Logic ---
  const nombreTrabajo = trabajo.nombre || 'Trabajo sin nombre';
  let colorTrabajo = trabajo.color || trabajo.colorAvatar || currentConfig.defaultColor;
  let iconName = null;
  
  if (type === 'delivery') {
    // El color se basa en la plataforma
    if (trabajo.plataforma) {
      const platformName = trabajo.plataforma.toLowerCase();
      const platformData = DELIVERY_PLATFORMS_AUSTRALIA.find(p => p.nombre.toLowerCase() === platformName);
      if (platformData) {
        colorTrabajo = platformData.color;
      }
    }
    
    // El ícono se basa en el vehículo
    if (trabajo.vehiculo) {
      const vehicleName = trabajo.vehiculo.toLowerCase();
      const vehicleData = DELIVERY_VEHICLES.find(v => v.id === vehicleName || v.nombre.toLowerCase() === vehicleName);
      if (vehicleData) {
        iconName = vehicleData.id;
      } else {
        iconName = 'default'; // fallback to truck
      }
    } else {
      iconName = 'default'; // fallback to truck
    }
  }

  const descripcion = trabajo.descripcion && trabajo.descripcion.trim()
    ? trabajo.descripcion
    : 'No olvides guardar más información sobre tu trabajo.';

  // Configurar acciones del menú
  const actions = [
    {
      icon: currentConfig.editIcon,
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

  return (
    <Card
      variant={variant}
      hover={true}
      className={isSharing ? 'opacity-70' : ''}
    >
      <div className="flex items-center">
        {/* Columna 1: Avatar */}
        <div className="flex-shrink-0">
          <WorkAvatar
            nombre={nombreTrabajo}
            color={colorTrabajo}
            iconName={iconName}
            size="lg"
          />
        </div>

        {/* Columna 2: Título, Badge y Descripción */}
        <div className="flex-1 ml-4 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-800 truncate">
              {nombreTrabajo}
            </h3>
            <Badge
              variant={currentConfig.badge.variant}
              size="xs"
              rounded
            >
              {currentConfig.badge.label}
            </Badge>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed italic">
            {descripcion}
          </p>
        </div>

        {/* Columna 3: Acciones */}
        {showActions && (
          <div className="ml-4 flex-shrink-0">
            <ActionsMenu actions={actions} />
          </div>
        )}
      </div>

      {/* Contenido Personalizado (Tarifas) */}
      {children && <div className="mt-4 border-t border-gray-200 pt-4">{children}</div>}
    </Card>
  );
};

export default BaseWorkCard;