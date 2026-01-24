// src/components/cards/BaseWorkCard/index.jsx

import React from 'react';
import { Edit, Edit2, Trash2, Share2 } from 'lucide-react';
import Card from '../../../ui/Card';
import WorkAvatar from '../../../work/WorkAvatar';
import ActionsMenu from '../../../ui/ActionsMenu';
import Badge from '../../../ui/Badge';
import { DELIVERY_VEHICLES, DELIVERY_PLATFORMS_AUSTRALIA } from '../../../../constants/delivery';

const BaseWorkCard = ({
  work,
  type = 'traditional', // 'traditional' | 'delivery'
  onEdit,
  onDelete,
  onShare,
  showActions = true,
  variant = 'default',
  isSharing = false,
  children // For custom content
}) => {
  // Defensive validation
  if (!work) {
    return (
      <Card variant="outlined" className="opacity-50">
        <div className="text-center text-gray-500">
          <p className="text-sm">Work not found</p>
        </div>
      </Card>
    );
  }

  // Configuration based on type
  const config = {
    traditional: {
      badge: { variant: 'primary', label: 'Traditional' },
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
  const workName = work.name || 'Unnamed work';
  let workColor = work.color || work.avatarColor || currentConfig.defaultColor;
  let iconName = null;
  
  if (type === 'delivery') {
    // The color is based on the platform
    if (work.platform) {
      const platformName = work.platform.toLowerCase();
      const platformData = DELIVERY_PLATFORMS_AUSTRALIA.find(p => p.name.toLowerCase() === platformName);
      if (platformData) {
        workColor = platformData.color;
      }
    }
    
    // The icon is based on the vehicle
    if (work.vehicle) {
      const vehicleName = work.vehicle.toLowerCase();
      const vehicleData = DELIVERY_VEHICLES.find(v => v.id === vehicleName || v.name.toLowerCase() === vehicleName);
      if (vehicleData) {
        iconName = vehicleData.id;
      } else {
        iconName = 'default'; // fallback to truck
      }
    } else {
      iconName = 'default'; // fallback to truck
    }
  }

  const description = work.description && work.description.trim()
    ? work.description
    : 'Don\'t forget to save more information about your work.';

  // Configure menu actions
  const actions = [
    {
      icon: currentConfig.editIcon,
      label: 'Edit',
      onClick: () => onEdit?.(work)
    },
    ...(onShare ? [{
      icon: Share2,
      label: 'Share',
      onClick: () => onShare?.(work),
      disabled: isSharing
    }] : []),
    {
      icon: Trash2,
      label: 'Delete',
      onClick: () => onDelete?.(work),
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
        {/* Column 1: Avatar */}
        <div className="flex-shrink-0">
          <WorkAvatar
            name={workName}
            color={workColor}
            iconName={iconName}
            size="lg"
          />
        </div>

        {/* Column 2: Title, Badge and Description */}
        <div className="flex-1 ml-4 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-800 truncate">
              {workName}
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
            {description}
          </p>
        </div>

        {/* Column 3: Actions */}
        {showActions && (
          <div className="ml-4 flex-shrink-0">
            <ActionsMenu actions={actions} />
          </div>
        )}
      </div>

      {/* Custom Content (Rates) */}
      {children && <div className="mt-4 border-t border-gray-200 pt-4">{children}</div>}
    </Card>
  );
};

export default BaseWorkCard;