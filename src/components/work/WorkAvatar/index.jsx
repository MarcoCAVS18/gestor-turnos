// src/components/work/WorkAvatar/index.jsx 

import React from 'react';
import ***REMOVED*** Bike, Car, User, Truck ***REMOVED*** from 'lucide-react';
import MotorbikeIcon from '../../icons/MotorbikeIcon';
import Flex from '../../ui/Flex';

const WorkAvatar = (***REMOVED*** name, color, size = 'md', iconName ***REMOVED***) => ***REMOVED***
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
    bicycle: <Bike size=***REMOVED***currentIconSize***REMOVED*** className="text-white" />,
    motorbike: <MotorbikeIcon size=***REMOVED***currentIconSize***REMOVED*** className="text-white" />,
    car: <Car size=***REMOVED***currentIconSize***REMOVED*** className="text-white" />,
    'on_foot': <User size=***REMOVED***currentIconSize***REMOVED*** className="text-white" />,
    default: <Truck size=***REMOVED***currentIconSize***REMOVED*** className="text-white" />
  ***REMOVED***;

  const safeName = name || 'W';
  const safeColor = color || '#EC4899';
  const safeSize = sizes[size] || sizes.md;

  const initial = safeName.toString().charAt(0).toUpperCase() || 'W';

  const content = iconName && iconMap[iconName] 
    ? iconMap[iconName] 
    : <span className="text-white font-bold">***REMOVED***initial***REMOVED***</span>;

  return (
    <Flex variant="center" 
      className=***REMOVED***`$***REMOVED***safeSize***REMOVED*** rounded-lg`***REMOVED***
      style=***REMOVED******REMOVED*** backgroundColor: safeColor ***REMOVED******REMOVED***
    >
      ***REMOVED***content***REMOVED***
    </Flex>
  );
***REMOVED***;

export default WorkAvatar;
