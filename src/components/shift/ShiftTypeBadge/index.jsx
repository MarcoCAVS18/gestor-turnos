// src/components/shift/ShiftTypeBadge/index.jsx

import React from 'react';
import ***REMOVED*** Sun, Sunset, Moon, Calendar, Truck, Clock ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';

const ShiftTypeBadge = (***REMOVED*** tipoTurno, turno, size = 'sm' ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** thematicColors, shiftRanges ***REMOVED*** = useApp();
  
  // Si se pasa el turno completo, determinar el tipo automáticamente
  const determinarTipoTurno = (turnoData) => ***REMOVED***
    if (!turnoData) return 'noche';
    
    // Si es delivery, retornar delivery
    if (turnoData.tipo === 'delivery' || turnoData.type === 'delivery') ***REMOVED***
      return 'delivery';
    ***REMOVED***
    
    // Si cruza medianoche, es nocturno
    if (turnoData.cruzaMedianoche) ***REMOVED***
      return 'noche';
    ***REMOVED***
    
    // Determinar por fecha (fin de semana)
    if (turnoData.fecha) ***REMOVED***
      const [year, month, day] = turnoData.fecha.split('-');
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay();
      
      if (dayOfWeek === 0) return 'domingo';
      if (dayOfWeek === 6) return 'sabado';
    ***REMOVED***
    
    // Determinar por hora de inicio
    if (turnoData.horaInicio) ***REMOVED***
      const [hora] = turnoData.horaInicio.split(':').map(Number);
      const ranges = shiftRanges || ***REMOVED***
        dayStart: 6, dayEnd: 14,
        afternoonStart: 14, afternoonEnd: 20,
        nightStart: 20
      ***REMOVED***;
      
      if (hora >= ranges.dayStart && hora < ranges.dayEnd) ***REMOVED***
        return 'diurno';
      ***REMOVED*** else if (hora >= ranges.afternoonStart && hora < ranges.afternoonEnd) ***REMOVED***
        return 'tarde';
      ***REMOVED*** else ***REMOVED***
        return 'noche';
      ***REMOVED***
    ***REMOVED***
    
    return 'noche';
  ***REMOVED***;
  
  const tipo = tipoTurno || determinarTipoTurno(turno);
  
  const tipos = ***REMOVED***
    diurno: ***REMOVED***
      icon: Sun,
      label: 'Diurno',
      color: '#F59E0B',
      bgColor: '#FEF3C7',
      description: 'Turno de día'
    ***REMOVED***,
    tarde: ***REMOVED***
      icon: Sunset,
      label: 'Tarde',
      color: '#F97316',
      bgColor: '#FED7AA',
      description: 'Turno de tarde'
    ***REMOVED***,
    noche: ***REMOVED***
      icon: Moon,
      label: 'Noche',
      color: thematicColors?.base || '#6366F1',
      bgColor: thematicColors?.transparent10 || '#E0E7FF',
      description: turno?.cruzaMedianoche ? 'Turno nocturno (cruza medianoche)' : 'Turno de noche'
    ***REMOVED***,
    sabado: ***REMOVED***
      icon: Calendar,
      label: 'Sábado',
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
      description: 'Turno de sábado'
    ***REMOVED***,
    domingo: ***REMOVED***
      icon: Calendar,
      label: 'Domingo',
      color: '#EF4444',
      bgColor: '#FEE2E2',
      description: 'Turno de domingo'
    ***REMOVED***,
    delivery: ***REMOVED***
      icon: Truck,
      label: 'Delivery',
      color: '#10B981',
      bgColor: '#D1FAE5',
      description: 'Turno de delivery'
    ***REMOVED***,
    mixto: ***REMOVED***
      icon: Clock,
      label: 'Mixto',
      color: '#6B7280',
      bgColor: '#F3F4F6',
      description: 'Turno mixto (múltiples tipos)'
    ***REMOVED***
  ***REMOVED***;

  const tipoInfo = tipos[tipo] || tipos.noche;
  const Icon = tipoInfo.icon;
  
  const sizeClasses = ***REMOVED***
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  ***REMOVED***;
  
  const iconSizes = ***REMOVED***
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16
  ***REMOVED***;

  return (
    <div 
      className=***REMOVED***`inline-flex items-center rounded-full font-medium $***REMOVED***sizeClasses[size]***REMOVED***`***REMOVED***
      style=***REMOVED******REMOVED*** 
        backgroundColor: tipoInfo.bgColor,
        color: tipoInfo.color
      ***REMOVED******REMOVED***
      title=***REMOVED***tipoInfo.description***REMOVED***
    >
      <Icon size=***REMOVED***iconSizes[size]***REMOVED*** className="mr-1 flex-shrink-0" />
      <span className="truncate">***REMOVED***tipoInfo.label***REMOVED***</span>
      
      ***REMOVED***/* Indicador especial para turnos nocturnos */***REMOVED***
      ***REMOVED***turno?.cruzaMedianoche && tipo === 'noche' && (
        <span className="ml-1 text-xs opacity-75">🌙</span>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default ShiftTypeBadge;