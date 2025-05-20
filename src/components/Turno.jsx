// src/components/Turno.jsx

import React from 'react';
import { useApp } from '../contexts/AppContext';

const Turno = ({ turno, trabajo }) => {
  const { calcularPago } = useApp();
  const { horas, total, totalConDescuento } = calcularPago(turno);
  
  return (
    <div 
      className="p-4 mb-3 rounded-lg relative pl-6"
      style={{ 
        backgroundColor: `${trabajo.color}15`, 
        borderColor: trabajo.color,
        borderWidth: '1px'
      }}
    >
      <div 
        className="absolute top-0 left-0 bottom-0 w-2 rounded-l-lg"
        style={{ backgroundColor: trabajo.color }}
      />
      
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-800">{trabajo.nombre}</h4>
          <p className="text-gray-600 text-sm">
            {turno.horaInicio} - {turno.horaFin} ({horas.toFixed(1)}h)
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">
            Tarifa: ${trabajo.tarifas[turno.tipo].toFixed(2)}
          </p>
          <p className="text-sm line-through text-gray-500">
            ${total.toFixed(2)}
          </p>
          <p className="font-semibold">
            ${totalConDescuento.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Turno;