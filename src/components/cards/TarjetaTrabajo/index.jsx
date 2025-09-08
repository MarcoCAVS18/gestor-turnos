// src/components/cards/TarjetaTrabajo/index.jsx - Versión actualizada

import React from 'react';
import { Edit, Trash2, Share2, Sun, Moon } from 'lucide-react';
import Card from '../../ui/Card';
import WorkAvatar from '../../work/WorkAvatar';
import ActionsMenu from '../../ui/ActionsMenu';
import { formatCurrency } from '../../../utils/currency';

const TarjetaTrabajo = ({ 
  trabajo, 
  onEdit, 
  onDelete, 
  onShare, 
  showActions = true,
  variant = 'default',
  isSharing = false 
}) => {
  // Validación defensiva - si no hay trabajo, mostrar estado de error
  if (!trabajo) {
    return (
      <Card variant="outlined" className="opacity-50">
        <div className="text-center text-gray-500">
          <p className="text-sm">Trabajo no encontrado</p>
        </div>
      </Card>
    );
  }

  // Validaciones defensivas para propiedades del trabajo
  const nombreTrabajo = trabajo.nombre || 'Trabajo sin nombre';
  const colorTrabajo = trabajo.color || '#EC4899';
  const descripcion = trabajo.descripcion && trabajo.descripcion.trim() 
    ? trabajo.descripcion 
    : 'No olvides guardar más información sobre tu trabajo.';

  // Configurar acciones del menú
  const actions = [
    { 
      icon: Edit, 
      label: 'Editar', 
      onClick: () => onEdit?.(trabajo) 
    },
    ...(onShare ? [{ 
      icon: Share2, 
      label: 'Compartir', 
      onClick: () => onShare?.(trabajo),
      disabled: isSharing
    }] : []),
    { 
      icon: Trash2, 
      label: 'Eliminar', 
      onClick: () => onDelete?.(trabajo), 
      variant: 'danger' 
    }
  ];

  // Información de tarifas
  const tarifaBase = trabajo.tarifaBase || trabajo.salario || 0;
  const tarifaNoche = trabajo.tarifas?.noche || trabajo.tarifaBase || trabajo.salario || 0;
  const tieneTarifaNocturna = tarifaNoche !== tarifaBase && tarifaNoche > 0;

  return (
    <Card 
      variant={variant}
      hover={true}
      className={isSharing ? 'opacity-70' : ''}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1 min-w-0">
          {/* Avatar del trabajo */}
          <WorkAvatar 
            nombre={nombreTrabajo} 
            color={colorTrabajo} 
            size="lg"
          />
          
          <div className="flex-1 ml-4 min-w-0">
            {/* Nombre del trabajo */}
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-800 truncate">
                {nombreTrabajo}
              </h3>
              
              {/* Badge para trabajo tradicional */}
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                Tradicional
              </span>
            </div>
            
            {/* Descripción */}
            <p className="text-gray-600 text-sm mb-3 leading-relaxed italic">
              {descripcion}
            </p>
            
            {/* Información de tarifas */}
            <div className="space-y-2">
              {/* Tarifa base */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Sun size={14} className="text-yellow-500 mr-2" />
                  <span className="text-sm text-gray-600">Tarifa base:</span>
                </div>
                <span className="text-sm font-medium">{formatCurrency(tarifaBase)}/hora</span>
              </div>
              
              {/* Tarifa nocturna si es diferente */}
              {tieneTarifaNocturna && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Moon size={14} className="text-indigo-500 mr-2" />
                    <span className="text-sm text-gray-600">Tarifa noche:</span>
                  </div>
                  <span className="text-sm font-medium">{formatCurrency(tarifaNoche)}/hora</span>
                </div>
              )}

              {/* Información adicional de tarifas si existen */}
              {trabajo.tarifas && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {trabajo.tarifas.sabado && trabajo.tarifas.sabado !== tarifaBase && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Sábado:</span>
                        <span className="font-medium">{formatCurrency(trabajo.tarifas.sabado)}/h</span>
                      </div>
                    )}
                    {trabajo.tarifas.domingo && trabajo.tarifas.domingo !== tarifaBase && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Domingo:</span>
                        <span className="font-medium">{formatCurrency(trabajo.tarifas.domingo)}/h</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menú de acciones */}
        {showActions && (
          <div className="ml-4 flex-shrink-0">
            <ActionsMenu actions={actions} />
          </div>
        )}
      </div>

      {/* Indicador de estado compartiendo */}
      {isSharing && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-center">
            <div className="flex items-center text-sm text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Compartiendo...
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TarjetaTrabajo;