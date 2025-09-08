// src/components/cards/TarjetaTurno/index.jsx - Versión actualizada

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** Edit, Trash2, ChevronDown, ChevronUp, MessageSquare, Clock, DollarSign, Package, Navigation ***REMOVED*** from 'lucide-react';
import Card from '../../ui/Card';
import ActionsMenu from '../../ui/ActionsMenu';
import ShiftTypeBadge from '../../shifts/ShiftTypeBadge';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';

const TarjetaTurno = (***REMOVED***
  turno,
  trabajo,
  onEdit,
  onDelete,
  showActions = true,
  variant = 'default',
  compact = false
***REMOVED***) => ***REMOVED***
  const ***REMOVED*** calculatePayment ***REMOVED*** = useApp();
  const colors = useThemeColors();
  const [expanded, setExpanded] = useState(false);

  // Calcular información del turno
  const shiftData = React.useMemo(() => ***REMOVED***
    if (!turno || !trabajo) ***REMOVED***
      return ***REMOVED*** hours: 0, totalWithDiscount: 0, isDelivery: false ***REMOVED***;
    ***REMOVED***

    if (turno.tipo === 'delivery' || trabajo.tipo === 'delivery') ***REMOVED***
      const [horaI, minI] = turno.horaInicio.split(':').map(Number);
      const [horaF, minF] = turno.horaFin.split(':').map(Number);
      let horas = (horaF + minF/60) - (horaI + minI/60);
      if (horas < 0) horas += 24;

      return ***REMOVED***
        hours: horas,
        totalWithDiscount: turno.gananciaTotal || 0,
        isDelivery: true,
        deliveryData: ***REMOVED***
          numeroPedidos: turno.numeroPedidos || 0,
          kilometros: turno.kilometros || 0,
          propinas: turno.propinas || 0,
          gastos: turno.gastoCombustible || 0
        ***REMOVED***
      ***REMOVED***;
    ***REMOVED***

    const result = calculatePayment(turno);
    return ***REMOVED***
      hours: result.hours || 0,
      totalWithDiscount: result.totalWithDiscount || 0,
      isDelivery: false
    ***REMOVED***;
  ***REMOVED***, [turno, trabajo, calculatePayment]);

  // Determinar si hay contenido adicional
  const hasAdditionalContent = React.useMemo(() => ***REMOVED***
    return Boolean(
      turno?.observaciones?.trim() ||
      turno?.descripcion?.trim() ||
      turno?.notas?.trim() ||
      turno?.cruzaMedianoche ||
      (shiftData.isDelivery && (shiftData.deliveryData.propinas > 0 || shiftData.deliveryData.gastos > 0))
    );
  ***REMOVED***, [turno, shiftData]);

  const actions = React.useMemo(() => [
    ***REMOVED*** icon: Edit, label: 'Editar', onClick: () => onEdit?.(turno) ***REMOVED***,
    ***REMOVED*** icon: Trash2, label: 'Eliminar', onClick: () => onDelete?.(turno), variant: 'danger' ***REMOVED***
  ], [onEdit, onDelete, turno]);

  const toggleExpanded = () => ***REMOVED***
    if (hasAdditionalContent) ***REMOVED***
      setExpanded(!expanded);
    ***REMOVED***
  ***REMOVED***;

  // Early returns después de los hooks
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

  return (
    <Card 
      variant=***REMOVED***variant***REMOVED***
      hover=***REMOVED***true***REMOVED***
      shadow=***REMOVED***compact ? 'sm' : 'md'***REMOVED***
      padding=***REMOVED***compact ? 'sm' : 'md'***REMOVED***
    >
      <div className="space-y-3">
        ***REMOVED***/* Header con avatar, nombre y badge */***REMOVED***
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              ***REMOVED***/* Avatar del trabajo */***REMOVED***
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0"
                style=***REMOVED******REMOVED*** backgroundColor: trabajo.color || trabajo.colorAvatar || colors.primary ***REMOVED******REMOVED***
              >
                ***REMOVED***trabajo.nombre?.charAt(0)?.toUpperCase() || 'T'***REMOVED***
              </div>

              ***REMOVED***/* Nombre del trabajo y badge */***REMOVED***
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-gray-800 truncate min-w-0">
                    ***REMOVED***trabajo.nombre***REMOVED***
                  </h3>
                  <ShiftTypeBadge turno=***REMOVED***turno***REMOVED*** size="sm" />
                </div>
                
                ***REMOVED***/* Información básica del turno */***REMOVED***
                <div className="flex items-center text-sm text-gray-600 gap-3">
                  <div className="flex items-center">
                    <Clock size=***REMOVED***14***REMOVED*** className="mr-1.5" />
                    <span>***REMOVED***turno.horaInicio***REMOVED*** - ***REMOVED***turno.horaFin***REMOVED***</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span>***REMOVED***shiftData.hours.toFixed(1)***REMOVED***h</span>
                  
                  ***REMOVED***/* Indicador nocturno */***REMOVED***
                  ***REMOVED***turno.cruzaMedianoche && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-blue-600 text-xs">🌙</span>
                    </>
                  )***REMOVED***
                </div>
              </div>
            </div>

            ***REMOVED***/* Información específica por tipo */***REMOVED***
            ***REMOVED***shiftData.isDelivery ? (
              // Información de delivery
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600 gap-4">
                  ***REMOVED***shiftData.deliveryData.numeroPedidos > 0 && (
                    <div className="flex items-center">
                      <Package size=***REMOVED***14***REMOVED*** className="mr-1 text-blue-500" />
                      <span>***REMOVED***shiftData.deliveryData.numeroPedidos***REMOVED***</span>
                    </div>
                  )***REMOVED***
                  
                  ***REMOVED***shiftData.deliveryData.kilometros > 0 && (
                    <div className="flex items-center">
                      <Navigation size=***REMOVED***14***REMOVED*** className="mr-1 text-purple-500" />
                      <span>***REMOVED***shiftData.deliveryData.kilometros***REMOVED*** km</span>
                    </div>
                  )***REMOVED***
                </div>

                <div className="flex items-center">
                  <DollarSign size=***REMOVED***16***REMOVED*** className="mr-1 text-green-600" />
                  <span className="font-semibold text-green-600 text-lg">
                    ***REMOVED***formatCurrency(shiftData.totalWithDiscount)***REMOVED***
                  </span>
                </div>
              </div>
            ) : (
              // Información de trabajo tradicional
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Ganancia estimada</span>
                <div className="flex items-center">
                  <DollarSign size=***REMOVED***16***REMOVED*** className="mr-1" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED*** />
                  <span className="font-semibold text-lg" style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***>
                    ***REMOVED***formatCurrency(shiftData.totalWithDiscount)***REMOVED***
                  </span>
                </div>
              </div>
            )***REMOVED***
          </div>

          ***REMOVED***/* Acciones */***REMOVED***
          <div className="flex items-center gap-2 ml-4">
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
          </div>
        </div>

        ***REMOVED***/* Contenido expandible */***REMOVED***
        ***REMOVED***hasAdditionalContent && expanded && (
          <div className="border-t pt-3 space-y-3 animate-in slide-in-from-top-2 duration-200">
            ***REMOVED***/* Observaciones/Notas */***REMOVED***
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
                    <p>Termina el: ***REMOVED***new Date(turno.fechaFin + 'T00:00:00').toLocaleDateString('es-ES', ***REMOVED***
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short'
                    ***REMOVED***)***REMOVED***</p>
                  )***REMOVED***
                </div>
              </div>
            )***REMOVED***

            ***REMOVED***/* Detalles de delivery expandidos */***REMOVED***
            ***REMOVED***shiftData.isDelivery && (shiftData.deliveryData.propinas > 0 || shiftData.deliveryData.gastos > 0) && (
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-sm space-y-2">
                  <div className="font-medium text-green-700 mb-2">Detalles del Delivery</div>
                  
                  ***REMOVED***shiftData.deliveryData.propinas > 0 && (
                    <div className="flex justify-between">
                      <span className="text-green-600">Propinas:</span>
                      <span className="font-medium">***REMOVED***formatCurrency(shiftData.deliveryData.propinas)***REMOVED***</span>
                    </div>
                  )***REMOVED***
                  
                  ***REMOVED***shiftData.deliveryData.gastos > 0 && (
                    <div className="flex justify-between">
                      <span className="text-green-600">Gastos combustible:</span>
                      <span className="font-medium">***REMOVED***formatCurrency(shiftData.deliveryData.gastos)***REMOVED***</span>
                    </div>
                  )***REMOVED***
                  
                  <div className="flex justify-between border-t border-green-200 pt-2">
                    <span className="font-semibold text-green-700">Ganancia neta:</span>
                    <span className="font-bold">***REMOVED***formatCurrency(shiftData.totalWithDiscount - shiftData.deliveryData.gastos)***REMOVED***</span>
                  </div>
                </div>
              </div>
            )***REMOVED***

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
          <div className="flex items-center justify-center pt-1">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        )***REMOVED***
      </div>
    </Card>
  );
***REMOVED***;

export default TarjetaTurno;