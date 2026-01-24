// src/components/work/WorkAvatar/index.jsx 

import React from 'react';
import { Bike, Car, User, Truck } from 'lucide-react';
import MotorbikeIcon from '../../icons/MotorbikeIcon';
import Flex from '../../ui/Flex';

const WorkAvatar = ({ name, color, size = 'md', iconName }) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  const currentIconSize = iconSizes[size] || iconSizes.md;

  const iconMap = {
    bicycle: <Bike size={currentIconSize} className="text-white" />,
    motorbike: <MotorbikeIcon size={currentIconSize} className="text-white" />,
    car: <Car size={currentIconSize} className="text-white" />,
    'on_foot': <User size={currentIconSize} className="text-white" />,
    default: <Truck size={currentIconSize} className="text-white" />
  };

  const safeName = name || 'W';
  const safeColor = color || '#EC4899';
  const safeSize = sizes[size] || sizes.md;

  const initial = safeName.toString().charAt(0).toUpperCase() || 'W';

  const content = iconName && iconMap[iconName] 
    ? iconMap[iconName] 
    : <span className="text-white font-bold">{initial}</span>;

  return (
    <Flex variant="center" 
      className={`${safeSize} rounded-lg`}
      style={{ backgroundColor: safeColor }}
    >
      {content}
    </Flex>
  );
};

export default WorkAvatar;
