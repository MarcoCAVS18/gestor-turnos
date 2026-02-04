// src/components/cards/base/BaseShiftCard/index.jsx

import React, { useRef } from 'react';
import { Edit, Edit2, Trash2, Clock, Calendar, Briefcase, Bike, ChevronDown, DollarSign, CircleDotDashed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../../ui/Card';
import ShiftTypeBadge from '../../../shifts/ShiftTypeBadge';
import Badge from '../../../ui/Badge';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { formatRelativeDate } from '../../../../utils/time';
import { formatCurrency } from '../../../../utils/currency';
import Flex from '../../../ui/Flex';
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
  const cardWrapperRef = useRef(null);
  const [showDetails, setShowDetails] = React.useState(false);

  if (!shift) {
    return (
      <Card variant="outlined" className="opacity-50">
        <div className="text-center text-gray-500">
          <p className="text-sm">Shift not found</p>
        </div>
      </Card>
    );
  }

  if (!job && type !== 'delivery') {
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

  const jobData = job || {
    name: type === 'delivery' ? (shift.platform || 'Delivery') : 'Unknown Job',
    color: '#10B981',
    avatarColor: '#10B981',
    platform: shift.platform,
    vehicle: shift.vehicle,
  };

  const config = {
    traditional: {
      editIcon: Edit,
      defaultColor: colors.primary,
      badgeIcon: Briefcase,
      badgeVariant: 'primary',
      badgeLabel: 'Traditional'
    },
    delivery: {
      editIcon: Edit2,
      defaultColor: '#10B981',
      badgeIcon: Bike,
      badgeVariant: 'success',
      badgeLabel: 'Delivery'
    }
  };

  const currentConfig = config[type];

  // --- Avatar Logic ---
  let iconName = null;
  let avatarColor = jobData.color || jobData.avatarColor || currentConfig.defaultColor;

  if (type === 'delivery') {
    // The color is based on the platform
    if (jobData.platform) {
      const platformName = jobData.platform.toLowerCase();
      const platformData = DELIVERY_PLATFORMS_AUSTRALIA.find(p => p.name.toLowerCase() === platformName);
      if (platformData) {
        avatarColor = platformData.color;
      }
    }

    // The icon is based on the job's vehicle
    if (jobData.vehicle) {
      const vehicleName = jobData.vehicle.toLowerCase();
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

  const BadgeIcon = currentConfig.badgeIcon;

  const variants = {
    initial: { opacity: 0, scale: 0.95, filter: 'blur(4px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 1.05, filter: 'blur(4px)' }
  };

  // Check if shift was created with Live Mode
  const isLiveShift = shift.isLive === true;

  const cardContent = (
    <Card
      className="h-full min-h-[220px] relative overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300 border-b-4 select-none"
      style={{ borderBottomColor: showDetails ? 'transparent' : avatarColor }}
      onClick={() => setShowDetails(!showDetails)}
    >
      {/* Live Mode indicator - absolute positioned */}
      {isLiveShift && (
        <div className="absolute top-2 right-2 z-[5]">
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
            <CircleDotDashed size={12} className="text-white" />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        {!showDetails ? (
          // --- SUMMARY VIEW - Horizontal layout ---
          <motion.div
            key="summary"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex flex-col p-4"
          >
            {/* Top section - Avatar + Work info */}
            <div className="flex items-start gap-3 mb-4">
              <div
                className="p-2 rounded-lg flex-shrink-0"
                style={{ backgroundColor: `${avatarColor}15` }}
              >
                <WorkAvatar
                  name={jobData.name}
                  color={avatarColor}
                  iconName={iconName}
                  size="md"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 truncate text-sm mb-1">
                  {jobData.name}
                </h3>
                <Badge
                  variant={currentConfig.badgeVariant}
                  size="xs"
                  rounded
                  className="flex items-center gap-1 w-fit"
                >
                  <BadgeIcon size={10} />
                  {currentConfig.badgeLabel}
                </Badge>
              </div>
            </div>

            {/* Middle section - Hours & Earnings horizontal */}
            <div className="flex-grow flex items-center justify-around gap-4 py-3">
              {/* Hours */}
              <div className="text-center">
                <div className="text-4xl font-black mb-1" style={{ color: avatarColor }}>
                  {shiftData?.hours?.toFixed(1) || '0.0'}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">hours</div>
              </div>

              {/* Divider */}
              <div className="h-16 w-px bg-gray-200" />

              {/* Earnings */}
              {earningValue !== undefined && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {formatCurrency(earningValue, currencySymbol)}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">earnings</div>
                </div>
              )}
            </div>

            {/* Bottom indicator */}
            <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col items-center opacity-60 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] text-gray-400 font-medium mb-0.5">View details</span>
              <ChevronDown size={12} className="text-gray-400 animate-bounce" />
            </div>
          </motion.div>
        ) : (
          // --- DETAIL VIEW - Complete breakdown ---
          <motion.div
            key="details"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gray-50 flex flex-col p-3"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200/50 shrink-0">
              <Flex variant="center" className="gap-2">
                <WorkAvatar
                  name={jobData.name}
                  color={avatarColor}
                  iconName={iconName}
                  size="xs"
                />
                <div>
                  <div className="text-xs font-bold text-gray-800">{jobData.name}</div>
                  <Badge variant={currentConfig.badgeVariant} size="xs" rounded className="mt-0.5">
                    <BadgeIcon size={8} className="mr-1" />
                    <span className="text-[9px]">{currentConfig.badgeLabel}</span>
                  </Badge>
                </div>
              </Flex>
              <ChevronDown size={14} className="text-gray-400 rotate-180" />
            </div>

            {/* Content - scrollable */}
            <div className="flex-grow overflow-y-auto space-y-2 pr-1">
              {/* Time & Schedule */}
              <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 space-y-1.5">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Schedule</div>
                <Flex variant="between" className="text-xs">
                  <Flex variant="center" className="text-gray-600">
                    <Clock size={12} className="mr-1.5" style={{ color: avatarColor }} />
                    <span>Time</span>
                  </Flex>
                  <span className="font-semibold">{shift.startTime} - {shift.endTime}</span>
                </Flex>
                <Flex variant="between" className="text-xs">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-bold" style={{ color: avatarColor }}>
                    {shiftData?.hours?.toFixed(1) || '0.0'}h
                  </span>
                </Flex>
                {date && (
                  <Flex variant="between" className="text-xs">
                    <Flex variant="center" className="text-gray-600">
                      <Calendar size={12} className="mr-1.5" />
                      <span>Date</span>
                    </Flex>
                    <span className="font-medium">{formatRelativeDate(date)}</span>
                  </Flex>
                )}
                {/* Shift type & badges */}
                <div className="pt-1.5 border-t border-gray-100">
                  <Flex variant="start" className="gap-2 flex-wrap">
                    <ShiftTypeBadge shift={shift} size="xs" />
                    {children?.desktopBadge}
                  </Flex>
                </div>
              </div>

              {/* Earnings Breakdown */}
              {earningValue !== undefined && (
                <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Earnings</div>
                  <Flex variant="between" className="items-center mb-2">
                    <Flex variant="center">
                      <DollarSign size={14} className="text-green-500 mr-1" />
                      <span className="text-xs text-gray-600">{earningLabel || 'Total'}</span>
                    </Flex>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(earningValue, currencySymbol)}
                    </span>
                  </Flex>

                  {/* Calculation breakdown - if available in shiftData */}
                  {shiftData && (
                    <div className="space-y-1 pt-2 border-t border-gray-100 text-xs">
                      {shiftData.baseAmount !== undefined && (
                        <Flex variant="between">
                          <span className="text-gray-500">Base pay</span>
                          <span className="font-medium">{formatCurrency(shiftData.baseAmount, currencySymbol)}</span>
                        </Flex>
                      )}
                      {shiftData.nightAmount !== undefined && shiftData.nightAmount > 0 && (
                        <Flex variant="between">
                          <span className="text-gray-500">Night bonus</span>
                          <span className="font-medium">{formatCurrency(shiftData.nightAmount, currencySymbol)}</span>
                        </Flex>
                      )}
                      {shiftData.saturdayAmount !== undefined && shiftData.saturdayAmount > 0 && (
                        <Flex variant="between">
                          <span className="text-gray-500">Saturday bonus</span>
                          <span className="font-medium">{formatCurrency(shiftData.saturdayAmount, currencySymbol)}</span>
                        </Flex>
                      )}
                      {shiftData.sundayAmount !== undefined && shiftData.sundayAmount > 0 && (
                        <Flex variant="between">
                          <span className="text-gray-500">Sunday bonus</span>
                          <span className="font-medium">{formatCurrency(shiftData.sundayAmount, currencySymbol)}</span>
                        </Flex>
                      )}
                      {shiftData.holidayAmount !== undefined && shiftData.holidayAmount > 0 && (
                        <Flex variant="between">
                          <span className="text-gray-500">Holiday bonus</span>
                          <span className="font-medium">{formatCurrency(shiftData.holidayAmount, currencySymbol)}</span>
                        </Flex>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Additional Info - Children stats (delivery: km, orders, fuel) */}
              {children?.desktopStats && (
                <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    {type === 'delivery' ? 'Delivery Info' : 'Additional Info'}
                  </div>
                  {children.desktopStats}
                </div>
              )}

              {/* Notes */}
              {shift.notes && (
                <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Notes</div>
                  <p className="text-xs text-gray-700 italic leading-relaxed">{shift.notes}</p>
                </div>
              )}

              {/* Actions */}
              {showActions && (
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(shift);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium text-gray-700"
                  >
                    <Edit size={12} />
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(shift);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-xs font-medium text-red-600"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );

  return (
    <div ref={cardWrapperRef} className="w-full relative">
      {cardContent}
    </div>
  )
};

export default BaseShiftCard;