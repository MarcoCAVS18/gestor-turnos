// src/components/shift/ShiftTypeBadge/index.jsx

import React from 'react';
import ***REMOVED*** Sun, Sunset, Moon ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';

const ShiftTypeBadge = (***REMOVED*** tipoTurno ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors ***REMOVED*** = useApp();
  
  const tipos = ***REMOVED***
    diurno: ***REMOVED***
      icon: Sun,
      label: 'Diurno',
      color: '#F59E0B',
      bgColor: '#FEF3C7'
    ***REMOVED***,
    tarde: ***REMOVED***
      icon: Sunset,
      label: 'Tarde',
      color: '#F97316',
      bgColor: '#FED7AA'
    ***REMOVED***,
    noche: ***REMOVED***
      icon: Moon,
      label: 'Noche',
      color: thematicColors?.base || '#6366F1',
      bgColor: thematicColors?.transparent10 || '#E0E7FF'
    ***REMOVED***
  ***REMOVED***;

  const tipo = tipos[tipoTurno] || tipos.diurno;
  const Icon = tipo.icon;

  return (
    <div 
      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
      style=***REMOVED******REMOVED*** 
        backgroundColor: tipo.bgColor,
        color: tipo.color
      ***REMOVED******REMOVED***
    >
      <Icon size=***REMOVED***12***REMOVED*** className="mr-1" />
      ***REMOVED***tipo.label***REMOVED***
    </div>
  );
***REMOVED***;

export default ShiftTypeBadge;