// src/components/cards/shift/ShiftCard/index.jsx 

import React from 'react';
import { Coffee, PartyPopper, Calculator } from 'lucide-react';
import BaseShiftCard from '../../base/BaseShiftCard';
import Badge from '../../../ui/Badge';
import { useApp } from '../../../../contexts/AppContext';
import { formatCurrency } from '../../../../utils/currency';
import Flex from '../../../ui/Flex';
import { useThemeColors } from '../../../../hooks/useThemeColors';

const ShiftCard = (props) => {
  const { shift, work } = props;
  const { calculatePayment, smokoEnabled, currencySymbol, defaultDiscount } = useApp();
  const colors = useThemeColors();

  // Calculate shift information
  const shiftData = React.useMemo(() => {
    if (!shift || !work) {
      return { hours: 0, totalWithDiscount: 0 };
    }

    const result = calculatePayment(shift);
    return { ...result, defaultDiscount };
  }, [shift, work, calculatePayment, defaultDiscount]);

  // Calculate detailed breakdown for display
  const calculationBreakdown = React.useMemo(() => {
    if (!shiftData || !work) return null;

    // Use the actual breakdown from shiftData (already calculated correctly by calculatePayment)
    const breakdown = shiftData.breakdown || {};
    const hoursBreakdown = shiftData.hoursBreakdown || {};
    const appliedRates = shiftData.appliedRates || {};

    // Calculate base amount from breakdown (sum of all rate types)
    const baseCalc = shiftData.total || 0;
    const discountAmount = baseCalc * (defaultDiscount / 100);

    // Build display items for each rate type that was applied
    const rateItems = [];

    // Order: day, afternoon, night, saturday, sunday, holiday
    const rateOrder = ['day', 'afternoon', 'night', 'saturday', 'sunday', 'holiday'];

    rateOrder.forEach(rateType => {
      if (breakdown[rateType] > 0 && appliedRates[rateType] > 0) {
        const hours = hoursBreakdown[rateType] || 0;
        rateItems.push({
          type: rateType,
          label: rateType.charAt(0).toUpperCase() + rateType.slice(1),
          hours: hours,
          rate: appliedRates[rateType],
          amount: breakdown[rateType]
        });
      }
    });

    return {
      baseCalc,
      discountAmount,
      discountPercent: defaultDiscount,
      rateItems,
      final: shiftData.totalWithDiscount
    };
  }, [shiftData, work, defaultDiscount]);

  return (
    <BaseShiftCard
      {...props}
      job={work} 
      type="traditional"
      shiftData={shiftData}
      earningValue={shiftData.totalWithDiscount}
      earningLabel={'Estimated Earnings'}
      currencySymbol={currencySymbol}
    >
      {{
        // Holiday and Smoko Badges
        mobileBadge: (
          <>
            {shiftData.isHoliday && (
              <Badge variant="danger" size="xs" icon={PartyPopper}>
                Holiday
              </Badge>
            )}
            {smokoEnabled && shiftData.smokoApplied && (
              <Badge variant="warning" size="xs" icon={Coffee}>
                -{shiftData.smokoMinutes}min
              </Badge>
            )}
          </>
        ),

        desktopBadge: (
          <>
            {shiftData.isHoliday && (
              <Badge variant="danger" size="xs" icon={PartyPopper} rounded>
                Holiday
              </Badge>
            )}
            {smokoEnabled && shiftData.smokoApplied && (
              <Badge variant="warning" size="xs" icon={Coffee} rounded>
                -{shiftData.smokoMinutes}min
              </Badge>
            )}
          </>
        ),

        mobileStats: work.baseRate > 0 && calculationBreakdown && (
          <div className="pt-2 border-t mt-2" style={{ borderColor: colors.border }}>
            <div className="flex items-center gap-1 mb-2">
              <Calculator size={12} style={{ color: colors.primary }} />
              <span className="text-xs font-semibold" style={{ color: colors.text }}>
                Calculation
              </span>
            </div>
            <div className="space-y-1 text-xs">
              {/* Rate items breakdown */}
              {calculationBreakdown.rateItems && calculationBreakdown.rateItems.map((item) => (
                <Flex key={item.type} variant="between">
                  <span style={{ color: colors.textSecondary }}>
                    {item.hours.toFixed(1)}h × {formatCurrency(item.rate, currencySymbol)}/hr ({item.label})
                  </span>
                  <span className="font-medium" style={{ color: colors.text }}>
                    {formatCurrency(item.amount, currencySymbol)}
                  </span>
                </Flex>
              ))}

              {/* Subtotal if multiple rates */}
              {calculationBreakdown.rateItems && calculationBreakdown.rateItems.length > 1 && (
                <Flex variant="between" className="pt-1 border-t" style={{ borderColor: colors.border }}>
                  <span className="font-medium" style={{ color: colors.text }}>
                    Subtotal
                  </span>
                  <span className="font-medium" style={{ color: colors.text }}>
                    {formatCurrency(calculationBreakdown.baseCalc, currencySymbol)}
                  </span>
                </Flex>
              )}

              {/* Discount */}
              {calculationBreakdown.discountPercent > 0 && (
                <Flex variant="between">
                  <span style={{ color: colors.textSecondary }}>
                    Discount ({calculationBreakdown.discountPercent}%)
                  </span>
                  <span className="font-medium" style={{ color: colors.error }}>
                    -{formatCurrency(calculationBreakdown.discountAmount, currencySymbol)}
                  </span>
                </Flex>
              )}

              {/* Total */}
              <Flex variant="between" className="pt-1 border-t" style={{ borderColor: colors.border }}>
                <span className="font-semibold" style={{ color: colors.text }}>
                  Total
                </span>
                <span className="font-bold text-green-600">
                  {formatCurrency(calculationBreakdown.final, currencySymbol)}
                </span>
              </Flex>
            </div>
          </div>
        ),

        desktopStats: work.baseRate > 0 && calculationBreakdown && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 mb-2">
              <Calculator size={12} style={{ color: colors.primary }} />
              <span className="text-xs font-semibold" style={{ color: colors.text }}>
                Calculation
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              {/* Rate items breakdown */}
              {calculationBreakdown.rateItems && calculationBreakdown.rateItems.map((item) => (
                <Flex key={item.type} variant="between">
                  <span style={{ color: colors.textSecondary }}>
                    {item.hours.toFixed(1)}h × {formatCurrency(item.rate, currencySymbol)}/hr ({item.label})
                  </span>
                  <span className="font-medium" style={{ color: colors.text }}>
                    {formatCurrency(item.amount, currencySymbol)}
                  </span>
                </Flex>
              ))}

              {/* Subtotal if multiple rates */}
              {calculationBreakdown.rateItems && calculationBreakdown.rateItems.length > 1 && (
                <Flex variant="between" className="pt-1 border-t" style={{ borderColor: colors.border }}>
                  <span className="font-medium" style={{ color: colors.text }}>
                    Subtotal
                  </span>
                  <span className="font-medium" style={{ color: colors.text }}>
                    {formatCurrency(calculationBreakdown.baseCalc, currencySymbol)}
                  </span>
                </Flex>
              )}

              {/* Discount */}
              {calculationBreakdown.discountPercent > 0 && (
                <Flex variant="between">
                  <span style={{ color: colors.textSecondary }}>
                    Discount ({calculationBreakdown.discountPercent}%)
                  </span>
                  <span className="font-medium" style={{ color: colors.error }}>
                    -{formatCurrency(calculationBreakdown.discountAmount, currencySymbol)}
                  </span>
                </Flex>
              )}

              {/* Total */}
              <Flex variant="between" className="pt-1.5 border-t" style={{ borderColor: colors.border }}>
                <span className="font-semibold" style={{ color: colors.text }}>
                  Total
                </span>
                <span className="font-bold text-green-600">
                  {formatCurrency(calculationBreakdown.final, currencySymbol)}
                </span>
              </Flex>
            </div>
          </div>
        ),
      }}
    </BaseShiftCard>
  );
};

export default ShiftCard;