// src/components/TarjetaTrabajo.jsx 

import React, { useState } from 'react';
import { Edit, Trash2, Clock, DollarSign, Users, Info } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const TarjetaTrabajo = ({ trabajo, abrirModalEditarTrabajo, eliminarTrabajo }) => {
  const { turnos, calcularPago } = useApp();
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  
  // Calcular estadísticas del trabajo
  const turnosDelTrabajo = turnos.filter(turno => turno.trabajoId === trabajo.id);
  
  // Calcular total ganado con este trabajo
  const totalGanado = turnosDelTrabajo.reduce((total, turno) => {
    const { totalConDescuento } = calcularPago(turno);
    return total + totalConDescuento;
  }, 0);
  
  // Calcular total de horas trabajadas
  const horasTrabajadas = turnosDelTrabajo.reduce((total, turno) => {
    const { horas } = calcularPago(turno);
    return total + horas;
  }, 0);
  
  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl hover:translate-y-[-5px]"
      style={{ borderTop: `6px solid ${trabajo.color}` }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">{trabajo.nombre}</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => setMostrarDetalles(!mostrarDetalles)}
              className="text-gray-500 hover:text-indigo-600 transition-colors"
            >
              <Info size={18} />
            </button>
            <button 
              onClick={() => abrirModalEditarTrabajo(trabajo)}
              className="text-gray-500 hover:text-indigo-600 transition-colors"
            >
              <Edit size={18} />
            </button>
            <button 
              onClick={() => eliminarTrabajo(trabajo.id)}
              className="text-gray-500 hover:text-red-600 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        
        {mostrarDetalles && (
          <div className="mb-4 bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center mb-2">
              <Clock size={16} className="text-gray-500 mr-2" />
              <span className="text-sm text-gray-700">
                {horasTrabajadas.toFixed(1)} horas trabajadas
              </span>
            </div>
            <div className="flex items-center mb-2">
              <DollarSign size={16} className="text-gray-500 mr-2" />
              <span className="text-sm text-gray-700">
                ${totalGanado.toFixed(2)} ganados
              </span>
            </div>
            <div className="flex items-center">
              <Users size={16} className="text-gray-500 mr-2" />
              <span className="text-sm text-gray-700">
                {turnosDelTrabajo.length} turnos realizados
              </span>
            </div>
          </div>
        )}
        
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">Tarifa base</span>
          <span className="font-medium">${trabajo.tarifaBase.toFixed(2)}/hora</span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span className="text-gray-500 text-sm">Turno diurno</span>
          <span className="text-sm">${trabajo.tarifas.diurno.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span className="text-gray-500 text-sm">Turno tarde</span>
          <span className="text-sm">${trabajo.tarifas.tarde.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span className="text-gray-500 text-sm">Turno noche</span>
          <span className="text-sm">${trabajo.tarifas.noche.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span className="text-gray-500 text-sm">Sábado</span>
          <span className="text-sm">${trabajo.tarifas.sabado.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span className="text-gray-500 text-sm">Domingo</span>
          <span className="text-sm">${trabajo.tarifas.domingo.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default TarjetaTrabajo;