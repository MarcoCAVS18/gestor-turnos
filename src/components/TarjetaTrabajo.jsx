// src/components/TarjetaTrabajo.jsx

import React, { useState } from 'react';
import { Edit, Trash2, Clock, DollarSign, Users, Info, Share2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { compartirTrabajoNativo } from '../services/shareService';
import DynamicButton from './DynamicButton';

const TarjetaTrabajo = ({ trabajo, abrirModalEditarTrabajo, eliminarTrabajo }) => {
  const { currentUser } = useAuth();
  const { turnos, calcularPago } = useApp();
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [compartiendoTrabajo, setCompartiendoTrabajo] = useState(false);
  const [mensajeCompartir, setMensajeCompartir] = useState('');
  
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
  
  // Función para manejar el compartir trabajo
  const handleCompartirTrabajo = async () => {
    try {
      setCompartiendoTrabajo(true);
      setMensajeCompartir('');
      
      // Usar la función de compartir nativo
      await compartirTrabajoNativo(currentUser.uid, trabajo);
      
      setMensajeCompartir('Trabajo compartido exitosamente');
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        setMensajeCompartir('');
      }, 3000);
      
    } catch (error) {
      setMensajeCompartir('Error al compartir trabajo');
      setTimeout(() => {
        setMensajeCompartir('');
      }, 3000);
    } finally {
      setCompartiendoTrabajo(false);
    }
  };
  
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
              className="text-gray-500 hover:text-blue-600 transition-colors p-1"
            >
              <Info size={18} />
            </button>
            <button
              onClick={() => abrirModalEditarTrabajo(trabajo)}
              className="text-gray-500 hover:text-blue-600 transition-colors p-1"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={handleCompartirTrabajo}
              disabled={compartiendoTrabajo}
              className="text-gray-500 hover:text-blue-600 transition-colors p-1 disabled:opacity-50"
            >
              <Share2 size={18} />
            </button>
            <button 
              onClick={() => eliminarTrabajo(trabajo.id)}
              className="text-gray-500 hover:text-red-600 transition-colors p-1"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        
        {/* Mensaje de compartir */}
        {mensajeCompartir && (
          <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">{mensajeCompartir}</p>
          </div>
        )}
        
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