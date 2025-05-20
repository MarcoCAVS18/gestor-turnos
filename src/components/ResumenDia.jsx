// src/components/ResumenDia.jsx

import React from 'react';
import Turno from './Turno';
import { useApp } from '../contexts/AppContext';

const ResumenDia = ({ fecha, turnos }) => {
  const { trabajos, calcularTotalDia, formatearFecha } = useApp();
  
  return (
    <div className="bg-white mb-4 rounded-xl shadow-md overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b">
        <h3 className="font-semibold">{formatearFecha(fecha)}</h3>
      </div>
      
      <div className="p-4">
        {turnos.map(turno => {
          const trabajo = trabajos.find(t => t.id === turno.trabajoId);
          if (!trabajo) return null;
          
          return (
            <Turno 
              key={turno.id} 
              turno={turno} 
              trabajo={trabajo} 
            />
          );
        })}
        
        <div className="flex justify-between bg-gray-100 px-4 py-3 rounded-lg mt-2">
          <span className="font-semibold">Total del día:</span>
          <span className="font-semibold">${calcularTotalDia(turnos).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default ResumenDia;
