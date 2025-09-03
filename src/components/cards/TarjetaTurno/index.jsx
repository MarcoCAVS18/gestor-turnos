// src/components/cards/TarjetaTurno/index.jsx

import React, { useState } from 'react';
import { Edit, Trash2, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import Card from '../../ui/Card';
import ActionsMenu from '../../ui/ActionsMenu';
import ShiftDetails from '../../shifts/ShiftDetails';
import { useApp } from '../../../contexts/AppContext';
import { determinarTipoTurno, getTipoTurnoLabel } from '../../../utils/shiftDetailsUtils';

const TarjetaTurno = ({
  turno,
  trabajo,
  onEdit,
  onDelete,
  showActions = true,
  variant = 'card'
}) => {
  const { shiftRanges } = useApp();
  const [expanded, setExpanded] = useState(false);

  // Hooks SIEMPRE al inicio, antes de cualquier return
  const { labelTipoTurno, tagColor } = React.useMemo(() => {
    if (!turno || !shiftRanges) {
      return {
        labelTipoTurno: 'Mixto',
        tagColor: 'bg-gray-100 text-gray-700'
      };
    }

    const tipo = determinarTipoTurno(turno, shiftRanges);
    const label = getTipoTurnoLabel(tipo);

    const getTagColor = (tipoCalculado) => {
      const colors = {
        diurno: 'bg-yellow-100 text-yellow-700',
        tarde: 'bg-orange-100 text-orange-700',
        noche: 'bg-blue-100 text-blue-700',
        sabado: 'bg-purple-100 text-purple-700',
        domingo: 'bg-red-100 text-red-700',
        delivery: 'bg-green-100 text-green-700',
        mixto: 'bg-gray-100 text-gray-700'
      };
      return colors[tipoCalculado] || 'bg-gray-100 text-gray-700';
    };

    return {
      labelTipoTurno: label,
      tagColor: getTagColor(tipo)
    };
  }, [turno, shiftRanges]);

  const actions = React.useMemo(() => [
    { icon: Edit, label: 'Editar', onClick: () => onEdit?.(turno) },
    { icon: Trash2, label: 'Eliminar', onClick: () => onDelete?.(turno), variant: 'danger' }
  ], [onEdit, onDelete, turno]);

  // Determinar si hay contenido adicional para mostrar
  const hasAdditionalContent = React.useMemo(() => {
    return Boolean(
      turno?.observaciones?.trim() ||
      turno?.descripcion?.trim() ||
      turno?.notas?.trim()
    );
  }, [turno]);

  // Early returns después de los hooks
  if (!turno) {
    return (
      <Card className="relative">
        <div className="p-4 text-center text-gray-500">
          <p className="text-sm">Turno no encontrado</p>
        </div>
      </Card>
    );
  }

  if (!trabajo) {
    return (
      <Card className="relative">
        <div className="p-4 text-center text-gray-500">
          <p className="text-sm">Trabajo eliminado</p>
          <p className="text-xs text-gray-400 mt-1">
            {turno.horaInicio} - {turno.horaFin}
          </p>
        </div>
      </Card>
    );
  }

  const toggleExpanded = () => {
    if (hasAdditionalContent) {
      setExpanded(!expanded);
    }
  };

  const cardContent = (
    <div className="space-y-3">
      {/* Contenido principal */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-800">{trabajo.nombre}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${tagColor}`}>
              {labelTipoTurno}
            </span>
          </div>

          <ShiftDetails
            turno={turno}
            trabajo={trabajo}
          />
        </div>

        <div className="flex items-center gap-2 ml-4">
          {/* Botón de expansión si hay contenido adicional */}
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
                <ChevronDown size={14} className="text-blue-600 rotate-90" />
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

          {/* Información de fechas si es relevante */}
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
        <div className="flex items-center justify-center pt-2">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );

  if (variant === 'compact') {
    return (
      <div className="p-3 rounded-lg transition-colors">
        {cardContent}
      </div>
    );
  }

  return (
    <Card className="relative !shadow-none">
      {cardContent}
    </Card>
  );
};

export default TarjetaTurno;