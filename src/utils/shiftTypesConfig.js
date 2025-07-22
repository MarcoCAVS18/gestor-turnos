// src/utils/shiftTypesConfig.js

import { Sun, Sunset, Moon, Calendar, Truck, Clock } from 'lucide-react';

export const getShiftTypesConfig = (thematicColors) => ({
  diurno: {
    id: 'diurno',
    label: 'Diurno',
    icon: Sun,
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    description: 'Turno de día'
  },
  tarde: {
    id: 'tarde',
    label: 'Tarde',
    icon: Sunset,
    color: '#F97316',
    bgColor: '#FED7AA',
    description: 'Turno de tarde'
  },
  noche: {
    id: 'noche',
    label: 'Noche',
    icon: Moon,
    color: thematicColors?.base || '#6366F1',
    bgColor: thematicColors?.transparent10 || '#E0E7FF',
    description: 'Turno de noche'
  },
  sabado: {
    id: 'sabado',
    label: 'Sábado',
    icon: Calendar,
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
    description: 'Turno de sábado'
  },
  domingo: {
    id: 'domingo',
    label: 'Domingo',
    icon: Calendar,
    color: '#EF4444',
    bgColor: '#FEE2E2',
    description: 'Turno de domingo'
  },
  delivery: {
    id: 'delivery',
    label: 'Delivery',
    icon: Truck,
    color: '#10B981',
    bgColor: '#D1FAE5',
    description: 'Turno de delivery'
  },
  mixto: {
    id: 'mixto',
    label: 'Mixto',
    icon: Clock,
    color: '#6B7280',
    bgColor: '#F3F4F6',
    description: 'Turno mixto (múltiples tipos de horario)'
  }
});

// Función para obtener tipos disponibles según los turnos existentes
export const getAvailableShiftTypes = (turnosPorFecha, shiftRanges, thematicColors) => {
  const allShiftTypes = getShiftTypesConfig(thematicColors);
  const availableTypes = new Set(['todos']); // Siempre incluir "todos"
  
  if (!turnosPorFecha) return [{ id: 'todos', label: 'Todos los tipos', icon: Clock, color: '#6B7280' }];
  
  // Importar dinámicamente la función para evitar dependencias circulares
  try {
    const { determinarTipoTurno } = require('./shiftDetailsUtils');
    
    // Analizar todos los turnos para ver qué tipos están presentes
    Object.values(turnosPorFecha).flat().forEach(turno => {
      const tipoTurno = determinarTipoTurno(turno, shiftRanges);
      availableTypes.add(tipoTurno);
    });
  } catch (error) {
    // Si no se puede importar, retornar tipos básicos
    console.warn('No se pudo determinar tipos de turno dinámicamente:', error);
    return [
      { id: 'todos', label: 'Todos los tipos', icon: Clock, color: '#6B7280' },
      ...Object.values(allShiftTypes)
    ];
  }
  
  // Retornar solo los tipos que están disponibles
  const result = [
    { id: 'todos', label: 'Todos los tipos', icon: Clock, color: '#6B7280' }
  ];
  
  availableTypes.forEach(tipo => {
    if (tipo !== 'todos' && allShiftTypes[tipo]) {
      result.push(allShiftTypes[tipo]);
    }
  });
  
  return result;
};