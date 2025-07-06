// src/components/shift/ShiftTypeBadge/index.jsx

import React from 'react';
import { Sun, Sunset, Moon, Calendar, Truck, Clock } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';

const ShiftTypeBadge = ({ tipoTurno, turno, size = 'sm' }) => {
  const { thematicColors, shiftRanges } = useApp();
  
  // Función para determinar tipo de turno por rangos
  const getTipoTurnoByHour = (hora) => {
    const ranges = shiftRanges || {
      dayStart: 6, dayEnd: 14,
      afternoonStart: 14, afternoonEnd: 20,
      nightStart: 20
    };

    if (hora >= ranges.dayStart && hora < ranges.dayEnd) {
      return 'diurno';
    } else if (hora >= ranges.afternoonStart && hora < ranges.afternoonEnd) {
      return 'tarde';
    } else {
      return 'noche';
    }
  };

  // Si se pasa el turno completo, determinar el tipo automáticamente
  const determinarTipoTurno = (turnoData) => {
    if (!turnoData) return 'noche';
    
    // Si es delivery, retornar delivery
    if (turnoData.tipo === 'delivery' || turnoData.type === 'delivery') {
      return 'delivery';
    }
    
    // Determinar por fecha (fin de semana)
    if (turnoData.fecha) {
      const [year, month, day] = turnoData.fecha.split('-');
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay();
      
      if (dayOfWeek === 0) return 'domingo';
      if (dayOfWeek === 6) return 'sabado';
    }
    
    // Determinar por hora de inicio y fin para detectar turnos mixtos
    if (turnoData.horaInicio && turnoData.horaFin) {
      const [horaInicio, minutoInicio] = turnoData.horaInicio.split(':').map(Number);
      const [horaFin, minutoFin] = turnoData.horaFin.split(':').map(Number);
      
      const inicioMinutos = horaInicio * 60 + minutoInicio;
      let finMinutos = horaFin * 60 + minutoFin;
      
      // Si cruza medianoche
      if (finMinutos <= inicioMinutos) {
        finMinutos += 24 * 60;
      }
      
      const tiposEncontrados = new Set();
      
      // Revisar cada hora del turno para ver si cambia de tipo
      for (let minutos = inicioMinutos; minutos < finMinutos; minutos += 60) {
        const horaActual = Math.floor((minutos % (24 * 60)) / 60);
        const tipo = getTipoTurnoByHour(horaActual);
        tiposEncontrados.add(tipo);
      }
      
      // Si hay más de un tipo, es mixto
      if (tiposEncontrados.size > 1) {
        return 'mixto';
      }
      
      // Si solo hay un tipo, retornar ese tipo
      return Array.from(tiposEncontrados)[0] || 'noche';
    }
    
    return 'noche';
  };
  
  const tipo = tipoTurno || determinarTipoTurno(turno);
  
  const tipos = {
    diurno: {
      icon: Sun,
      label: 'Diurno',
      color: '#F59E0B',
      bgColor: '#FEF3C7',
      description: 'Turno de día'
    },
    tarde: {
      icon: Sunset,
      label: 'Tarde',
      color: '#F97316',
      bgColor: '#FED7AA',
      description: 'Turno de tarde'
    },
    noche: {
      icon: Moon,
      label: 'Noche',
      color: thematicColors?.base || '#6366F1',
      bgColor: thematicColors?.transparent10 || '#E0E7FF',
      description: turno?.cruzaMedianoche ? 'Turno nocturno (cruza medianoche)' : 'Turno de noche'
    },
    sabado: {
      icon: Calendar,
      label: 'Sábado',
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
      description: 'Turno de sábado'
    },
    domingo: {
      icon: Calendar,
      label: 'Domingo',
      color: '#EF4444',
      bgColor: '#FEE2E2',
      description: 'Turno de domingo'
    },
    delivery: {
      icon: Truck,
      label: 'Delivery',
      color: '#10B981',
      bgColor: '#D1FAE5',
      description: 'Turno de delivery'
    },
    mixto: {
      icon: Clock,
      label: 'Mixto',
      color: '#6B7280',
      bgColor: '#F3F4F6',
      description: 'Turno mixto (múltiples tipos de horario)'
    }
  };

  const tipoInfo = tipos[tipo] || tipos.noche;
  const Icon = tipoInfo.icon;
  
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  const iconSizes = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16
  };

  return (
    <div 
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]}`}
      style={{ 
        backgroundColor: tipoInfo.bgColor,
        color: tipoInfo.color
      }}
      title={tipoInfo.description}
    >
      <Icon size={iconSizes[size]} className="mr-1 flex-shrink-0" />
      <span className="truncate">{tipoInfo.label}</span>
      
      {/* Indicador especial para turnos nocturnos */}
      {turno?.cruzaMedianoche && tipo === 'noche' && (
        <span className="ml-1 text-xs opacity-75">🌙</span>
      )}
      
      {/* Indicador especial para turnos mixtos */}
      {tipo === 'mixto' && (
        <span className="ml-1 text-xs opacity-75">🔄</span>
      )}
    </div>
  );
};

export default ShiftTypeBadge;