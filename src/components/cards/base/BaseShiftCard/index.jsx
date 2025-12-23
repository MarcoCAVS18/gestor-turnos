// src/components/cards/base/BaseShiftCard/index.jsx

import React, ***REMOVED*** useRef ***REMOVED*** from 'react';
import ***REMOVED*** Edit, Edit2, Trash2, Clock, Info ***REMOVED*** from 'lucide-react';

import Card from '../../../ui/Card';
import ActionsMenu from '../../../ui/ActionsMenu';
import ShiftTypeBadge from '../../../shifts/ShiftTypeBadge';
import Badge from '../../../ui/Badge';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../../hooks/useThemeColors';
import ***REMOVED*** useIsMobile ***REMOVED*** from '../../../../hooks/useIsMobile';
import ***REMOVED*** formatRelativeDate ***REMOVED*** from '../../../../utils/time';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../../utils/currency';
import Flex from '../../../ui/Flex';
import ShiftDetailsPopover from '../../../shifts/ShiftDetailsPopover';
import WorkAvatar from '../../../work/WorkAvatar';
import ***REMOVED*** DELIVERY_VEHICLES, DELIVERY_PLATFORMS_AUSTRALIA ***REMOVED*** from '../../../../constants/delivery';

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
  shiftData, 
  earningValue, 
  earningLabel, 
  currencySymbol, 
  children 
***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const isMobile = useIsMobile();
  // Referencia para el ancho completo del popover
  const cardWrapperRef = useRef(null);

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

  const config = ***REMOVED***
    traditional: ***REMOVED***
      editIcon: Edit,
      defaultColor: colors.primary,
    ***REMOVED***,
    delivery: ***REMOVED***
      editIcon: Edit2,
      defaultColor: '#10B981',
    ***REMOVED***
  ***REMOVED***;

  const currentConfig = config[type];

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

  // --- Avatar Logic ---
  let iconName = null;
  let avatarColor = trabajo.color || trabajo.colorAvatar || currentConfig.defaultColor;

  if (type === 'delivery') ***REMOVED***
    // El color se basa en la plataforma
    if (trabajo.plataforma) ***REMOVED***
      const platformName = trabajo.plataforma.toLowerCase();
      const platformData = DELIVERY_PLATFORMS_AUSTRALIA.find(p => p.nombre.toLowerCase() === platformName);
      if (platformData) ***REMOVED***
        avatarColor = platformData.color;
      ***REMOVED***
    ***REMOVED***
    
    // El ícono se basa en el vehículo del trabajo
    if (trabajo.vehiculo) ***REMOVED***
      const vehicleName = trabajo.vehiculo.toLowerCase();
      const vehicleData = DELIVERY_VEHICLES.find(v => v.id === vehicleName || v.nombre.toLowerCase() === vehicleName);
      if (vehicleData) ***REMOVED***
        iconName = vehicleData.id;
      ***REMOVED*** else ***REMOVED***
        iconName = 'default';
      ***REMOVED***
    ***REMOVED*** else ***REMOVED***
      iconName = 'default';
    ***REMOVED***
  ***REMOVED***

  const renderEarningFooter = () => ***REMOVED***
    if (earningValue === undefined) return null;
    
    return (
      <Flex variant="between" className="pt-2 border-t border-gray-100 mt-2">
        <span className="text-sm text-gray-500 font-medium">***REMOVED***earningLabel || 'Ganancia'***REMOVED***</span>
        <span className="text-lg font-bold text-green-600">
          ***REMOVED***formatCurrency(earningValue, currencySymbol)***REMOVED***
        </span>
      </Flex>
    );
  ***REMOVED***;

  const cardContent = (
    <Card
      variant=***REMOVED***variant***REMOVED***
      hover=***REMOVED***true***REMOVED***
      padding=***REMOVED***isMobile ? "sm" : (compact ? 'sm' : 'md')***REMOVED***
      className=***REMOVED***isMobile ? "w-full" : ""***REMOVED***
      shadow=***REMOVED***compact ? 'sm' : 'md'***REMOVED***
    >
      ***REMOVED***isMobile ? (
        // ============= VISTA MOBILE =============
        <div className="space-y-3">
          <Flex variant="start-between">
            <Flex variant="start" className="items-center space-x-3 flex-1 min-w-0">
              <WorkAvatar
                nombre=***REMOVED***trabajo.nombre***REMOVED***
                color=***REMOVED***avatarColor***REMOVED***
                iconName=***REMOVED***iconName***REMOVED***
                size="sm"
              />

              <Flex className="gap-2 min-w-0 overflow-hidden">
                <h3 className="font-semibold text-gray-800 truncate text-base">
                  ***REMOVED***trabajo.nombre***REMOVED***
                </h3>
                <ShiftTypeBadge turno=***REMOVED***turno***REMOVED*** size="sm" />
              </Flex>
            </Flex>

            <div className="flex items-center gap-2">
                ***REMOVED***/* Popover con nuevo diseño */***REMOVED***
                <ShiftDetailsPopover 
                    turno=***REMOVED***turno***REMOVED*** 
                    shiftData=***REMOVED***shiftData***REMOVED*** 
                    anchorRef=***REMOVED***cardWrapperRef***REMOVED***
                    position="top"
                    fullWidth=***REMOVED***true***REMOVED***
                >
                    <Info size=***REMOVED***18***REMOVED*** className="cursor-pointer text-gray-400 hover:text-gray-600" />
                </ShiftDetailsPopover>
                
                ***REMOVED***showActions && <ActionsMenu actions=***REMOVED***actions***REMOVED*** />***REMOVED***
            </div>
          </Flex>

          <div className="space-y-2">
            <Flex variant="start">
              <Flex variant="start" className="text-sm text-gray-600">
                <Clock size=***REMOVED***14***REMOVED*** className="mr-1.5" />
                <span>***REMOVED***turno.horaInicio***REMOVED*** - ***REMOVED***turno.horaFin***REMOVED***</span>
              </Flex>
              <div className="text-sm text-gray-600 ml-2 border-l pl-2 border-gray-300">
                ***REMOVED***shiftData?.hours?.toFixed(1) || '0.0'***REMOVED***h
              </div>

            </Flex>

            ***REMOVED***/* RESTAURADO: Badges y fecha en Mobile */***REMOVED***
            <Flex variant="start" className="gap-2">
              ***REMOVED***fecha && (
                <Badge variant="default" size="sm">
                  ***REMOVED***formatRelativeDate(fecha)***REMOVED***
                </Badge>
              )***REMOVED***
              ***REMOVED***children?.mobileBadge***REMOVED***
              
              ***REMOVED***turno.cruzaMedianoche && (
                <span className="text-blue-600 text-xs ml-auto">🌙</span>
              )***REMOVED***
            </Flex>

            ***REMOVED***/* RESTAURADO: Stats adicionales en Mobile (ej. km, pedidos) */***REMOVED***
            ***REMOVED***children?.mobileStats***REMOVED***
            
            ***REMOVED***renderEarningFooter()***REMOVED***
          </div>
        </div>
      ) : (
        // ============= VISTA DESKTOP =============
        <div className="space-y-3">
          <Flex variant="start-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <WorkAvatar
                  nombre=***REMOVED***trabajo.nombre***REMOVED***
                  color=***REMOVED***avatarColor***REMOVED***
                  iconName=***REMOVED***iconName***REMOVED***
                  size="md"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-gray-800 truncate min-w-0">
                      ***REMOVED***trabajo.nombre***REMOVED***
                    </h3>
                    <ShiftTypeBadge turno=***REMOVED***turno***REMOVED*** size="sm" />
                  </div>

                  <Flex variant="start" className="text-sm text-gray-600 gap-3 flex-wrap">
                    <Flex variant="center">
                      <Clock size=***REMOVED***14***REMOVED*** className="mr-1.5" />
                      <span>***REMOVED***turno.horaInicio***REMOVED*** - ***REMOVED***turno.horaFin***REMOVED***</span>
                    </Flex>
                    <span className="text-gray-300">•</span>
                    <span>***REMOVED***shiftData?.hours?.toFixed(1) || '0.0'***REMOVED***h</span>
                    
                    ***REMOVED***/* RESTAURADO: Fecha y Badges en Desktop */***REMOVED***
                    ***REMOVED***fecha && (
                      <>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            ***REMOVED***formatRelativeDate(fecha)***REMOVED***
                          </span>
                          ***REMOVED***children?.desktopBadge***REMOVED***
                        </div>
                      </>
                    )***REMOVED***

                    ***REMOVED***turno.cruzaMedianoche && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="text-blue-600 text-xs">🌙</span>
                      </>
                    )***REMOVED***
                  </Flex>
                </div>
              </div>

              ***REMOVED***/* RESTAURADO: Stats adicionales en Desktop */***REMOVED***
              ***REMOVED***children?.desktopStats***REMOVED***
              
              ***REMOVED***renderEarningFooter()***REMOVED***
            </div>

            <Flex variant="center" className="gap-2 ml-4 self-start">
              ***REMOVED***/* Popover con nuevo diseño */***REMOVED***
              <ShiftDetailsPopover 
                  turno=***REMOVED***turno***REMOVED*** 
                  shiftData=***REMOVED***shiftData***REMOVED*** 
                  anchorRef=***REMOVED***cardWrapperRef***REMOVED***
                  position="top"
                  fullWidth=***REMOVED***true***REMOVED***
              >
                  <Info size=***REMOVED***18***REMOVED*** className="cursor-pointer text-gray-400 hover:text-gray-600" />
              </ShiftDetailsPopover>
              
              ***REMOVED***showActions && <ActionsMenu actions=***REMOVED***actions***REMOVED*** />***REMOVED***
            </Flex>
          </Flex>
        </div>
      )***REMOVED***
    </Card>
  );

  return (
    <div ref=***REMOVED***cardWrapperRef***REMOVED*** className="w-full relative">
      ***REMOVED***cardContent***REMOVED***
    </div>
  )
***REMOVED***;

export default BaseShiftCard;