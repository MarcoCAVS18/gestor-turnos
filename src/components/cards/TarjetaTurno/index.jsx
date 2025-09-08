// src/components/cards/TarjetaTurno/index.jsx - Versión actualizada

import React, { useState } from 'react';
import { Edit, Trash2, ChevronDown, ChevronUp, MessageSquare, Clock, DollarSign, Package, Navigation } from 'lucide-react';
import Card from '../../ui/Card';
import ActionsMenu from '../../ui/ActionsMenu';
import ShiftTypeBadge from '../../shifts/ShiftTypeBadge';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';

const TarjetaTurno = ({
  turno,
  trabajo,
  onEdit,
  onDelete,
  showActions = true,
  variant = 'default',
  compact = false
}) => {
  const { calculatePayment } = useApp();
  const colors = useThemeColors();
  const [expanded, setExpanded] = useState(false);

  // Calcular información del turno
  const shiftData = React.useMemo(() => {
    if (!turno || !trabajo) {
      return { hours: 0, totalWithDiscount: 0, isDelivery: false };
    }

    if (turno.tipo === 'delivery' || trabajo.tipo === 'delivery') {
      const [horaI, minI] = turno.horaInicio.split(':').map(Number);
      const [horaF, minF] = turno.horaFin.split(':').map(Number);
      let horas = (horaF + minF/60) - (horaI + minI/60);
      if (horas < 0) horas += 24;

      return {
        hours: horas,
        totalWithDiscount: turno.gananciaTotal || 0,
        isDelivery: true,
        deliveryData: {
          numeroPedidos: turno.numeroPedidos || 0,
          kilometros: turno.kilometros || 0,
          propinas: turno.propinas || 0,
          gastos: turno.gastoCombustible || 0
        }
      };
    }

    const result = calculatePayment(turno);
    return {
      hours: result.hours || 0,
      totalWithDiscount: result.totalWithDiscount || 0,
      isDelivery: false
    };
  }, [turno, trabajo, calculatePayment]);

  // Determinar si hay contenido adicional
  const hasAdditionalContent = React.useMemo(() => {
    return Boolean(
      turno?.observaciones?.trim() ||
      turno?.descripcion?.trim() ||
      turno?.notas?.trim() ||
      turno?.cruzaMedianoche ||
      (shiftData.isDelivery && (shiftData.deliveryData.propinas > 0 || shiftData.deliveryData.gastos > 0))
    );
  }, [turno, shiftData]);

  const actions = React.useMemo(() => [
    { icon: Edit, label: 'Editar', onClick: () => onEdit?.(turno) },
    { icon: Trash2, label: 'Eliminar', onClick: () => onDelete?.(turno), variant: 'danger' }
  ], [onEdit, onDelete, turno]);

  const toggleExpanded = () => {
    if (hasAdditionalContent) {
      setExpanded(!expanded);
    }
  };

  // Early returns después de los hooks
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

  return (
    <Card 
      variant={variant}
      hover={true}
      shadow={compact ? 'sm' : 'md'}
      padding={compact ? 'sm' : 'md'}
    >
      <div className="space-y-3">
        {/* Header con avatar, nombre y badge */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              {/* Avatar del trabajo */}
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0"
                style={{ backgroundColor: trabajo.color || trabajo.colorAvatar || colors.primary }}
              >
                {trabajo.nombre?.charAt(0)?.toUpperCase() || 'T'}
              </div>

              {/* Nombre del trabajo y badge */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-gray-800 truncate min-w-0">
                    {trabajo.nombre}
                  </h3>
                  <ShiftTypeBadge turno={turno} size="sm" />
                </div>
                
                {/* Información básica del turno */}
                <div className="flex items-center text-sm text-gray-600 gap-3">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1.5" />
                    <span>{turno.horaInicio} - {turno.horaFin}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span>{shiftData.hours.toFixed(1)}h</span>
                  
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

            {/* Información específica por tipo */}
            {shiftData.isDelivery ? (
              // Información de delivery
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600 gap-4">
                  {shiftData.deliveryData.numeroPedidos > 0 && (
                    <div className="flex items-center">
                      <Package size={14} className="mr-1 text-blue-500" />
                      <span>{shiftData.deliveryData.numeroPedidos}</span>
                    </div>
                  )}
                  
                  {shiftData.deliveryData.kilometros > 0 && (
                    <div className="flex items-center">
                      <Navigation size={14} className="mr-1 text-purple-500" />
                      <span>{shiftData.deliveryData.kilometros} km</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <DollarSign size={16} className="mr-1 text-green-600" />
                  <span className="font-semibold text-green-600 text-lg">
                    {formatCurrency(shiftData.totalWithDiscount)}
                  </span>
                </div>
              </div>
            ) : (
              // Información de trabajo tradicional
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Ganancia estimada</span>
                <div className="flex items-center">
                  <DollarSign size={16} className="mr-1" style={{ color: colors.primary }} />
                  <span className="font-semibold text-lg" style={{ color: colors.primary }}>
                    {formatCurrency(shiftData.totalWithDiscount)}
                  </span>
                </div>
              </div>
            )}
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
            {/* Observaciones/Notas */}
            {(turno.observaciones?.trim() || turno.descripcion?.trim() || turno.notas?.trim()) && (
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare size={14} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Notas</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {turno.observaciones?.trim() || turno.descripcion?.trim() || turno.notas?.trim()}
                </p>
              </div>
            )}

            {/* Información adicional para turnos nocturnos */}
            {turno.cruzaMedianoche && (
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-blue-700">Turno Nocturno</span>
                </div>
                <div className="text-sm text-blue-600 space-y-1">
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

            {/* Detalles de delivery expandidos */}
            {shiftData.isDelivery && (shiftData.deliveryData.propinas > 0 || shiftData.deliveryData.gastos > 0) && (
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-sm space-y-2">
                  <div className="font-medium text-green-700 mb-2">Detalles del Delivery</div>
                  
                  {shiftData.deliveryData.propinas > 0 && (
                    <div className="flex justify-between">
                      <span className="text-green-600">Propinas:</span>
                      <span className="font-medium">{formatCurrency(shiftData.deliveryData.propinas)}</span>
                    </div>
                  )}
                  
                  {shiftData.deliveryData.gastos > 0 && (
                    <div className="flex justify-between">
                      <span className="text-green-600">Gastos combustible:</span>
                      <span className="font-medium">{formatCurrency(shiftData.deliveryData.gastos)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between border-t border-green-200 pt-2">
                    <span className="font-semibold text-green-700">Ganancia neta:</span>
                    <span className="font-bold">{formatCurrency(shiftData.totalWithDiscount - shiftData.deliveryData.gastos)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Información de fechas */}
            {turno.fechaCreacion && (
              <div className="text-xs text-gray-500 border-t pt-2">
                Creado: {new Date(turno.fechaCreacion.seconds * 1000 || turno.fechaCreacion).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
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

export default TarjetaTurno;