// src/components/cards/BaseShiftCard/index.jsx
// Componente base unificado para TarjetaTurno y TarjetaTurnoDelivery

import React, { useState } from 'react';
import { Edit, Edit2, Trash2, ChevronDown, ChevronUp, Clock, MessageSquare } from 'lucide-react';
import Card from '../../../ui/Card';
import ActionsMenu from '../../../ui/ActionsMenu';
import ShiftTypeBadge from '../../../shifts/ShiftTypeBadge';
import Badge from '../../../ui/Badge';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { formatRelativeDate, createSafeDate } from '../../../../utils/time';

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
  shiftData, // Datos calculados del turno (pasados desde el componente padre)
  children // Contenido específico del tipo de turno
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
      avatarContent: null // Delivery usa ícono de Truck
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

  // Configurar acciones del menú
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
                style={{ backgroundColor: colorTrabajo }}
              >
                {currentConfig.avatarContent || children?.avatarIcon}
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
                {shiftData?.hours?.toFixed(1) || '0.0'}h
              </div>
            </div>

            {/* Fila 2: Fecha y badges en línea separada */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {fecha && (
                  <Badge variant="default" size="sm">
                    {formatRelativeDate(fecha)}
                  </Badge>
                )}
                <ShiftTypeBadge turno={turno} size="sm" />
                {turno.cruzaMedianoche && (
                  <span className="text-blue-600 text-xs">🌙</span>
                )}
              </div>

              {/* Badge adicional específico del tipo (ej: smoko) */}
              {children?.mobileBadge}
            </div>

            {/* Fila 3: Contenido específico del tipo (pasado como children) */}
            {children?.mobileStats}

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

          {/* Contenido expandible móvil */}
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

              {/* Contenido adicional específico del tipo */}
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
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              {/* Avatar del trabajo */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0"
                style={{ backgroundColor: colorTrabajo }}
              >
                {currentConfig.avatarContent || children?.avatarIcon}
              </div>

              {/* Nombre del trabajo y badges */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-gray-800 truncate min-w-0">
                    {trabajo.nombre}
                  </h3>
                  <ShiftTypeBadge turno={turno} size="sm" />

                  {/* Badge adicional específico del tipo */}
                  {children?.desktopBadge}
                </div>

                {/* Información básica del turno con fecha integrada */}
                <div className="flex items-center text-sm text-gray-600 gap-3 flex-wrap">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1.5" />
                    <span>{turno.horaInicio} - {turno.horaFin}</span>
                  </div>

                  <span className="text-gray-300">•</span>

                  {/* Mostrar tiempo trabajado */}
                  <span>{shiftData?.hours?.toFixed(1) || '0.0'}h</span>

                  {/* Fecha como texto simple */}
                  {fecha && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500">
                        {formatRelativeDate(fecha)}
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

            {/* Contenido específico del tipo (stats y ganancia) */}
            {children?.desktopStats}
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
                    <p>Termina el: {createSafeDate(turno.fechaFin).toLocaleDateString('es-ES', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short'
                    })}</p>
                  )}
                </div>
              </div>
            )}

            {/* Contenido adicional específico del tipo */}
            {children?.expandedContent}

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

export default BaseShiftCard;