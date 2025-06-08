// src/components/shift/ShiftTypeBadge/index.jsx

import React from 'react';
import { Sun, Sunset, Moon } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';

const ShiftTypeBadge = ({ tipoTurno }) => {
  const { coloresTemáticos } = useApp();
  
  const tipos = {
    diurno: {
      icon: Sun,
      label: 'Diurno',
      color: '#F59E0B',
      bgColor: '#FEF3C7'
    },
    tarde: {
      icon: Sunset,
      label: 'Tarde',
      color: '#F97316',
      bgColor: '#FED7AA'
    },
    noche: {
      icon: Moon,
      label: 'Noche',
      color: coloresTemáticos?.base || '#6366F1',
      bgColor: coloresTemáticos?.transparent10 || '#E0E7FF'
    }
  };

  const tipo = tipos[tipoTurno] || tipos.diurno;
  const Icon = tipo.icon;

  return (
    <div 
      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
      style={{ 
        backgroundColor: tipo.bgColor,
        color: tipo.color
      }}
    >
      <Icon size={12} className="mr-1" />
      {tipo.label}
    </div>
  );
};

export default ShiftTypeBadge;