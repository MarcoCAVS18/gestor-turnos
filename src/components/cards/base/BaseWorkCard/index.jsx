// src/components/cards/BaseWorkCard/index.jsx

import React from 'react';
import { Edit, Edit2, Trash2, Share2 } from 'lucide-react';
import Card from '../../../ui/Card';
import WorkAvatar from '../../../work/WorkAvatar';
import ActionsMenu from '../../../ui/ActionsMenu';
import Badge from '../../../ui/Badge';

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

  // Valores por defecto
  const nombreTrabajo = trabajo.nombre || 'Trabajo sin nombre';
  const colorTrabajo = trabajo.color || trabajo.colorAvatar || currentConfig.defaultColor;
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