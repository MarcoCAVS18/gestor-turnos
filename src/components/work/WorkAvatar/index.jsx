// src/components/work/WorkAvatar/index.jsx 

import React from 'react';
import { Bike, Car, User, Truck } from 'lucide-react';
import MotorbikeIcon from '../../icons/MotorbikeIcon';
import Flex from '../../ui/Flex';

const WorkAvatar = ({ nombre, color, size = 'md', iconName }) => {
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
    bicicleta: <Bike size={currentIconSize} className="text-white" />,
    moto: <MotorbikeIcon size={currentIconSize} className="text-white" />,
    auto: <Car size={currentIconSize} className="text-white" />,
    'a_pie': <User size={currentIconSize} className="text-white" />,
    default: <Truck size={currentIconSize} className="text-white" />
  };

  const nombreSeguro = nombre || 'T';
  const colorSeguro = color || '#EC4899';
  const sizeSeguro = sizes[size] || sizes.md;

  const inicial = nombreSeguro.toString().charAt(0).toUpperCase() || 'T';

  const content = iconName && iconMap[iconName] 
    ? iconMap[iconName] 
    : <span className="text-white font-bold">{inicial}</span>;

  return (
    <Flex variant="center" 
      className={`${sizeSeguro} rounded-lg`}
      style={{ backgroundColor: colorSeguro }}
    >
      {content}
    </Flex>
  );
};

export default WorkAvatar;
