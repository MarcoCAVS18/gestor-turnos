// src/components/cards/TarjetaTrabajo/index.jsx - Versión actualizada

import React from 'react';
import ***REMOVED*** Edit, Trash2, Share2, Sun, Moon ***REMOVED*** from 'lucide-react';
import Card from '../../ui/Card';
import WorkAvatar from '../../work/WorkAvatar';
import ActionsMenu from '../../ui/ActionsMenu';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../utils/currency';

const TarjetaTrabajo = (***REMOVED*** 
  trabajo, 
  onEdit, 
  onDelete, 
  onShare, 
  showActions = true,
  variant = 'default',
  isSharing = false 
***REMOVED***) => ***REMOVED***
  // Validación defensiva - si no hay trabajo, mostrar estado de error
  if (!trabajo) ***REMOVED***
    return (
      <Card variant="outlined" className="opacity-50">
        <div className="text-center text-gray-500">
          <p className="text-sm">Trabajo no encontrado</p>
        </div>
      </Card>
    );
  ***REMOVED***

  // Validaciones defensivas para propiedades del trabajo
  const nombreTrabajo = trabajo.nombre || 'Trabajo sin nombre';
  const colorTrabajo = trabajo.color || '#EC4899';
  const descripcion = trabajo.descripcion && trabajo.descripcion.trim() 
    ? trabajo.descripcion 
    : 'No olvides guardar más información sobre tu trabajo.';

  // Configurar acciones del menú
  const actions = [
    ***REMOVED*** 
      icon: Edit, 
      label: 'Editar', 
      onClick: () => onEdit?.(trabajo) 
    ***REMOVED***,
    ...(onShare ? [***REMOVED*** 
      icon: Share2, 
      label: 'Compartir', 
      onClick: () => onShare?.(trabajo),
      disabled: isSharing
    ***REMOVED***] : []),
    ***REMOVED*** 
      icon: Trash2, 
      label: 'Eliminar', 
      onClick: () => onDelete?.(trabajo), 
      variant: 'danger' 
    ***REMOVED***
  ];

  // Información de tarifas
  const tarifaBase = trabajo.tarifaBase || trabajo.salario || 0;
  const tarifaNoche = trabajo.tarifas?.noche || trabajo.tarifaBase || trabajo.salario || 0;
  const tieneTarifaNocturna = tarifaNoche !== tarifaBase && tarifaNoche > 0;

  return (
    <Card 
      variant=***REMOVED***variant***REMOVED***
      hover=***REMOVED***true***REMOVED***
      className=***REMOVED***isSharing ? 'opacity-70' : ''***REMOVED***
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1 min-w-0">
          ***REMOVED***/* Avatar del trabajo */***REMOVED***
          <WorkAvatar 
            nombre=***REMOVED***nombreTrabajo***REMOVED*** 
            color=***REMOVED***colorTrabajo***REMOVED*** 
            size="lg"
          />
          
          <div className="flex-1 ml-4 min-w-0">
            ***REMOVED***/* Nombre del trabajo */***REMOVED***
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-800 truncate">
                ***REMOVED***nombreTrabajo***REMOVED***
              </h3>
              
              ***REMOVED***/* Badge para trabajo tradicional */***REMOVED***
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                Tradicional
              </span>
            </div>
            
            ***REMOVED***/* Descripción */***REMOVED***
            <p className="text-gray-600 text-sm mb-3 leading-relaxed italic">
              ***REMOVED***descripcion***REMOVED***
            </p>
            
            ***REMOVED***/* Información de tarifas */***REMOVED***
            <div className="space-y-2">
              ***REMOVED***/* Tarifa base */***REMOVED***
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Sun size=***REMOVED***14***REMOVED*** className="text-yellow-500 mr-2" />
                  <span className="text-sm text-gray-600">Tarifa base:</span>
                </div>
                <span className="text-sm font-medium">***REMOVED***formatCurrency(tarifaBase)***REMOVED***/hora</span>
              </div>
              
              ***REMOVED***/* Tarifa nocturna si es diferente */***REMOVED***
              ***REMOVED***tieneTarifaNocturna && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Moon size=***REMOVED***14***REMOVED*** className="text-indigo-500 mr-2" />
                    <span className="text-sm text-gray-600">Tarifa noche:</span>
                  </div>
                  <span className="text-sm font-medium">***REMOVED***formatCurrency(tarifaNoche)***REMOVED***/hora</span>
                </div>
              )***REMOVED***

              ***REMOVED***/* Información adicional de tarifas si existen */***REMOVED***
              ***REMOVED***trabajo.tarifas && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    ***REMOVED***trabajo.tarifas.sabado && trabajo.tarifas.sabado !== tarifaBase && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Sábado:</span>
                        <span className="font-medium">***REMOVED***formatCurrency(trabajo.tarifas.sabado)***REMOVED***/h</span>
                      </div>
                    )***REMOVED***
                    ***REMOVED***trabajo.tarifas.domingo && trabajo.tarifas.domingo !== tarifaBase && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Domingo:</span>
                        <span className="font-medium">***REMOVED***formatCurrency(trabajo.tarifas.domingo)***REMOVED***/h</span>
                      </div>
                    )***REMOVED***
                  </div>
                </div>
              )***REMOVED***
            </div>
          </div>
        </div>

        ***REMOVED***/* Menú de acciones */***REMOVED***
        ***REMOVED***showActions && (
          <div className="ml-4 flex-shrink-0">
            <ActionsMenu actions=***REMOVED***actions***REMOVED*** />
          </div>
        )***REMOVED***
      </div>

      ***REMOVED***/* Indicador de estado compartiendo */***REMOVED***
      ***REMOVED***isSharing && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-center">
            <div className="flex items-center text-sm text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Compartiendo...
            </div>
          </div>
        </div>
      )***REMOVED***
    </Card>
  );
***REMOVED***;

export default TarjetaTrabajo;