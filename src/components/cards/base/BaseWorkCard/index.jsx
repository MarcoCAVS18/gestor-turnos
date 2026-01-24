// src/components/cards/BaseWorkCard/index.jsx

import React from 'react';
import { Edit, Edit2, Trash2, Share2, MoreVertical, Briefcase, Bike } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../../../ui/Card';
import WorkAvatar from '../../../work/WorkAvatar';
import ActionsMenu from '../../../ui/ActionsMenu';
import Badge from '../../../ui/Badge';
import Flex from '../../../ui/Flex';
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
      badge: { variant: 'primary', label: 'Traditional', icon: Briefcase },
      editIcon: Edit,
      defaultColor: '#EC4899'
    },
    delivery: {
      badge: { variant: 'success', label: 'Delivery', icon: Bike },
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

  const BadgeIcon = currentConfig.badge.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card
        className={`h-full flex flex-col overflow-hidden border-2 transition-all duration-300 hover:shadow-xl ${
          isSharing ? 'opacity-70' : ''
        }`}
        style={{ borderColor: `${workColor}15` }}
      >
        {/* Header with gradient background */}
        <div
          className="relative p-6 pb-16"
          style={{
            background: `linear-gradient(135deg, ${workColor}15 0%, ${workColor}05 100%)`
          }}
        >
          {/* Actions menu - top right */}
          {showActions && (
            <div className="absolute top-3 right-3">
              <ActionsMenu
                actions={actions}
                trigger={
                  <button className="p-2 rounded-full hover:bg-white/50 transition-colors">
                    <MoreVertical size={18} className="text-gray-600" />
                  </button>
                }
              />
            </div>
          )}

          {/* Avatar centered */}
          <Flex variant="center" className="flex-col">
            <div className="mb-3">
              <WorkAvatar
                name={workName}
                color={workColor}
                iconName={iconName}
                size="xl"
              />
            </div>

            {/* Work name */}
            <h3 className="font-bold text-lg text-gray-800 text-center truncate max-w-full px-2">
              {workName}
            </h3>

            {/* Type badge */}
            <div className="mt-2">
              <Badge
                variant={currentConfig.badge.variant}
                size="sm"
                rounded
                className="flex items-center gap-1"
              >
                <BadgeIcon size={12} />
                {currentConfig.badge.label}
              </Badge>
            </div>
          </Flex>
        </div>

        {/* Stats/Content section - overlapping card */}
        <div className="px-6 -mt-10 relative z-10 flex-grow">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 min-h-[120px] flex flex-col justify-center">
            {children}
          </div>
        </div>

        {/* Footer - description or platform */}
        <div className="px-6 pb-6 mt-4">
          {type === 'delivery' && work.platform ? (
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Platform</p>
              <p className="text-sm font-semibold" style={{ color: workColor }}>
                {work.platform}
              </p>
            </div>
          ) : work.description ? (
            <p className="text-xs text-gray-600 text-center line-clamp-2 italic">
              {work.description}
            </p>
          ) : (
            <p className="text-xs text-gray-400 text-center italic">
              No description
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default BaseWorkCard;