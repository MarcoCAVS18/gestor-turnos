// src/components/cards/TarjetaTrabajo/index.jsx (VERSIÓN MEJORADA)
import React, { useState } from 'react';
import { Edit, Trash2, Clock, DollarSign, Users, Info, Share2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useApp } from '../../../contexts/AppContext';
import { useShare } from '../../../hooks/useShare';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const TarjetaTrabajo = ({ trabajo, abrirModalEditarTrabajo, eliminarTrabajo }) => {
  const { currentUser } = useAuth();
  const { turnos, calcularPago } = useApp();
  const { sharing, messages, shareWork } = useShare();
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  
  // Calcular estadísticas del trabajo
  const turnosDelTrabajo = turnos.filter(turno => turno.trabajoId === trabajo.id);
  
  const totalGanado = turnosDelTrabajo.reduce((total, turno) => {
    const { totalConDescuento } = calcularPago(turno);
    return total + totalConDescuento;
  }, 0);
  
  const horasTrabajadas = turnosDelTrabajo.reduce((total, turno) => {
    const { horas } = calcularPago(turno);
    return total + horas;
  }, 0);
  
  const isSharing = sharing[trabajo.id] || false;
  const shareMessage = messages[trabajo.id] || '';
  
  return (
    <Card
      borderColor={trabajo.color}
      borderPosition="left"
      hover={true}
      className="transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{trabajo.nombre}</h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMostrarDetalles(!mostrarDetalles)}
            icon={Info}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => abrirModalEditarTrabajo(trabajo)}
            icon={Edit}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => shareWork(trabajo)}
            loading={isSharing}
            icon={Share2}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => eliminarTrabajo(trabajo.id)}
            icon={Trash2}
            className="text-red-500 hover:text-red-700"
          />
        </div>
      </div>
      
      {shareMessage && (
        <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">{shareMessage}</p>
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
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Tarifa base</span>
            <span className="font-medium">${trabajo.tarifaBase.toFixed(2)}/hora</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Diurno</span>
            <span className="font-medium">${trabajo.tarifas.diurno.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tarde</span>
            <span className="font-medium">${trabajo.tarifas.tarde.toFixed(2)}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Noche</span>
            <span className="font-medium">${trabajo.tarifas.noche.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Sábado</span>
            <span className="font-medium">${trabajo.tarifas.sabado.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Domingo</span>
            <span className="font-medium">${trabajo.tarifas.domingo.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TarjetaTrabajo;
