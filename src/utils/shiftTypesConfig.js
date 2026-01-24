// src/utils/shiftTypesConfig.js

import ***REMOVED*** Sun, Sunset, Moon, Calendar, Truck, Clock ***REMOVED*** from 'lucide-react';

export const getShiftTypesConfig = (thematicColors) => (***REMOVED***
  diurno: ***REMOVED***
    id: 'diurno',
    label: 'Diurno',
    icon: Sun,
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    description: 'Turno de día'
  ***REMOVED***,
  tarde: ***REMOVED***
    id: 'tarde',
    label: 'Tarde',
    icon: Sunset,
    color: '#F97316',
    bgColor: '#FED7AA',
    description: 'Turno de tarde'
  ***REMOVED***,
  noche: ***REMOVED***
    id: 'noche',
    label: 'Noche',
    icon: Moon,
    color: thematicColors?.base || '#6366F1',
    bgColor: thematicColors?.transparent10 || '#E0E7FF',
    description: 'Turno de noche'
  ***REMOVED***,
  sabado: ***REMOVED***
    id: 'sabado',
    label: 'Sábado',
    icon: Calendar,
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
    description: 'Turno de sábado'
  ***REMOVED***,
  domingo: ***REMOVED***
    id: 'domingo',
    label: 'Domingo',
    icon: Calendar,
    color: '#EF4444',
    bgColor: '#FEE2E2',
    description: 'Turno de domingo'
  ***REMOVED***,
  delivery: ***REMOVED***
    id: 'delivery',
    label: 'Delivery',
    icon: Truck,
    color: '#10B981',
    bgColor: '#D1FAE5',
    description: 'Turno de delivery'
  ***REMOVED***,
  mixto: ***REMOVED***
    id: 'mixto',
    label: 'Mixto',
    icon: Clock,
    color: '#6B7280',
    bgColor: '#F3F4F6',
    description: 'Turno mixto (múltiples tipos de horario)'
  ***REMOVED***
***REMOVED***);

// Función para obtener tipos disponibles según los turnos existentes
export const getAvailableShiftTypes = (turnosPorFecha, shiftRanges, thematicColors) => ***REMOVED***
  const allShiftTypes = getShiftTypesConfig(thematicColors);
  const availableTypes = new Set(['todos']); // Siempre incluir "todos"
  
  if (!turnosPorFecha) return [***REMOVED*** id: 'todos', label: 'Todos los tipos', icon: Clock, color: '#6B7280' ***REMOVED***];
  
  // Importar dinámicamente la función para evitar dependencias circulares
  try ***REMOVED***
    const ***REMOVED*** determineShiftType ***REMOVED*** = require('./shiftDetailsUtils');
    
    // Analizar todos los turnos para ver qué tipos están presentes
    Object.values(turnosPorFecha).flat().forEach(turno => ***REMOVED***
      const tipoTurno = determineShiftType(turno, shiftRanges);
      availableTypes.add(tipoTurno);
    ***REMOVED***);
  ***REMOVED*** catch (error) ***REMOVED***
    // Si no se puede importar, retornar tipos básicos
    console.warn('No se pudo determinar tipos de turno dinámicamente:', error);
    return [
      ***REMOVED*** id: 'todos', label: 'Todos los tipos', icon: Clock, color: '#6B7280' ***REMOVED***,
      ...Object.values(allShiftTypes)
    ];
  ***REMOVED***
  
  // Retornar solo los tipos que están disponibles
  const result = [
    ***REMOVED*** id: 'todos', label: 'Todos los tipos', icon: Clock, color: '#6B7280' ***REMOVED***
  ];
  
  availableTypes.forEach(tipo => ***REMOVED***
    if (tipo !== 'todos' && allShiftTypes[tipo]) ***REMOVED***
      result.push(allShiftTypes[tipo]);
    ***REMOVED***
  ***REMOVED***);
  
  return result;
***REMOVED***;