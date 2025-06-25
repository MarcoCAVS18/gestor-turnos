// src/components/cards/TarjetaTurnoDelivery/index.jsx

import React from 'react';
import { Clock, Package, Car, TrendingUp, Edit2, Trash2, MoreVertical, Truck } from 'lucide-react';

const TarjetaTurnoDelivery = ({ turno, trabajo, onEdit, onDelete }) => {
  const [menuAbierto, setMenuAbierto] = React.useState(false);

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

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  };

  const formatearHoras = (horaInicio, horaFin) => {
    const [horaI, minI] = horaInicio.split(':').map(Number);
    const [horaF, minF] = horaFin.split(':').map(Number);
    
    const totalMinutos = (horaF * 60 + minF) - (horaI * 60 + minI);
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    
    if (minutos === 0) return `${horas}h`;
    return `${horas}h ${minutos}min`;
  };

  const gananciaBase = turno.gananciaTotal - (turno.propinas || 0);
  const gananciaNeta = turno.gananciaTotal - (turno.gastoCombustible || 0);
  const promedioPorPedido = turno.numeroPedidos > 0 ? gananciaBase / turno.numeroPedidos : 0;

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
              <Clock size={16} className="mr-2 text-gray-400" />
              <span>{turno.horaInicio} - {turno.horaFin}</span>
              <span className="mx-2">•</span>
              <span>{formatearHoras(turno.horaInicio, turno.horaFin)}</span>
            </div>

            {/* Estadísticas del turno */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              {turno.numeroPedidos > 0 && (
                <div className="flex items-center text-gray-600">
                  <Package size={14} className="mr-1 text-blue-500" />
                  <span>{turno.numeroPedidos} pedidos</span>
                </div>
              )}
              
              {turno.kilometros > 0 && (
                <div className="flex items-center text-gray-600">
                  <Car size={14} className="mr-1 text-purple-500" />
                  <span>{turno.kilometros} km</span>
                </div>
              )}
            </div>

            {/* Desglose financiero */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ganancia base:</span>
                  <span className="font-medium">{formatearMoneda(gananciaBase)}</span>
                </div>
                
                {turno.propinas > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <TrendingUp size={12} className="mr-1" />
                      Propinas:
                    </span>
                    <span className="font-medium text-green-600">
                      +{formatearMoneda(turno.propinas)}
                    </span>
                  </div>
                )}
                
                {turno.gastoCombustible > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Combustible:</span>
                    <span className="font-medium text-red-600">
                      -{formatearMoneda(turno.gastoCombustible)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                  <span className="font-medium text-gray-700">Ganancia neta:</span>
                  <span className="font-semibold text-green-600">
                    {formatearMoneda(gananciaNeta)}
                  </span>
                </div>
              </div>

              {/* Métricas adicionales */}
              {turno.numeroPedidos > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Promedio por pedido:</span>
                    <span className="font-medium">{formatearMoneda(promedioPorPedido)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Notas */}
            {turno.notas && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600 italic">
                {turno.notas}
              </div>
            )}
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