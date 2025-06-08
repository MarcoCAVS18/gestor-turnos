// src/components/dashboard/TopWorkCard/index.jsx

import React from 'react';
import { Award } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import Card from '../../ui/Card';

const TopWorkCard = ({ trabajoMasRentable }) => {
  const { coloresTemáticos } = useApp();

  if (!trabajoMasRentable) return null;

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Award size={20} style={{ color: coloresTemáticos?.base }} className="mr-2" />
        Trabajo más rentable
      </h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div 
            className="w-4 h-4 rounded-full mr-3"
            style={{ backgroundColor: trabajoMasRentable.trabajo.color }}
          />
          <div>
            <p className="font-semibold text-gray-800">
              {trabajoMasRentable.trabajo.nombre}
            </p>
            <p className="text-sm text-gray-600">
              {trabajoMasRentable.turnos} turnos • {trabajoMasRentable.horas.toFixed(1)}h
            </p>
          </div>
        </div>
        <p 
          className="text-xl font-bold" 
          style={{ color: coloresTemáticos?.base }}
        >
          ${trabajoMasRentable.ganancia.toFixed(2)}
        </p>
      </div>
    </Card>
  );
};

export default TopWorkCard;