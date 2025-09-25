// src/components/cards/TarjetaTurno/index.jsx - OPTIMIZADA PARA MÓVIL

import React, { useState, useEffect } from 'react';
import { Edit, Trash2, ChevronDown, ChevronUp, MessageSquare, Clock, DollarSign, Package, Navigation, Coffee } from 'lucide-react';
import Card from '../../ui/Card';
import ActionsMenu from '../../ui/ActionsMenu';
import ShiftTypeBadge from '../../shifts/ShiftTypeBadge';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { formatCurrency } from '../../../utils/currency';

const TarjetaTurno = ({
  turno,
  trabajo,
  fecha,
  onEdit,
  onDelete,
  showActions = true,
  variant = 'default',
  compact = false
}) => {
  const { calculatePayment, smokoEnabled } = useApp();
  const colors = useThemeColors();
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Función para formatear la fecha de manera amigable
  const formatearFechaAmigable = (fechaStr) => {
    if (!fechaStr) return '';
    
    const fechaTurno = new Date(fechaStr + 'T00:00:00');
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);
    
    if (fechaTurno.toDateString() === hoy.toDateString()) {
      return 'Hoy';
    } else if (fechaTurno.toDateString() === ayer.toDateString()) {
      return 'Ayer';
    } else if (fechaTurno.toDateString() === manana.toDateString()) {
      return 'Mañana';
    } else {
      return fechaTurno.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
    }
  };

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
      isDelivery: false,
      smokoApplied: result.smokoApplied || false,
      smokoMinutes: result.smokoMinutes || 0,
      totalMinutesWorked: result.totalMinutesWorked || 0,
      totalMinutesScheduled: result.totalMinutesScheduled || 0
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

  // VERSION MÓVIL OPTIMIZADA
  if (isMobile) {
    return (
      <Card 
        variant={variant}
        hover={true}
        padding="sm"
        className="w-full"
      >
        <div className="space-y-3">
          {/* Header móvil: Solo nombre y acciones */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {/* Avatar más pequeño */}
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ backgroundColor: trabajo.color || trabajo.colorAvatar || colors.primary }}
              >
                {trabajo.nombre?.charAt(0)?.toUpperCase() || 'T'}
              </div>
              
              {/* Nombre truncado */}
              <h3 className="font-semibold text-gray-800 truncate text-base">
                {trabajo.nombre}
              </h3>
            </div>

            {/* Solo menú de acciones */}
            {showActions && <ActionsMenu actions={actions} />}
          </div>

          {/* Información principal en filas verticales */}
          <div className="space-y-2">
            {/* Fila 1: Horario y duración */}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <Clock size={14} className="mr-1.5" />
                <span>{turno.horaInicio} - {turno.horaFin}</span>
              </div>
              <div className="text-sm text-gray-600">
                {shiftData.hours.toFixed(1)}h
              </div>
            </div>

            {/* Fila 2: Fecha y badges en línea separada */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {fecha && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {formatearFechaAmigable(fecha)}
                  </span>
                )}
                <ShiftTypeBadge turno={turno} size="sm" />
                {turno.cruzaMedianoche && (
                  <span className="text-blue-600 text-xs">🌙</span>
                )}
              </div>
              
              {/* Badge de smoko si aplica */}
              {smokoEnabled && shiftData.smokoApplied && (
                <div className="flex items-center px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs">
                  <Coffee size={10} className="mr-1" />
                  <span>-{shiftData.smokoMinutes}min</span>
                </div>
              )}
            </div>

            {/* Fila 3: Información específica según tipo */}
            {shiftData.isDelivery ? (
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  {shiftData.deliveryData.numeroPedidos > 0 && (
                    <div className="flex items-center">
                      <Package size={12} className="mr-1 text-blue-500" />
                      <span>{shiftData.deliveryData.numeroPedidos}</span>
                    </div>
                  )}
                  
                  {shiftData.deliveryData.kilometros > 0 && (
                    <div className="flex items-center">
                      <Navigation size={12} className="mr-1 text-purple-500" />
                      <span>{shiftData.deliveryData.kilometros}km</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <DollarSign size={16} className="mr-1 text-green-600" />
                  <span className="font-bold text-green-600 text-lg">
                    {formatCurrency(shiftData.totalWithDiscount)}
                  </span>
                </div>
              </div>
            ) : (
              // Trabajo tradicional - solo ganancia destacada
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-500">Ganancia estimada</span>
                <div className="flex items-center">
                  <DollarSign size={16} className="mr-1" style={{ color: colors.primary }} />
                  <span className="font-bold text-lg" style={{ color: colors.primary }}>
                    {formatCurrency(shiftData.totalWithDiscount)}
                  </span>
                </div>
              </div>
            )}

            {/* Botón expandir si hay contenido adicional */}
            {hasAdditionalContent && (
              <button
                onClick={toggleExpanded}
                className="w-full flex items-center justify-center py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                {expanded ? (
                  <>
                    <ChevronUp size={16} className="mr-1" />
                    Ocultar detalles
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} className="mr-1" />
                    Ver detalles
                  </>
                )}
              </button>
            )}
          </div>

          {/* Contenido expandible */}
          {hasAdditionalContent && expanded && (
            <div className="border-t pt-3 space-y-3">
              {/* Notas */}
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

              {/* Turnos nocturnos */}
              {turno.cruzaMedianoche && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <span className="text-sm font-medium text-blue-700">Turno Nocturno</span>
                  <p className="text-sm text-blue-600 mt-1">Este turno cruza la medianoche</p>
                </div>
              )}

              {/* Detalles delivery */}
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
                        <span className="text-green-600">Gastos:</span>
                        <span className="font-medium">{formatCurrency(shiftData.deliveryData.gastos)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between border-t border-green-200 pt-2">
                      <span className="font-semibold text-green-700">Neto:</span>
                      <span className="font-bold">{formatCurrency(shiftData.totalWithDiscount - shiftData.deliveryData.gastos)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    );
  }

  // VERSION DESKTOP (mantener la actual)
  return (
    <Card 
      variant={variant}
      hover={true}
      shadow={compact ? 'sm' : 'md'}
      padding={compact ? 'sm' : 'md'}
    >
      <div className="space-y-3">
        {/* Header desktop */}
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

              {/* Nombre del trabajo y badges */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-gray-800 truncate min-w-0">
                    {trabajo.nombre}
                  </h3>
                  <ShiftTypeBadge turno={turno} size="sm" />
                  
                  {/* Badge de Smoko - Solo mostrar si está aplicado */}
                  {smokoEnabled && shiftData.smokoApplied && (
                    <div className="flex items-center px-2 py-1 bg-orange-50 text-orange-700 rounded-full text-xs">
                      <Coffee size={12} className="mr-1" />
                      <span>-{shiftData.smokoMinutes}min</span>
                    </div>
                  )}
                </div>
                
                {/* Información básica del turno con fecha integrada */}
                <div className="flex items-center text-sm text-gray-600 gap-3 flex-wrap">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1.5" />
                    <span>{turno.horaInicio} - {turno.horaFin}</span>
                  </div>
                  
                  <span className="text-gray-300">•</span>
                  
                  {/* Mostrar tiempo trabajado */}
                  <span>{shiftData.hours.toFixed(1)}h</span>
                  
                  {/* Fecha como texto simple */}
                  {fecha && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500">
                        {formatearFechaAmigable(fecha)}
                      </span>
                    </>
                  )}
                  
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

          {/* Acciones desktop */}
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

        {/* Contenido expandible desktop */}
        {hasAdditionalContent && expanded && (
          <div className="border-t pt-3 space-y-3 animate-in slide-in-from-top-2 duration-200">
            {/* Solo mostrar notas/observaciones */}
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