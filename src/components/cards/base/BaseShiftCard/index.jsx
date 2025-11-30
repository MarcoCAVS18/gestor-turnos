// src/components/cards/base/BaseShiftCard/index.jsx
import React, { useState } from 'react';
import { Edit, Edit2, Trash2, ChevronDown, ChevronUp, Clock, MessageSquare } from 'lucide-react';
import Card from '../../../ui/Card';
import ActionsMenu from '../../../ui/ActionsMenu';
import ShiftTypeBadge from '../../../shifts/ShiftTypeBadge';
import Badge from '../../../ui/Badge';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { formatRelativeDate, createSafeDate } from '../../../../utils/time';
import { formatCurrency } from '../../../../utils/currency';
import Flex from '../../../ui/Flex';

const BaseShiftCard = ({
  turno,
  trabajo,
  fecha,
  type = 'traditional', // 'traditional' | 'delivery'
  onEdit,
  onDelete,
  showActions = true,
  variant = 'default',
  compact = false,
  shiftData, 
  earningValue, 
  earningLabel, 
  currencySymbol, 
  children 
}) => {
  const colors = useThemeColors();
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);

  // Validación defensiva
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

  // Configuración según tipo
  const config = {
    traditional: {
      editIcon: Edit,
      defaultColor: colors.primary,
      avatarContent: trabajo.nombre?.charAt(0)?.toUpperCase() || 'T'
    },
    delivery: {
      editIcon: Edit2,
      defaultColor: '#10B981',
      avatarContent: null 
    }
  };

  const currentConfig = config[type];

  // Determinar si hay contenido adicional
  const hasAdditionalContent = Boolean(
    turno?.observaciones?.trim() ||
    turno?.descripcion?.trim() ||
    turno?.notas?.trim() ||
    turno?.cruzaMedianoche ||
    (type === 'delivery' && (turno.propinas > 0 || turno.gastoCombustible > 0))
  );

  const actions = [
    {
      icon: currentConfig.editIcon,
      label: 'Editar',
      onClick: () => onEdit?.(turno)
    },
    {
      icon: Trash2,
      label: 'Eliminar',
      onClick: () => onDelete?.(turno),
      variant: 'danger'
    }
  ];

  const toggleExpanded = () => {
    if (hasAdditionalContent) {
      setExpanded(!expanded);
    }
  };

  const colorTrabajo = trabajo.color || trabajo.colorAvatar || currentConfig.defaultColor;

  // Renderizado del Footer de Ganancia (Igual para Mobile y Desktop)
  const renderEarningFooter = () => {
    if (earningValue === undefined) return null;
    
    return (
      <Flex variant="between" className="pt-2 border-t border-gray-100 mt-2">
        <span className="text-sm text-gray-500 font-medium">{earningLabel || 'Ganancia'}</span>
        <span className="text-lg font-bold text-green-600">
          {formatCurrency(earningValue, currencySymbol)}
        </span>
      </Flex>
    );
  };

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
          {/* Header móvil: Avatar + Nombre + Tag Turno */}
          <Flex variant="start-between">
            <Flex variant="start" className="items-center space-x-3 flex-1 min-w-0">
              {/* Avatar */}
              <Flex variant="center"
                className="rounded-lg w-8 h-8 text-white font-bold text-sm flex-shrink-0"
                style={{ backgroundColor: colorTrabajo }}
              >
                {currentConfig.avatarContent || children?.avatarIcon}
              </Flex>

              {/* Nombre y Tag Turno (JUNTOS) */}
              <Flex className="gap-2 min-w-0 overflow-hidden">
                <h3 className="font-semibold text-gray-800 truncate text-base">
                  {trabajo.nombre}
                </h3>
                <ShiftTypeBadge turno={turno} size="sm" />
              </Flex>
            </Flex>

            {/* Menú de acciones */}
            {showActions && <ActionsMenu actions={actions} />}
          </Flex>

          {/* Información principal */}
          <div className="space-y-2">
            {/* Fila 1: Horario y duración */}
            <Flex variant="start">
              <Flex variant="start" className="text-sm text-gray-600">
                <Clock size={14} className="mr-1.5" />
                <span>{turno.horaInicio} - {turno.horaFin}</span>
              </Flex>
              <div className="text-sm text-gray-600 ml-2 border-l pl-2 border-gray-300">
                {shiftData?.hours?.toFixed(1) || '0.0'}h
              </div>
            </Flex>

            {/* Fila 2: Fecha y Tag Smoko (JUNTOS) */}
            <Flex variant="start" className="gap-2">
              {fecha && (
                <Badge variant="default" size="sm">
                  {formatRelativeDate(fecha)}
                </Badge>
              )}
              {/* Badge de Smoko al lado de la fecha */}
              {children?.mobileBadge}
              
              {turno.cruzaMedianoche && (
                <span className="text-blue-600 text-xs ml-auto">🌙</span>
              )}
            </Flex>

            {/* Fila 3: Contenido específico (Stats Delivery) */}
            {children?.mobileStats}

            {/* Fila 4: Ganancia (Footer Between) */}
            {renderEarningFooter()}

            {/* Botón expandir */}
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

          {/* Contenido expandible móvil (Estilos Originales) */}
          {hasAdditionalContent && expanded && (
            <div className="border-t pt-3 space-y-3">
              {(turno.observaciones?.trim() || turno.descripcion?.trim() || turno.notas?.trim()) && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <Flex variant="center" className="gap-2 mb-2">
                    <MessageSquare size={14} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Notas</span>
                  </Flex>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {turno.observaciones?.trim() || turno.descripcion?.trim() || turno.notas?.trim()}
                  </p>
                </div>
              )}

              {turno.cruzaMedianoche && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <span className="text-sm font-medium text-blue-700">Turno Nocturno</span>
                  <p className="text-sm text-blue-600 mt-1">Este turno cruza la medianoche</p>
                  {turno.fechaFin && (
                    <p className="text-sm text-blue-600 mt-1">
                      Termina el: {createSafeDate(turno.fechaFin).toLocaleDateString('es-ES', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      })}
                    </p>
                  )}
                </div>
              )}

              {children?.expandedContent}
            </div>
          )}
        </div>
      </Card>
    );
  }

  // VERSION DESKTOP
  return (
    <Card
      variant={variant}
      hover={true}
      shadow={compact ? 'sm' : 'md'}
      padding={compact ? 'sm' : 'md'}
    >
      <div className="space-y-3">
        {/* Header desktop */}
        <Flex variant="start-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              {/* Avatar */}
              <Flex variant="center"
                className="w-10 h-10 rounded-lg text-white font-bold flex-shrink-0"
                style={{ backgroundColor: colorTrabajo }}
              >
                {currentConfig.avatarContent || children?.avatarIcon}
              </Flex>

              {/* Info */}
              <div className="flex-1 min-w-0">
                {/* Nombre + Tag Turno (JUNTOS) */}
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-gray-800 truncate min-w-0">
                    {trabajo.nombre}
                  </h3>
                  <ShiftTypeBadge turno={turno} size="sm" />
                </div>

                <Flex variant="start" className="text-sm text-gray-600 gap-3 flex-wrap">
                  <Flex variant="center">
                    <Clock size={14} className="mr-1.5" />
                    <span>{turno.horaInicio} - {turno.horaFin}</span>
                  </Flex>
                  <span className="text-gray-300">•</span>
                  <span>{shiftData?.hours?.toFixed(1) || '0.0'}h</span>
                  
                  {fecha && (
                    <>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {formatRelativeDate(fecha)}
                        </span>
                        {/* Tag Smoko al lado de la fecha */}
                        {children?.desktopBadge}
                      </div>
                    </>
                  )}

                  {turno.cruzaMedianoche && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-blue-600 text-xs">🌙</span>
                    </>
                  )}
                </Flex>
              </div>
            </div>

            {children?.desktopStats}

            {/* Ganancia Footer (Desktop) */}
            {renderEarningFooter()}
          </div>

          {/* Acciones desktop */}
          <Flex variant="center" className="gap-2 ml-4 self-start">
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

            {showActions && <ActionsMenu actions={actions} />}
          </Flex>
        </Flex>

        {/* Contenido expandible desktop (Estilos Originales) */}
        {hasAdditionalContent && expanded && (
          <div className="border-t pt-3 space-y-3 animate-in slide-in-from-top-2 duration-200">
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
            
            {turno.cruzaMedianoche && (
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-blue-700">Turno Nocturno</span>
                </div>
                <div className="text-sm text-blue-600 space-y-1">
                  <p>Este turno cruza la medianoche</p>
                  {turno.fechaFin && (
                    <p>Termina el: {createSafeDate(turno.fechaFin).toLocaleDateString('es-ES', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short'
                    })}</p>
                  )}
                </div>
              </div>
            )}

            {children?.expandedContent}

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

        {hasAdditionalContent && !expanded && (
          <Flex variant="center" className="pt-1">
            <Flex className="space-x-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </Flex>
          </Flex>
        )}
      </div>
    </Card>
  );
};

export default BaseShiftCard;