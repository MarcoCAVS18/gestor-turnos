// src/components/cards/TarjetaTurnoDelivery/index.jsx

import React from 'react';
import { Clock, Package, Car, Edit2, Trash2, MoreVertical, Truck, DollarSign } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';
import InfoTooltip from '../../ui/InfoTooltip';

const TarjetaTurnoDelivery = ({ turno, trabajo, onEdit, onDelete }) => {
  const [menuAbierto, setMenuAbierto] = React.useState(false);
  const colors = useThemeColors();

  // Cerrar menú al hacer clic fuera
  React.useEffect(() => {
    const cerrarMenu = (e) => {
      if (menuAbierto && !e.target.closest('.menu-turno')) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener('click', cerrarMenu);
    return () => document.removeEventListener('click', cerrarMenu);
  }, [menuAbierto]);

  const formatearHoras = (horaInicio, horaFin) => {
    const [horaI, minI] = horaInicio.split(':').map(Number);
    const [horaF, minF] = horaFin.split(':').map(Number);
    
    const totalMinutos = (horaF * 60 + minF) - (horaI * 60 + minI);
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    
    if (minutos === 0) return `${horas}h`;
    return `${horas}h ${minutos}min`;
  };

  const gananciaNeta = turno.gananciaTotal - (turno.gastoCombustible || 0);
  const promedioPorPedido = turno.numeroPedidos > 0 ? turno.gananciaTotal / turno.numeroPedidos : 0;

  // Tooltip con información básica
  const tooltipContent = (
    <div className="space-y-2 text-xs text-left max-w-xs">
      <div className="font-semibold mb-2 border-b border-gray-600 pb-1">
        Resumen del Turno
      </div>
      
      <div className="space-y-1.5">
        <div className="flex justify-between gap-4">
          <span>Duración:</span>
          <span className="font-semibold">{formatearHoras(turno.horaInicio, turno.horaFin)}</span>
        </div>
        
        {turno.numeroPedidos > 0 && (
          <div className="flex justify-between gap-4">
            <span>Pedidos:</span>
            <span className="font-semibold">{turno.numeroPedidos}</span>
          </div>
        )}
        
        {turno.kilometros > 0 && (
          <div className="flex justify-between gap-4">
            <span>Kilómetros:</span>
            <span className="font-semibold">{turno.kilometros} km</span>
          </div>
        )}
        
        <div className="flex justify-between gap-4 border-t border-gray-600 pt-1.5 mt-2">
          <span className="font-semibold">Ganancia Total:</span>
          <span className="font-bold">{formatCurrency(turno.gananciaTotal)}</span>
        </div>
        
        <div className="flex justify-between gap-4">
          <span className="font-semibold">Ganancia Neta:</span>
          <span className="font-bold text-base">{formatCurrency(gananciaNeta)}</span>
        </div>
        
        {turno.numeroPedidos > 0 && (
          <div className="flex justify-between gap-4 text-yellow-200">
            <span>Promedio/pedido:</span>
            <span>{formatCurrency(promedioPorPedido)}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {/* Encabezado con trabajo y tipo */}
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1 bg-green-50 rounded">
              <Truck size={16} className="text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900">{trabajo?.nombre || 'Sin trabajo'}</h4>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Delivery
            </span>
          </div>

          {/* Información del turno */}
          <div className="space-y-2">
            {/* Horario */}
            <div className="flex items-center text-sm text-gray-600">
              <Clock size={14} className="mr-1.5" />
              <span>{turno.horaInicio} - {turno.horaFin}</span>
              <span className="mx-2 text-gray-300">•</span>
              <span>{formatearHoras(turno.horaInicio, turno.horaFin)}</span>
            </div>

            {/* Estadísticas del turno */}
            {(turno.numeroPedidos > 0 || turno.kilometros > 0) && (
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {turno.numeroPedidos > 0 && (
                  <div className="flex items-center">
                    <Package size={14} className="mr-1 text-blue-500" />
                    <span>{turno.numeroPedidos} pedidos</span>
                  </div>
                )}
                
                {turno.kilometros > 0 && (
                  <div className="flex items-center">
                    <Car size={14} className="mr-1 text-purple-500" />
                    <span>{turno.kilometros} km</span>
                  </div>
                )}
              </div>
            )}

            {/* Ganancia con tooltip */}
            <div className="flex items-center">
              <DollarSign size={14} className="mr-1 text-green-600" />
              <span className="text-sm font-semibold text-gray-800">{formatCurrency(gananciaNeta)}</span>
              <span className="text-xs text-gray-500 ml-1">total</span>
              
              <InfoTooltip 
                content={tooltipContent}
                size="xs"
                position="top"
                className="ml-2"
              />
            </div>
          </div>
        </div>

        {/* Menú de acciones */}
        <div className="relative menu-turno ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuAbierto(!menuAbierto);
            }}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical size={20} className="text-gray-500" />
          </button>

          {menuAbierto && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={() => {
                  onEdit(turno);
                  setMenuAbierto(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
              >
                <Edit2 size={16} />
                <span>Editar</span>
              </button>
              <button
                onClick={() => {
                  onDelete(turno);
                  setMenuAbierto(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2 text-red-600"
              >
                <Trash2 size={16} />
                <span>Eliminar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TarjetaTurnoDelivery;