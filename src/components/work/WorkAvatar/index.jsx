// src/components/work/WorkAvatar/index.jsx 

import React from 'react';
import ***REMOVED*** Bike, Car, User, Truck ***REMOVED*** from 'lucide-react';
import MotorbikeIcon from '../../icons/MotorbikeIcon';
import Flex from '../../ui/Flex';

const WorkAvatar = (***REMOVED*** nombre, color, size = 'md', iconName ***REMOVED***) => ***REMOVED***
  const sizes = ***REMOVED***
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl'
  ***REMOVED***;

  const iconSizes = ***REMOVED***
    sm: 16,
    md: 20,
    lg: 24
  ***REMOVED***;

  const currentIconSize = iconSizes[size] || iconSizes.md;

  const iconMap = ***REMOVED***
    bicicleta: <Bike size=***REMOVED***currentIconSize***REMOVED*** className="text-white" />,
    moto: <MotorbikeIcon size=***REMOVED***currentIconSize***REMOVED*** className="text-white" />,
    auto: <Car size=***REMOVED***currentIconSize***REMOVED*** className="text-white" />,
    'a_pie': <User size=***REMOVED***currentIconSize***REMOVED*** className="text-white" />,
    default: <Truck size=***REMOVED***currentIconSize***REMOVED*** className="text-white" />
  ***REMOVED***;

  const nombreSeguro = nombre || 'T';
  const colorSeguro = color || '#EC4899';
  const sizeSeguro = sizes[size] || sizes.md;

  const inicial = nombreSeguro.toString().charAt(0).toUpperCase() || 'T';

  const content = iconName && iconMap[iconName] 
    ? iconMap[iconName] 
    : <span className="text-white font-bold">***REMOVED***inicial***REMOVED***</span>;

  return (
    <Flex variant="center" 
      className=***REMOVED***`$***REMOVED***sizeSeguro***REMOVED*** rounded-lg`***REMOVED***
      style=***REMOVED******REMOVED*** backgroundColor: colorSeguro ***REMOVED******REMOVED***
    >
      ***REMOVED***content***REMOVED***
    </Flex>
  );
***REMOVED***;

export default WorkAvatar;
