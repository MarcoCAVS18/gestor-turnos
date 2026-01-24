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
  shift,
  job,
  date,
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
  // Reference for the full width of the popover
  const cardWrapperRef = useRef(null);

  if (!shift) {
    return (
      <Card variant="outlined" className="opacity-50">
        <div className="text-center text-gray-500">
          <p className="text-sm">Shift not found</p>
        </div>
      </Card>
    );
  }

  if (!job) {
    return (
      <Card variant="outlined" className="opacity-50">
        <div className="text-center text-gray-500">
          <p className="text-sm">Job deleted</p>
          <p className="text-xs text-gray-400 mt-1">
            {shift.startTime} - {shift.endTime}
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
      label: 'Edit',
      onClick: () => onEdit?.(shift)
    },
    {
      icon: Trash2,
      label: 'Delete',
      onClick: () => onDelete?.(shift),
      variant: 'danger'
    }
  ];

  // --- Avatar Logic ---
  let iconName = null;
  let avatarColor = job.color || job.avatarColor || currentConfig.defaultColor;

  if (type === 'delivery') {
    // The color is based on the platform
    if (job.platform) {
      const platformName = job.platform.toLowerCase();
      const platformData = DELIVERY_PLATFORMS_AUSTRALIA.find(p => p.name.toLowerCase() === platformName);
      if (platformData) {
        avatarColor = platformData.color;
      }
    }
    
    // The icon is based on the job's vehicle
    if (job.vehicle) {
      const vehicleName = job.vehicle.toLowerCase();
      const vehicleData = DELIVERY_VEHICLES.find(v => v.id === vehicleName || v.name.toLowerCase() === vehicleName);
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
        <span className="text-sm text-gray-500 font-medium">{earningLabel || 'Earning'}</span>
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
        // ============= MOBILE VIEW =============
        <div className="space-y-3">
          <Flex variant="start-between">
            <Flex variant="start" className="items-center space-x-3 flex-1 min-w-0">
              <WorkAvatar
                name={job.name}
                color={avatarColor}
                iconName={iconName}
                size="sm"
              />

              <Flex className="gap-2 min-w-0 overflow-hidden">
                <h3 className="font-semibold text-gray-800 truncate text-base">
                  {job.name}
                </h3>
                <ShiftTypeBadge shift={shift} size="sm" />
              </Flex>
            </Flex>

            <div className="flex items-center gap-2">
                {/* Popover with new design */}
                <ShiftDetailsPopover 
                    shift={shift} 
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
                <span>{shift.startTime} - {shift.endTime}</span>
              </Flex>
              <div className="text-sm text-gray-600 ml-2 border-l pl-2 border-gray-300">
                {shiftData?.hours?.toFixed(1) || '0.0'}h
              </div>

            </Flex>

            {/* RESTORED: Badges and date in Mobile */}
            <Flex variant="start" className="gap-2">
              {date && (
                <Badge variant="default" size="sm">
                  {formatRelativeDate(date)}
                </Badge>
              )}
              {children?.mobileBadge}
              
              {shift.crossesMidnight && (
                <span className="text-blue-600 text-xs ml-auto">🌙</span>
              )}
            </Flex>

            {/* RESTORED: Additional stats in Mobile (e.g. km, orders) */}
            {children?.mobileStats}
            
            {renderEarningFooter()}
          </div>
        </div>
      ) : (
        // ============= DESKTOP VIEW =============
        <div className="space-y-3">
          <Flex variant="start-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <WorkAvatar
                  name={job.name}
                  color={avatarColor}
                  iconName={iconName}
                  size="md"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-gray-800 truncate min-w-0">
                      {job.name}
                    </h3>
                    <ShiftTypeBadge shift={shift} size="sm" />
                  </div>

                  <Flex variant="start" className="text-sm text-gray-600 gap-3 flex-wrap">
                    <Flex variant="center">
                      <Clock size={14} className="mr-1.5" />
                      <span>{shift.startTime} - {shift.endTime}</span>
                    </Flex>
                    <span className="text-gray-300">•</span>
                    <span>{shiftData?.hours?.toFixed(1) || '0.0'}h</span>
                    
                    {/* RESTORED: Date and Badges in Desktop */}
                    {date && (
                      <>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {formatRelativeDate(date)}
                          </span>
                          {children?.desktopBadge}
                        </div>
                      </>
                    )}

                    {shift.crossesMidnight && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="text-blue-600 text-xs">🌙</span>
                      </>
                    )}
                  </Flex>
                </div>
              </div>

              {/* RESTORED: Additional stats in Desktop */}
              {children?.desktopStats}
              
              {renderEarningFooter()}
            </div>

            <Flex variant="center" className="gap-2 ml-4 self-start">
              {/* Popover with new design */}
              <ShiftDetailsPopover 
                  shift={shift} 
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