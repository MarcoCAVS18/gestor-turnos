// src/components/cards/base/BaseShiftCard/index.jsx
import React from 'react';
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
import ShiftDetailsPopover from '../../../popovers/ShiftDetailsPopover';

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
      avatarContent: trabajo.nombre?.charAt(0)?.toUpperCase() || 'T'
    ***REMOVED***,
    delivery: ***REMOVED***
      editIcon: Edit2,
      defaultColor: '#10B981',
      avatarContent: null 
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

  const colorTrabajo = trabajo.color || trabajo.colorAvatar || currentConfig.defaultColor;

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

  if (isMobile) ***REMOVED***
    return (
      <Card
        variant=***REMOVED***variant***REMOVED***
        hover=***REMOVED***true***REMOVED***
        padding="sm"
        className="w-full"
      >
        <div className="space-y-3">
          <Flex variant="start-between">
            <Flex variant="start" className="items-center space-x-3 flex-1 min-w-0">
              <Flex variant="center"
                className="rounded-lg w-8 h-8 text-white font-bold text-sm flex-shrink-0"
                style=***REMOVED******REMOVED*** backgroundColor: colorTrabajo ***REMOVED******REMOVED***
              >
                ***REMOVED***currentConfig.avatarContent || children?.avatarIcon***REMOVED***
              </Flex>

              <Flex className="gap-2 min-w-0 overflow-hidden">
                <h3 className="font-semibold text-gray-800 truncate text-base">
                  ***REMOVED***trabajo.nombre***REMOVED***
                </h3>
                <ShiftTypeBadge turno=***REMOVED***turno***REMOVED*** size="sm" />
              </Flex>
            </Flex>

            <div className="flex items-center gap-2">
                <ShiftDetailsPopover turno=***REMOVED***turno***REMOVED*** shiftData=***REMOVED***shiftData***REMOVED***>
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

            ***REMOVED***children?.mobileStats***REMOVED***

            ***REMOVED***renderEarningFooter()***REMOVED***

          </div>
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
        <Flex variant="start-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <Flex variant="center"
                className="w-10 h-10 rounded-lg text-white font-bold flex-shrink-0"
                style=***REMOVED******REMOVED*** backgroundColor: colorTrabajo ***REMOVED******REMOVED***
              >
                ***REMOVED***currentConfig.avatarContent || children?.avatarIcon***REMOVED***
              </Flex>

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

            ***REMOVED***children?.desktopStats***REMOVED***

            ***REMOVED***renderEarningFooter()***REMOVED***
          </div>

          <Flex variant="center" className="gap-2 ml-4 self-start">
            <ShiftDetailsPopover turno=***REMOVED***turno***REMOVED*** shiftData=***REMOVED***shiftData***REMOVED***>
                <Info size=***REMOVED***18***REMOVED*** className="cursor-pointer text-gray-400 hover:text-gray-600" />
            </ShiftDetailsPopover>
            ***REMOVED***showActions && <ActionsMenu actions=***REMOVED***actions***REMOVED*** />***REMOVED***
          </Flex>
        </Flex>
      </div>
    </Card>
  );
***REMOVED***;

export default BaseShiftCard;