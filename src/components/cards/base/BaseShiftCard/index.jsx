// src/components/cards/BaseShiftCard/index.jsx
// Componente base unificado para TarjetaTurno y TarjetaTurnoDelivery

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** Edit, Edit2, Trash2, ChevronDown, ChevronUp, Clock, MessageSquare ***REMOVED*** from 'lucide-react';
import Card from '../../../ui/Card';
import ActionsMenu from '../../../ui/ActionsMenu';
import ShiftTypeBadge from '../../../shifts/ShiftTypeBadge';
import Badge from '../../../ui/Badge';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../../hooks/useThemeColors';
import ***REMOVED*** useIsMobile ***REMOVED*** from '../../../../hooks/useIsMobile';
import ***REMOVED*** formatRelativeDate, createSafeDate ***REMOVED*** from '../../../../utils/time';
import Flex from '../../../ui/Flex';

const BaseShiftCard = (***REMOVED***
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
***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);

  // Validación defensiva
  if (!turno) ***REMOVED***
    return (
      <Card variant="outlined" className="opacity-50">
        <div className="text-center text-gray-500">
          <p className="text-sm">Turno no encontrado</p>
        </div>
      </Card>
    );
  ***REMOVED***

  if (!trabajo) ***REMOVED***
    return (
      <Card variant="outlined" className="opacity-50">
        <div className="text-center text-gray-500">
          <p className="text-sm">Trabajo eliminado</p>
          <p className="text-xs text-gray-400 mt-1">
            ***REMOVED***turno.horaInicio***REMOVED*** - ***REMOVED***turno.horaFin***REMOVED***
          </p>
        </div>
      </Card>
    );
  ***REMOVED***

  // Configuración según tipo
  const config = ***REMOVED***
    traditional: ***REMOVED***
      editIcon: Edit,
      defaultColor: colors.primary,
      avatarContent: trabajo.nombre?.charAt(0)?.toUpperCase() || 'T'
    ***REMOVED***,
    delivery: ***REMOVED***
      editIcon: Edit2,
      defaultColor: '#10B981',
      avatarContent: null // Delivery usa ícono de Truck
    ***REMOVED***
  ***REMOVED***;

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
    ***REMOVED***
      icon: currentConfig.editIcon,
      label: 'Editar',
      onClick: () => onEdit?.(turno)
    ***REMOVED***,
    ***REMOVED***
      icon: Trash2,
      label: 'Eliminar',
      onClick: () => onDelete?.(turno),
      variant: 'danger'
    ***REMOVED***
  ];

  const toggleExpanded = () => ***REMOVED***
    if (hasAdditionalContent) ***REMOVED***
      setExpanded(!expanded);
    ***REMOVED***
  ***REMOVED***;

  const colorTrabajo = trabajo.color || trabajo.colorAvatar || currentConfig.defaultColor;

  // VERSION MÓVIL OPTIMIZADA
  if (isMobile) ***REMOVED***
    return (
      <Card
        variant=***REMOVED***variant***REMOVED***
        hover=***REMOVED***true***REMOVED***
        padding="sm"
        className="w-full"
      >
        <div className="space-y-3">
          ***REMOVED***/* Header móvil: Solo nombre y acciones */***REMOVED***
          <Flex variant="start-between">
            <Flex variant="center" className="flex items-center space-x-3 flex-1 min-w-0">
              ***REMOVED***/* Avatar más pequeño */***REMOVED***
              <Flex variant="center"
                className="rounded-lg w-8 h-8 text-white font-bold text-sm flex-shrink-0"
                style=***REMOVED******REMOVED*** backgroundColor: colorTrabajo ***REMOVED******REMOVED***
              >
                ***REMOVED***currentConfig.avatarContent || children?.avatarIcon***REMOVED***
              </Flex>

              ***REMOVED***/* Nombre truncado */***REMOVED***
              <h3 className="font-semibold text-gray-800 truncate text-base">
                ***REMOVED***trabajo.nombre***REMOVED***
              </h3>
            </Flex>

            ***REMOVED***/* Solo menú de acciones */***REMOVED***
            ***REMOVED***showActions && <ActionsMenu actions=***REMOVED***actions***REMOVED*** />***REMOVED***
          </Flex>

          ***REMOVED***/* Información principal en filas verticales */***REMOVED***
          <div className="space-y-2">
            ***REMOVED***/* Fila 1: Horario y duración */***REMOVED***
            <Flex variant="between">
              <Flex variant="center" className="text-sm text-gray-600">
                <Clock size=***REMOVED***14***REMOVED*** className="mr-1.5" />
                <span>***REMOVED***turno.horaInicio***REMOVED*** - ***REMOVED***turno.horaFin***REMOVED***</span>
              </Flex>
              <div className="text-sm text-gray-600">
                ***REMOVED***shiftData?.hours?.toFixed(1) || '0.0'***REMOVED***h
              </div>
            </Flex>

            ***REMOVED***/* Fila 2: Fecha y badges en línea separada */***REMOVED***
            <Flex variant="between">
              <Flex variant="center" className="space-x-2">
                ***REMOVED***fecha && (
                  <Badge variant="default" size="sm">
                    ***REMOVED***formatRelativeDate(fecha)***REMOVED***
                  </Badge>
                )***REMOVED***
                <ShiftTypeBadge turno=***REMOVED***turno***REMOVED*** size="sm" />
                ***REMOVED***turno.cruzaMedianoche && (
                  <span className="text-blue-600 text-xs">🌙</span>
                )***REMOVED***
              </Flex>

              ***REMOVED***/* Badge adicional específico del tipo (ej: smoko) */***REMOVED***
              ***REMOVED***children?.mobileBadge***REMOVED***
            </Flex>

            ***REMOVED***/* Fila 3: Contenido específico del tipo (pasado como children) */***REMOVED***
            ***REMOVED***children?.mobileStats***REMOVED***

            ***REMOVED***/* Botón expandir si hay contenido adicional */***REMOVED***
            ***REMOVED***hasAdditionalContent && (
              <button
                onClick=***REMOVED***toggleExpanded***REMOVED***
                className="w-full flex items-center justify-center py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                ***REMOVED***expanded ? (
                  <>
                    <ChevronUp size=***REMOVED***16***REMOVED*** className="mr-1" />
                    Ocultar detalles
                  </>
                ) : (
                  <>
                    <ChevronDown size=***REMOVED***16***REMOVED*** className="mr-1" />
                    Ver detalles
                  </>
                )***REMOVED***
              </button>
            )***REMOVED***
          </div>

          ***REMOVED***/* Contenido expandible móvil */***REMOVED***
          ***REMOVED***hasAdditionalContent && expanded && (
            <div className="border-t pt-3 space-y-3">
              ***REMOVED***/* Notas */***REMOVED***
              ***REMOVED***(turno.observaciones?.trim() || turno.descripcion?.trim() || turno.notas?.trim()) && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <Flex variant="center" className="gap-2 mb-2">
                    <MessageSquare size=***REMOVED***14***REMOVED*** className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Notas</span>
                  </Flex>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    ***REMOVED***turno.observaciones?.trim() || turno.descripcion?.trim() || turno.notas?.trim()***REMOVED***
                  </p>
                </div>
              )***REMOVED***

              ***REMOVED***/* Turnos nocturnos */***REMOVED***
              ***REMOVED***turno.cruzaMedianoche && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <span className="text-sm font-medium text-blue-700">Turno Nocturno</span>
                  <p className="text-sm text-blue-600 mt-1">Este turno cruza la medianoche</p>
                  ***REMOVED***turno.fechaFin && (
                    <p className="text-sm text-blue-600 mt-1">
                      Termina el: ***REMOVED***createSafeDate(turno.fechaFin).toLocaleDateString('es-ES', ***REMOVED***
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      ***REMOVED***)***REMOVED***
                    </p>
                  )***REMOVED***
                </div>
              )***REMOVED***

              ***REMOVED***/* Contenido adicional específico del tipo */***REMOVED***
              ***REMOVED***children?.expandedContent***REMOVED***
            </div>
          )***REMOVED***
        </div>
      </Card>
    );
  ***REMOVED***

  // VERSION DESKTOP
  return (
    <Card
      variant=***REMOVED***variant***REMOVED***
      hover=***REMOVED***true***REMOVED***
      shadow=***REMOVED***compact ? 'sm' : 'md'***REMOVED***
      padding=***REMOVED***compact ? 'sm' : 'md'***REMOVED***
    >
      <div className="space-y-3">
        ***REMOVED***/* Header desktop */***REMOVED***
        <Flex variant="start-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              ***REMOVED***/* Avatar del trabajo */***REMOVED***
              <Flex variant="center"
                className="w-10 h-10 rounded-lg text-white font-bold flex-shrink-0"
                style=***REMOVED******REMOVED*** backgroundColor: colorTrabajo ***REMOVED******REMOVED***
              >
                ***REMOVED***currentConfig.avatarContent || children?.avatarIcon***REMOVED***
              </Flex>

              ***REMOVED***/* Nombre del trabajo y badges */***REMOVED***
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-gray-800 truncate min-w-0">
                    ***REMOVED***trabajo.nombre***REMOVED***
                  </h3>
                  <ShiftTypeBadge turno=***REMOVED***turno***REMOVED*** size="sm" />

                  ***REMOVED***/* Badge adicional específico del tipo */***REMOVED***
                  ***REMOVED***children?.desktopBadge***REMOVED***
                </div>

                ***REMOVED***/* Información básica del turno con fecha integrada */***REMOVED***
                <Flex variant="center" className="text-sm text-gray-600 gap-3 flex-wrap">
                  <Flex variant="center">
                    <Clock size=***REMOVED***14***REMOVED*** className="mr-1.5" />
                    <span>***REMOVED***turno.horaInicio***REMOVED*** - ***REMOVED***turno.horaFin***REMOVED***</span>
                  </Flex>

                  <span className="text-gray-300">•</span>

                  ***REMOVED***/* Mostrar tiempo trabajado */***REMOVED***
                  <span>***REMOVED***shiftData?.hours?.toFixed(1) || '0.0'***REMOVED***h</span>

                  ***REMOVED***/* Fecha como texto simple */***REMOVED***
                  ***REMOVED***fecha && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500">
                        ***REMOVED***formatRelativeDate(fecha)***REMOVED***
                      </span>
                    </>
                  )***REMOVED***

                  ***REMOVED***/* Indicador nocturno */***REMOVED***
                  ***REMOVED***turno.cruzaMedianoche && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-blue-600 text-xs">🌙</span>
                    </>
                  )***REMOVED***
                </Flex>
              </div>
            </div>

            ***REMOVED***/* Contenido específico del tipo (stats y ganancia) */***REMOVED***
            ***REMOVED***children?.desktopStats***REMOVED***
          </div>

          ***REMOVED***/* Acciones desktop */***REMOVED***
          <Flex variant="center" className="gap-2 ml-4">
            ***REMOVED***/* Botón de expansión */***REMOVED***
            ***REMOVED***hasAdditionalContent && (
              <button
                onClick=***REMOVED***toggleExpanded***REMOVED***
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title=***REMOVED***expanded ? 'Ocultar detalles' : 'Ver detalles'***REMOVED***
              >
                ***REMOVED***expanded ? (
                  <ChevronUp size=***REMOVED***16***REMOVED*** className="text-gray-500" />
                ) : (
                  <ChevronDown size=***REMOVED***16***REMOVED*** className="text-gray-500" />
                )***REMOVED***
              </button>
            )***REMOVED***

            ***REMOVED***/* Menú de acciones */***REMOVED***
            ***REMOVED***showActions && <ActionsMenu actions=***REMOVED***actions***REMOVED*** />***REMOVED***
          </Flex>
        </Flex>

        ***REMOVED***/* Contenido expandible desktop */***REMOVED***
        ***REMOVED***hasAdditionalContent && expanded && (
          <div className="border-t pt-3 space-y-3 animate-in slide-in-from-top-2 duration-200">
            ***REMOVED***/* Solo mostrar notas/observaciones */***REMOVED***
            ***REMOVED***(turno.observaciones?.trim() || turno.descripcion?.trim() || turno.notas?.trim()) && (
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare size=***REMOVED***14***REMOVED*** className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Notas</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  ***REMOVED***turno.observaciones?.trim() || turno.descripcion?.trim() || turno.notas?.trim()***REMOVED***
                </p>
              </div>
            )***REMOVED***

            ***REMOVED***/* Información adicional para turnos nocturnos */***REMOVED***
            ***REMOVED***turno.cruzaMedianoche && (
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-blue-700">Turno Nocturno</span>
                </div>
                <div className="text-sm text-blue-600 space-y-1">
                  <p>Este turno cruza la medianoche</p>
                  ***REMOVED***turno.fechaFin && (
                    <p>Termina el: ***REMOVED***createSafeDate(turno.fechaFin).toLocaleDateString('es-ES', ***REMOVED***
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short'
                    ***REMOVED***)***REMOVED***</p>
                  )***REMOVED***
                </div>
              </div>
            )***REMOVED***

            ***REMOVED***/* Contenido adicional específico del tipo */***REMOVED***
            ***REMOVED***children?.expandedContent***REMOVED***

            ***REMOVED***/* Información de fechas */***REMOVED***
            ***REMOVED***turno.fechaCreacion && (
              <div className="text-xs text-gray-500 border-t pt-2">
                Creado: ***REMOVED***new Date(turno.fechaCreacion.seconds * 1000 || turno.fechaCreacion).toLocaleDateString('es-ES', ***REMOVED***
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                ***REMOVED***)***REMOVED***
              </div>
            )***REMOVED***
          </div>
        )***REMOVED***

        ***REMOVED***/* Indicador visual si hay contenido pero no está expandido */***REMOVED***
        ***REMOVED***hasAdditionalContent && !expanded && (
          <Flex variant="center" className="pt-1">
            <Flex className="space-x-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </Flex>
          </Flex>
        )***REMOVED***
      </div>
    </Card>
  );
***REMOVED***;

export default BaseShiftCard;