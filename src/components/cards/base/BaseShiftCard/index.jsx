// src/components/cards/base/BaseShiftCard/index.jsx

import React, { useRef } from 'react';
import { Edit, Edit2, Trash2, Clock, Info } from 'lucide-react';

import Card from '../../../ui/Card';
import ActionsMenu from '../../../ui/ActionsMenu';
import ShiftTypeBadge from '../../../shifts/ShiftTypeBadge';
import Badge from '../../../ui/Badge';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { formatRelativeDate } from '../../../../utils/time';
import { formatCurrency } from '../../../../utils/currency';
import Flex from '../../../ui/Flex';
import ShiftDetailsPopover from '../../../shifts/ShiftDetailsPopover';
import WorkAvatar from '../../../work/WorkAvatar';
import { DELIVERY_VEHICLES, DELIVERY_PLATFORMS_AUSTRALIA } from '../../../../constants/delivery';

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
  shiftData, 
  earningValue, 
  earningLabel, 
  currencySymbol, 
  children 
}) => {
  const colors = useThemeColors();
  const isMobile = useIsMobile();
  // Referencia para el ancho completo del popover
  const cardWrapperRef = useRef(null);

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

  const config = {
    traditional: {
      editIcon: Edit,
      defaultColor: colors.primary,
    },
    delivery: {
      editIcon: Edit2,
      defaultColor: '#10B981',
    }
  };

  const currentConfig = config[type];

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

  // --- Avatar Logic ---
  let iconName = null;
  let avatarColor = trabajo.color || trabajo.colorAvatar || currentConfig.defaultColor;

  if (type === 'delivery') {
    // El color se basa en la plataforma
    if (trabajo.plataforma) {
      const platformName = trabajo.plataforma.toLowerCase();
      const platformData = DELIVERY_PLATFORMS_AUSTRALIA.find(p => p.nombre.toLowerCase() === platformName);
      if (platformData) {
        avatarColor = platformData.color;
      }
    }
    
    // El ícono se basa en el vehículo del trabajo
    if (trabajo.vehiculo) {
      const vehicleName = trabajo.vehiculo.toLowerCase();
      const vehicleData = DELIVERY_VEHICLES.find(v => v.id === vehicleName || v.nombre.toLowerCase() === vehicleName);
      if (vehicleData) {
        iconName = vehicleData.id;
      } else {
        iconName = 'default';
      }
    } else {
      iconName = 'default';
    }
  }

  const renderEarningFooter = () => {
    if (earningValue === undefined) return null;
    
    return (
      <Flex variant="between" className="pt-2 border-t border-gray-100 mt-2">
        <span className="text-sm text-gray-500 font-medium">{earningLabel || 'Ganancia'}</span>
        <span className="text-lg font-bold text-green-600">
          {formatCurrency(earningValue, currencySymbol)}
        </span>
      </Flex>
    );
  };

  const cardContent = (
    <Card
      variant={variant}
      hover={true}
      padding={isMobile ? "sm" : (compact ? 'sm' : 'md')}
      className={isMobile ? "w-full" : ""}
      shadow={compact ? 'sm' : 'md'}
    >
      {isMobile ? (
        // ============= VISTA MOBILE =============
        <div className="space-y-3">
          <Flex variant="start-between">
            <Flex variant="start" className="items-center space-x-3 flex-1 min-w-0">
              <WorkAvatar
                nombre={trabajo.nombre}
                color={avatarColor}
                iconName={iconName}
                size="sm"
              />

              <Flex className="gap-2 min-w-0 overflow-hidden">
                <h3 className="font-semibold text-gray-800 truncate text-base">
                  {trabajo.nombre}
                </h3>
                <ShiftTypeBadge turno={turno} size="sm" />
              </Flex>
            </Flex>

            <div className="flex items-center gap-2">
                {/* Popover con nuevo diseño */}
                <ShiftDetailsPopover 
                    turno={turno} 
                    shiftData={shiftData} 
                    anchorRef={cardWrapperRef}
                    position="top"
                    fullWidth={true}
                >
                    <Info size={18} className="cursor-pointer text-gray-400 hover:text-gray-600" />
                </ShiftDetailsPopover>
                
                {showActions && <ActionsMenu actions={actions} />}
            </div>
          </Flex>

          <div className="space-y-2">
            <Flex variant="start">
              <Flex variant="start" className="text-sm text-gray-600">
                <Clock size={14} className="mr-1.5" />
                <span>{turno.horaInicio} - {turno.horaFin}</span>
              </Flex>
              <div className="text-sm text-gray-600 ml-2 border-l pl-2 border-gray-300">
                {shiftData?.hours?.toFixed(1) || '0.0'}h
              </div>

            </Flex>

            {/* RESTAURADO: Badges y fecha en Mobile */}
            <Flex variant="start" className="gap-2">
              {fecha && (
                <Badge variant="default" size="sm">
                  {formatRelativeDate(fecha)}
                </Badge>
              )}
              {children?.mobileBadge}
              
              {turno.cruzaMedianoche && (
                <span className="text-blue-600 text-xs ml-auto">🌙</span>
              )}
            </Flex>

            {/* RESTAURADO: Stats adicionales en Mobile (ej. km, pedidos) */}
            {children?.mobileStats}
            
            {renderEarningFooter()}
          </div>
        </div>
      ) : (
        // ============= VISTA DESKTOP =============
        <div className="space-y-3">
          <Flex variant="start-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <WorkAvatar
                  nombre={trabajo.nombre}
                  color={avatarColor}
                  iconName={iconName}
                  size="md"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-gray-800 truncate min-w-0">
                      {trabajo.nombre}
                    </h3>
                    <ShiftTypeBadge turno={turno} size="sm" />
                  </div>

                  <Flex variant="start" className="text-sm text-gray-600 gap-3 flex-wrap">
                    <Flex variant="center">
                      <Clock size={14} className="mr-1.5" />
                      <span>{turno.horaInicio} - {turno.horaFin}</span>
                    </Flex>
                    <span className="text-gray-300">•</span>
                    <span>{shiftData?.hours?.toFixed(1) || '0.0'}h</span>
                    
                    {/* RESTAURADO: Fecha y Badges en Desktop */}
                    {fecha && (
                      <>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {formatRelativeDate(fecha)}
                          </span>
                          {children?.desktopBadge}
                        </div>
                      </>
                    )}

                    {turno.cruzaMedianoche && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="text-blue-600 text-xs">🌙</span>
                      </>
                    )}
                  </Flex>
                </div>
              </div>

              {/* RESTAURADO: Stats adicionales en Desktop */}
              {children?.desktopStats}
              
              {renderEarningFooter()}
            </div>

            <Flex variant="center" className="gap-2 ml-4 self-start">
              {/* Popover con nuevo diseño */}
              <ShiftDetailsPopover 
                  turno={turno} 
                  shiftData={shiftData} 
                  anchorRef={cardWrapperRef}
                  position="top"
                  fullWidth={true}
              >
                  <Info size={18} className="cursor-pointer text-gray-400 hover:text-gray-600" />
              </ShiftDetailsPopover>
              
              {showActions && <ActionsMenu actions={actions} />}
            </Flex>
          </Flex>
        </div>
      )}
    </Card>
  );

  return (
    <div ref={cardWrapperRef} className="w-full relative">
      {cardContent}
    </div>
  )
};

export default BaseShiftCard;