// src/components/cards/TarjetaTurnoDelivery/index.jsx - Versión actualizada

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** Clock, Package, Edit2, Trash2, DollarSign, Truck, Navigation, ChevronDown, ChevronUp ***REMOVED*** from 'lucide-react';
import Card from '../../ui/Card';
import ActionsMenu from '../../ui/ActionsMenu';
import ShiftTypeBadge from '../../shifts/ShiftTypeBadge';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';

const TarjetaTurnoDelivery = (***REMOVED*** 
  turno, 
  trabajo, 
  onEdit, 
  onDelete,
  variant = 'default',
  showActions = true
***REMOVED***) => ***REMOVED***
    const [expanded, setExpanded] = useState(false);

  // Validaciones
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

  // Calcular datos del turno
  const formatearHoras = (horaInicio, horaFin) => ***REMOVED***
    const [horaI, minI] = horaInicio.split(':').map(Number);
    const [horaF, minF] = horaFin.split(':').map(Number);
    
    let totalMinutos = (horaF * 60 + minF) - (horaI * 60 + minI);
    if (totalMinutos < 0) totalMinutos += 24 * 60;
    
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    
    if (minutos === 0) return `$***REMOVED***horas***REMOVED***h`;
    return `$***REMOVED***horas***REMOVED***h $***REMOVED***minutos***REMOVED***min`;
  ***REMOVED***;

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
    ***REMOVED*** icon: Edit2, label: 'Editar', onClick: () => onEdit?.(turno) ***REMOVED***,
    ***REMOVED*** icon: Trash2, label: 'Eliminar', onClick: () => onDelete?.(turno), variant: 'danger' ***REMOVED***
  ];

  const toggleExpanded = () => ***REMOVED***
    if (hasAdditionalContent) ***REMOVED***
      setExpanded(!expanded);
    ***REMOVED***
  ***REMOVED***;

  return (
    <Card 
      variant=***REMOVED***variant***REMOVED***
      hover=***REMOVED***true***REMOVED***
    >
      <div className="space-y-3">
        ***REMOVED***/* Header con avatar, nombre y badge */***REMOVED***
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              ***REMOVED***/* Avatar del trabajo */***REMOVED***
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0"
                style=***REMOVED******REMOVED*** backgroundColor: trabajo.colorAvatar || trabajo.color || '#10B981' ***REMOVED******REMOVED***
              >
                <Truck size=***REMOVED***16***REMOVED*** />
              </div>

              ***REMOVED***/* Nombre del trabajo y badges */***REMOVED***
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h4 className="font-medium text-gray-900 truncate min-w-0">***REMOVED***trabajo.nombre***REMOVED***</h4>
                  <ShiftTypeBadge turno=***REMOVED***turno***REMOVED*** size="sm" />
                </div>
                
                ***REMOVED***/* Información básica del turno */***REMOVED***
                <div className="flex items-center text-sm text-gray-600 gap-3">
                  <div className="flex items-center">
                    <Clock size=***REMOVED***14***REMOVED*** className="mr-1.5" />
                    <span>***REMOVED***turno.horaInicio***REMOVED*** - ***REMOVED***turno.horaFin***REMOVED***</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span>***REMOVED***formatearHoras(turno.horaInicio, turno.horaFin)***REMOVED***</span>
                  
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

            ***REMOVED***/* Estadísticas del turno */***REMOVED***
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                ***REMOVED***turno.numeroPedidos > 0 && (
                  <div className="flex items-center">
                    <Package size=***REMOVED***14***REMOVED*** className="mr-1 text-blue-500" />
                    <span>***REMOVED***turno.numeroPedidos***REMOVED***</span>
                  </div>
                )***REMOVED***
                
                ***REMOVED***turno.kilometros > 0 && (
                  <div className="flex items-center">
                    <Navigation size=***REMOVED***14***REMOVED*** className="mr-1 text-purple-500" />
                    <span>***REMOVED***turno.kilometros***REMOVED*** km</span>
                  </div>
                )***REMOVED***
              </div>

              ***REMOVED***/* Ganancia */***REMOVED***
              <div className="flex items-center">
                <DollarSign size=***REMOVED***16***REMOVED*** className="mr-1 text-green-600" />
                <span className="text-lg font-semibold text-green-600">
                  ***REMOVED***formatCurrency(gananciaNeta)***REMOVED***
                </span>
              </div>
            </div>
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
            ***REMOVED***/* Detalles financieros */***REMOVED***
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-sm space-y-2">
                <div className="font-medium text-green-700 mb-2">Detalles Financieros</div>
                
                <div className="flex justify-between">
                  <span className="text-green-600">Ganancia total:</span>
                  <span className="font-medium">***REMOVED***formatCurrency(turno.gananciaTotal || 0)***REMOVED***</span>
                </div>
                
                ***REMOVED***turno.propinas > 0 && (
                  <div className="flex justify-between">
                    <span className="text-green-600">Propinas:</span>
                    <span className="font-medium">***REMOVED***formatCurrency(turno.propinas)***REMOVED***</span>
                  </div>
                )***REMOVED***
                
                ***REMOVED***turno.gastoCombustible > 0 && (
                  <div className="flex justify-between">
                    <span className="text-green-600">Gastos combustible:</span>
                    <span className="font-medium">***REMOVED***formatCurrency(turno.gastoCombustible)***REMOVED***</span>
                  </div>
                )***REMOVED***
                
                ***REMOVED***turno.numeroPedidos > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Promedio/pedido:</span>
                    <span>***REMOVED***formatCurrency(promedioPorPedido)***REMOVED***</span>
                  </div>
                )***REMOVED***
                
                <div className="flex justify-between border-t border-green-200 pt-2">
                  <span className="font-semibold text-green-700">Ganancia neta:</span>
                  <span className="font-bold">***REMOVED***formatCurrency(gananciaNeta)***REMOVED***</span>
                </div>
              </div>
            </div>

            ***REMOVED***/* Observaciones si existen */***REMOVED***
            ***REMOVED***turno.observaciones?.trim() && (
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-medium text-gray-700 mb-2">Notas</div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  ***REMOVED***turno.observaciones***REMOVED***
                </p>
              </div>
            )***REMOVED***

            ***REMOVED***/* Información nocturna */***REMOVED***
            ***REMOVED***turno.cruzaMedianoche && (
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm font-medium text-blue-700 mb-1">Turno Nocturno</div>
                <div className="text-sm text-blue-600">
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

export default TarjetaTurnoDelivery;