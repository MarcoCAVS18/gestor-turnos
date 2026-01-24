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
***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const isMobile = useIsMobile();
  // Reference for the full width of the popover
  const cardWrapperRef = useRef(null);

  if (!shift) ***REMOVED***
    return (
      <Card variant="outlined" className="opacity-50">
        <div className="text-center text-gray-500">
          <p className="text-sm">Shift not found</p>
        </div>
      </Card>
    );
  ***REMOVED***

  if (!job) ***REMOVED***
    return (
      <Card variant="outlined" className="opacity-50">
        <div className="text-center text-gray-500">
          <p className="text-sm">Job deleted</p>
          <p className="text-xs text-gray-400 mt-1">
            ***REMOVED***shift.startTime***REMOVED*** - ***REMOVED***shift.endTime***REMOVED***
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
      label: 'Edit',
      onClick: () => onEdit?.(shift)
    ***REMOVED***,
    ***REMOVED***
      icon: Trash2,
      label: 'Delete',
      onClick: () => onDelete?.(shift),
      variant: 'danger'
    ***REMOVED***
  ];

  // --- Avatar Logic ---
  let iconName = null;
  let avatarColor = job.color || job.avatarColor || currentConfig.defaultColor;

  if (type === 'delivery') ***REMOVED***
    // The color is based on the platform
    if (job.platform) ***REMOVED***
      const platformName = job.platform.toLowerCase();
      const platformData = DELIVERY_PLATFORMS_AUSTRALIA.find(p => p.name.toLowerCase() === platformName);
      if (platformData) ***REMOVED***
        avatarColor = platformData.color;
      ***REMOVED***
    ***REMOVED***
    
    // The icon is based on the job's vehicle
    if (job.vehicle) ***REMOVED***
      const vehicleName = job.vehicle.toLowerCase();
      const vehicleData = DELIVERY_VEHICLES.find(v => v.id === vehicleName || v.name.toLowerCase() === vehicleName);
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
        <span className="text-sm text-gray-500 font-medium">***REMOVED***earningLabel || 'Earning'***REMOVED***</span>
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
        // ============= MOBILE VIEW =============
        <div className="space-y-3">
          <Flex variant="start-between">
            <Flex variant="start" className="items-center space-x-3 flex-1 min-w-0">
              <WorkAvatar
                name=***REMOVED***job.name***REMOVED***
                color=***REMOVED***avatarColor***REMOVED***
                iconName=***REMOVED***iconName***REMOVED***
                size="sm"
              />

              <Flex className="gap-2 min-w-0 overflow-hidden">
                <h3 className="font-semibold text-gray-800 truncate text-base">
                  ***REMOVED***job.name***REMOVED***
                </h3>
                <ShiftTypeBadge shift=***REMOVED***shift***REMOVED*** size="sm" />
              </Flex>
            </Flex>

            <div className="flex items-center gap-2">
                ***REMOVED***/* Popover with new design */***REMOVED***
                <ShiftDetailsPopover 
                    shift=***REMOVED***shift***REMOVED*** 
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
                <span>***REMOVED***shift.startTime***REMOVED*** - ***REMOVED***shift.endTime***REMOVED***</span>
              </Flex>
              <div className="text-sm text-gray-600 ml-2 border-l pl-2 border-gray-300">
                ***REMOVED***shiftData?.hours?.toFixed(1) || '0.0'***REMOVED***h
              </div>

            </Flex>

            ***REMOVED***/* RESTORED: Badges and date in Mobile */***REMOVED***
            <Flex variant="start" className="gap-2">
              ***REMOVED***date && (
                <Badge variant="default" size="sm">
                  ***REMOVED***formatRelativeDate(date)***REMOVED***
                </Badge>
              )***REMOVED***
              ***REMOVED***children?.mobileBadge***REMOVED***
              
              ***REMOVED***shift.crossesMidnight && (
                <span className="text-blue-600 text-xs ml-auto">🌙</span>
              )***REMOVED***
            </Flex>

            ***REMOVED***/* RESTORED: Additional stats in Mobile (e.g. km, orders) */***REMOVED***
            ***REMOVED***children?.mobileStats***REMOVED***
            
            ***REMOVED***renderEarningFooter()***REMOVED***
          </div>
        </div>
      ) : (
        // ============= DESKTOP VIEW =============
        <div className="space-y-3">
          <Flex variant="start-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <WorkAvatar
                  name=***REMOVED***job.name***REMOVED***
                  color=***REMOVED***avatarColor***REMOVED***
                  iconName=***REMOVED***iconName***REMOVED***
                  size="md"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-gray-800 truncate min-w-0">
                      ***REMOVED***job.name***REMOVED***
                    </h3>
                    <ShiftTypeBadge shift=***REMOVED***shift***REMOVED*** size="sm" />
                  </div>

                  <Flex variant="start" className="text-sm text-gray-600 gap-3 flex-wrap">
                    <Flex variant="center">
                      <Clock size=***REMOVED***14***REMOVED*** className="mr-1.5" />
                      <span>***REMOVED***shift.startTime***REMOVED*** - ***REMOVED***shift.endTime***REMOVED***</span>
                    </Flex>
                    <span className="text-gray-300">•</span>
                    <span>***REMOVED***shiftData?.hours?.toFixed(1) || '0.0'***REMOVED***h</span>
                    
                    ***REMOVED***/* RESTORED: Date and Badges in Desktop */***REMOVED***
                    ***REMOVED***date && (
                      <>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            ***REMOVED***formatRelativeDate(date)***REMOVED***
                          </span>
                          ***REMOVED***children?.desktopBadge***REMOVED***
                        </div>
                      </>
                    )***REMOVED***

                    ***REMOVED***shift.crossesMidnight && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="text-blue-600 text-xs">🌙</span>
                      </>
                    )***REMOVED***
                  </Flex>
                </div>
              </div>

              ***REMOVED***/* RESTORED: Additional stats in Desktop */***REMOVED***
              ***REMOVED***children?.desktopStats***REMOVED***
              
              ***REMOVED***renderEarningFooter()***REMOVED***
            </div>

            <Flex variant="center" className="gap-2 ml-4 self-start">
              ***REMOVED***/* Popover with new design */***REMOVED***
              <ShiftDetailsPopover 
                  shift=***REMOVED***shift***REMOVED*** 
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