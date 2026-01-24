// src/components/cards/BaseWorkCard/index.jsx

import React from 'react';
import ***REMOVED*** Edit, Edit2, Trash2, Share2 ***REMOVED*** from 'lucide-react';
import Card from '../../../ui/Card';
import WorkAvatar from '../../../work/WorkAvatar';
import ActionsMenu from '../../../ui/ActionsMenu';
import Badge from '../../../ui/Badge';
import ***REMOVED*** DELIVERY_VEHICLES, DELIVERY_PLATFORMS_AUSTRALIA ***REMOVED*** from '../../../../constants/delivery';

const BaseWorkCard = (***REMOVED***
  work,
  type = 'traditional', // 'traditional' | 'delivery'
  onEdit,
  onDelete,
  onShare,
  showActions = true,
  variant = 'default',
  isSharing = false,
  children // For custom content
***REMOVED***) => ***REMOVED***
  // Defensive validation
  if (!work) ***REMOVED***
    return (
      <Card variant="outlined" className="opacity-50">
        <div className="text-center text-gray-500">
          <p className="text-sm">Work not found</p>
        </div>
      </Card>
    );
  ***REMOVED***

  // Configuration based on type
  const config = ***REMOVED***
    traditional: ***REMOVED***
      badge: ***REMOVED*** variant: 'primary', label: 'Traditional' ***REMOVED***,
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
  const workName = work.name || 'Unnamed work';
  let workColor = work.color || work.avatarColor || currentConfig.defaultColor;
  let iconName = null;
  
  if (type === 'delivery') ***REMOVED***
    // The color is based on the platform
    if (work.platform) ***REMOVED***
      const platformName = work.platform.toLowerCase();
      const platformData = DELIVERY_PLATFORMS_AUSTRALIA.find(p => p.name.toLowerCase() === platformName);
      if (platformData) ***REMOVED***
        workColor = platformData.color;
      ***REMOVED***
    ***REMOVED***
    
    // The icon is based on the vehicle
    if (work.vehicle) ***REMOVED***
      const vehicleName = work.vehicle.toLowerCase();
      const vehicleData = DELIVERY_VEHICLES.find(v => v.id === vehicleName || v.name.toLowerCase() === vehicleName);
      if (vehicleData) ***REMOVED***
        iconName = vehicleData.id;
      ***REMOVED*** else ***REMOVED***
        iconName = 'default'; // fallback to truck
      ***REMOVED***
    ***REMOVED*** else ***REMOVED***
      iconName = 'default'; // fallback to truck
    ***REMOVED***
  ***REMOVED***

  const description = work.description && work.description.trim()
    ? work.description
    : 'Don\'t forget to save more information about your work.';

  // Configure menu actions
  const actions = [
    ***REMOVED***
      icon: currentConfig.editIcon,
      label: 'Edit',
      onClick: () => onEdit?.(work)
    ***REMOVED***,
    ...(onShare ? [***REMOVED***
      icon: Share2,
      label: 'Share',
      onClick: () => onShare?.(work),
      disabled: isSharing
    ***REMOVED***] : []),
    ***REMOVED***
      icon: Trash2,
      label: 'Delete',
      onClick: () => onDelete?.(work),
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
        ***REMOVED***/* Column 1: Avatar */***REMOVED***
        <div className="flex-shrink-0">
          <WorkAvatar
            name=***REMOVED***workName***REMOVED***
            color=***REMOVED***workColor***REMOVED***
            iconName=***REMOVED***iconName***REMOVED***
            size="lg"
          />
        </div>

        ***REMOVED***/* Column 2: Title, Badge and Description */***REMOVED***
        <div className="flex-1 ml-4 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-800 truncate">
              ***REMOVED***workName***REMOVED***
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
            ***REMOVED***description***REMOVED***
          </p>
        </div>

        ***REMOVED***/* Column 3: Actions */***REMOVED***
        ***REMOVED***showActions && (
          <div className="ml-4 flex-shrink-0">
            <ActionsMenu actions=***REMOVED***actions***REMOVED*** />
          </div>
        )***REMOVED***
      </div>

      ***REMOVED***/* Custom Content (Rates) */***REMOVED***
      ***REMOVED***children && <div className="mt-4 border-t border-gray-200 pt-4">***REMOVED***children***REMOVED***</div>***REMOVED***
    </Card>
  );
***REMOVED***;

export default BaseWorkCard;