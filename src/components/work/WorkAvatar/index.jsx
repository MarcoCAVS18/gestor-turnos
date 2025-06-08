// src/components/work/WorkAvatar/index.jsx

import React from 'react';

const WorkAvatar = (***REMOVED*** nombre, color, size = 'md' ***REMOVED***) => ***REMOVED***
  const sizes = ***REMOVED***
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl'
  ***REMOVED***;

  return (
    <div 
      className=***REMOVED***`$***REMOVED***sizes[size]***REMOVED*** rounded-lg flex items-center justify-center`***REMOVED***
      style=***REMOVED******REMOVED*** backgroundColor: color ***REMOVED******REMOVED***
    >
      <span className="text-white font-bold">
        ***REMOVED***nombre.charAt(0).toUpperCase()***REMOVED***
      </span>
    </div>
  );
***REMOVED***;

export default WorkAvatar;