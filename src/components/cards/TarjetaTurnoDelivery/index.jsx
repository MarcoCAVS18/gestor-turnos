// src/components/cards/TarjetaTurnoDelivery/index.jsx - Versión actualizada

import React, { useState } from 'react';
import { Clock, Package, Edit2, Trash2, DollarSign, Truck, Navigation, ChevronDown, ChevronUp } from 'lucide-react';
import Card from '../../ui/Card';
import ActionsMenu from '../../ui/ActionsMenu';
import ShiftTypeBadge from '../../shifts/ShiftTypeBadge';
import { formatCurrency } from '../../../utils/currency';

const TarjetaTurnoDelivery = ({ 
  turno, 
  trabajo, 
  onEdit, 
  onDelete,
  variant = 'default',
  showActions = true
}) => {
    const [expanded, setExpanded] = useState(false);

  // Validaciones
  if (!turno) {
    return (
      <Card variant="outlined" className="opacity-50">
        <div className="text-center text-gray-500">
          <p className="text-sm">Turno no encontrado</p>
        </div>
      </Card>
    );
  }

  if (!trabajo) {
    return (
      <Card variant="outlined" className="opacity-50">
        <div className="text-center text-gray-500">
          <p className="text-sm">Trabajo eliminado</p>
          <p className="text-xs text-gray-400 mt-1">
            {turno.horaInicio} - {turno.horaFin}
          </p>
        </div>
      </Card>
    );
  }

  // Calcular datos del turno
  const formatearHoras = (horaInicio, horaFin) => {
    const [horaI, minI] = horaInicio.split(':').map(Number);
    const [horaF, minF] = horaFin.split(':').map(Number);
    
    let totalMinutos = (horaF * 60 + minF) - (horaI * 60 + minI);
    if (totalMinutos < 0) totalMinutos += 24 * 60;
    
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    
    if (minutos === 0) return `${horas}h`;
    return `${horas}h ${minutos}min`;
  };

  const gananciaNeta = (turno.gananciaTotal || 0) - (turno.gastoCombustible || 0);
  const promedioPorPedido = turno.numeroPedidos > 0 ? (turno.gananciaTotal || 0) / turno.numeroPedidos : 0;

  // Determinar si hay contenido adicional
  const hasAdditionalContent = Boolean(
    turno.observaciones?.trim() ||
    turno.propinas > 0 ||
    turno.gastoCombustible > 0 ||
    turno.cruzaMedianoche
  );

  const actions = [
    { icon: Edit2, label: 'Editar', onClick: () => onEdit?.(turno) },
    { icon: Trash2, label: 'Eliminar', onClick: () => onDelete?.(turno), variant: 'danger' }
  ];

  const toggleExpanded = () => {
    if (hasAdditionalContent) {
      setExpanded(!expanded);
    }
  };

  return (
    <Card 
      variant={variant}
      hover={true}
    >
      <div className="space-y-3">
        {/* Header con avatar, nombre y badge */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              {/* Avatar del trabajo */}
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0"
                style={{ backgroundColor: trabajo.colorAvatar || trabajo.color || '#10B981' }}
              >
                <Truck size={16} />
              </div>

              {/* Nombre del trabajo y badges */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h4 className="font-medium text-gray-900 truncate min-w-0">{trabajo.nombre}</h4>
                  <ShiftTypeBadge turno={turno} size="sm" />
                </div>
                
                {/* Información básica del turno */}
                <div className="flex items-center text-sm text-gray-600 gap-3">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1.5" />
                    <span>{turno.horaInicio} - {turno.horaFin}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span>{formatearHoras(turno.horaInicio, turno.horaFin)}</span>
                  
                  {/* Indicador nocturno */}
                  {turno.cruzaMedianoche && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-blue-600 text-xs">🌙</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Estadísticas del turno */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {turno.numeroPedidos > 0 && (
                  <div className="flex items-center">
                    <Package size={14} className="mr-1 text-blue-500" />
                    <span>{turno.numeroPedidos}</span>
                  </div>
                )}
                
                {turno.kilometros > 0 && (
                  <div className="flex items-center">
                    <Navigation size={14} className="mr-1 text-purple-500" />
                    <span>{turno.kilometros} km</span>
                  </div>
                )}
              </div>

              {/* Ganancia */}
              <div className="flex items-center">
                <DollarSign size={16} className="mr-1 text-green-600" />
                <span className="text-lg font-semibold text-green-600">
                  {formatCurrency(gananciaNeta)}
                </span>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2 ml-4">
            {/* Botón de expansión */}
            {hasAdditionalContent && (
              <button
                onClick={toggleExpanded}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title={expanded ? 'Ocultar detalles' : 'Ver detalles'}
              >
                {expanded ? (
                  <ChevronUp size={16} className="text-gray-500" />
                ) : (
                  <ChevronDown size={16} className="text-gray-500" />
                )}
              </button>
            )}

            {/* Menú de acciones */}
            {showActions && <ActionsMenu actions={actions} />}
          </div>
        </div>

        {/* Contenido expandible */}
        {hasAdditionalContent && expanded && (
          <div className="border-t pt-3 space-y-3 animate-in slide-in-from-top-2 duration-200">
            {/* Detalles financieros */}
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-sm space-y-2">
                <div className="font-medium text-green-700 mb-2">Detalles Financieros</div>
                
                <div className="flex justify-between">
                  <span className="text-green-600">Ganancia total:</span>
                  <span className="font-medium">{formatCurrency(turno.gananciaTotal || 0)}</span>
                </div>
                
                {turno.propinas > 0 && (
                  <div className="flex justify-between">
                    <span className="text-green-600">Propinas:</span>
                    <span className="font-medium">{formatCurrency(turno.propinas)}</span>
                  </div>
                )}
                
                {turno.gastoCombustible > 0 && (
                  <div className="flex justify-between">
                    <span className="text-green-600">Gastos combustible:</span>
                    <span className="font-medium">{formatCurrency(turno.gastoCombustible)}</span>
                  </div>
                )}
                
                {turno.numeroPedidos > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Promedio/pedido:</span>
                    <span>{formatCurrency(promedioPorPedido)}</span>
                  </div>
                )}
                
                <div className="flex justify-between border-t border-green-200 pt-2">
                  <span className="font-semibold text-green-700">Ganancia neta:</span>
                  <span className="font-bold">{formatCurrency(gananciaNeta)}</span>
                </div>
              </div>
            </div>

            {/* Observaciones si existen */}
            {turno.observaciones?.trim() && (
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-medium text-gray-700 mb-2">Notas</div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {turno.observaciones}
                </p>
              </div>
            )}

            {/* Información nocturna */}
            {turno.cruzaMedianoche && (
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm font-medium text-blue-700 mb-1">Turno Nocturno</div>
                <div className="text-sm text-blue-600">
                  <p>Este turno cruza la medianoche</p>
                  {turno.fechaFin && (
                    <p>Termina el: {new Date(turno.fechaFin + 'T00:00:00').toLocaleDateString('es-ES', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short'
                    })}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Indicador visual si hay contenido pero no está expandido */}
        {hasAdditionalContent && !expanded && (
          <div className="flex items-center justify-center pt-1">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TarjetaTurnoDelivery;