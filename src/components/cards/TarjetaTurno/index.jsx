// src/components/cards/TarjetaTurno/index.jsx

import React, ***REMOVED*** useState ***REMOVED*** from 'react';
import ***REMOVED*** Edit, Trash2, ChevronDown, ChevronUp, MessageSquare ***REMOVED*** from 'lucide-react';
import Card from '../../ui/Card';
import ActionsMenu from '../../ui/ActionsMenu';
import ShiftDetails from '../../shifts/ShiftDetails';
import ***REMOVED*** useApp ***REMOVED*** from '../../../contexts/AppContext';
import ***REMOVED*** determinarTipoTurno, getTipoTurnoLabel ***REMOVED*** from '../../../utils/shiftDetailsUtils';

const TarjetaTurno = (***REMOVED***
  turno,
  trabajo,
  onEdit,
  onDelete,
  showActions = true,
  variant = 'card'
***REMOVED***) => ***REMOVED***
  const ***REMOVED*** shiftRanges ***REMOVED*** = useApp();
  const [expanded, setExpanded] = useState(false);

  // Hooks SIEMPRE al inicio, antes de cualquier return
  const ***REMOVED*** labelTipoTurno, tagColor ***REMOVED*** = React.useMemo(() => ***REMOVED***
    if (!turno || !shiftRanges) ***REMOVED***
      return ***REMOVED***
        labelTipoTurno: 'Mixto',
        tagColor: 'bg-gray-100 text-gray-700'
      ***REMOVED***;
    ***REMOVED***

    const tipo = determinarTipoTurno(turno, shiftRanges);
    const label = getTipoTurnoLabel(tipo);

    const getTagColor = (tipoCalculado) => ***REMOVED***
      const colors = ***REMOVED***
        diurno: 'bg-yellow-100 text-yellow-700',
        tarde: 'bg-orange-100 text-orange-700',
        noche: 'bg-blue-100 text-blue-700',
        sabado: 'bg-purple-100 text-purple-700',
        domingo: 'bg-red-100 text-red-700',
        delivery: 'bg-green-100 text-green-700',
        mixto: 'bg-gray-100 text-gray-700'
      ***REMOVED***;
      return colors[tipoCalculado] || 'bg-gray-100 text-gray-700';
    ***REMOVED***;

    return ***REMOVED***
      labelTipoTurno: label,
      tagColor: getTagColor(tipo)
    ***REMOVED***;
  ***REMOVED***, [turno, shiftRanges]);

  const actions = React.useMemo(() => [
    ***REMOVED*** icon: Edit, label: 'Editar', onClick: () => onEdit?.(turno) ***REMOVED***,
    ***REMOVED*** icon: Trash2, label: 'Eliminar', onClick: () => onDelete?.(turno), variant: 'danger' ***REMOVED***
  ], [onEdit, onDelete, turno]);

  // Determinar si hay contenido adicional para mostrar
  const hasAdditionalContent = React.useMemo(() => ***REMOVED***
    return Boolean(
      turno?.observaciones?.trim() ||
      turno?.descripcion?.trim() ||
      turno?.notas?.trim()
    );
  ***REMOVED***, [turno]);

  // Early returns después de los hooks
  if (!turno) ***REMOVED***
    return (
      <Card className="relative">
        <div className="p-4 text-center text-gray-500">
          <p className="text-sm">Turno no encontrado</p>
        </div>
      </Card>
    );
  ***REMOVED***

  if (!trabajo) ***REMOVED***
    return (
      <Card className="relative">
        <div className="p-4 text-center text-gray-500">
          <p className="text-sm">Trabajo eliminado</p>
          <p className="text-xs text-gray-400 mt-1">
            ***REMOVED***turno.horaInicio***REMOVED*** - ***REMOVED***turno.horaFin***REMOVED***
          </p>
        </div>
      </Card>
    );
  ***REMOVED***

  const toggleExpanded = () => ***REMOVED***
    if (hasAdditionalContent) ***REMOVED***
      setExpanded(!expanded);
    ***REMOVED***
  ***REMOVED***;

  const cardContent = (
    <div className="space-y-3">
      ***REMOVED***/* Contenido principal */***REMOVED***
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-800">***REMOVED***trabajo.nombre***REMOVED***</h3>
            <span className=***REMOVED***`text-xs px-2 py-1 rounded-full $***REMOVED***tagColor***REMOVED***`***REMOVED***>
              ***REMOVED***labelTipoTurno***REMOVED***
            </span>
          </div>

          <ShiftDetails
            turno=***REMOVED***turno***REMOVED***
            trabajo=***REMOVED***trabajo***REMOVED***
          />
        </div>

        <div className="flex items-center gap-2 ml-4">
          ***REMOVED***/* Botón de expansión si hay contenido adicional */***REMOVED***
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
                <ChevronDown size=***REMOVED***14***REMOVED*** className="text-blue-600 rotate-90" />
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

          ***REMOVED***/* Información de fechas si es relevante */***REMOVED***
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
        <div className="flex items-center justify-center pt-2">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      )***REMOVED***
    </div>
  );

  if (variant === 'compact') ***REMOVED***
    return (
      <div className="p-3 rounded-lg transition-colors">
        ***REMOVED***cardContent***REMOVED***
      </div>
    );
  ***REMOVED***

  return (
    <Card className="relative !shadow-none">
      ***REMOVED***cardContent***REMOVED***
    </Card>
  );
***REMOVED***;

export default TarjetaTurno;