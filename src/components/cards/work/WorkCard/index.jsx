// src/components/cards/WorkCard/index.jsx

import React from 'react';
import BaseWorkCard from '../../base/BaseWorkCard';
import { formatCurrency } from '../../../../utils/currency';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import Flex from '../../../ui/Flex';
import Card from '../../../ui/Card';

const WorkCard = (props) => {
  const { work } = props;
  const colors = useThemeColors();

  // Rate information
  const baseRate = work?.baseRate || work?.salary || 0;
  const hasRates = work?.rates && Object.keys(work.rates).length > 0;
  const workColor = work?.color || work?.avatarColor || colors.primary;

  return (
    <BaseWorkCard {...props} type="traditional">
      <div className="space-y-2">
        {/* Base rate - prominent */}
        <Flex variant="between" className="text-sm">
          <span className="text-gray-600">Base rate:</span>
          <span className="font-semibold" style={{ color: workColor }}>
            {formatCurrency(baseRate)}/h
          </span>
        </Flex>

        {/* Additional rates grid */}
        {hasRates && (
          <Card variant="surface" padding="sm" className="mt-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              {work.rates.night && work.rates.night !== baseRate && (
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400">Night</p>
                  <p className="font-medium dark:text-white">{formatCurrency(work.rates.night)}/h</p>
                </div>
              )}
              {work.rates.saturday && work.rates.saturday !== baseRate && (
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400">Saturday</p>
                  <p className="font-medium dark:text-white">{formatCurrency(work.rates.saturday)}/h</p>
                </div>
              )}
              {work.rates.sunday && work.rates.sunday !== baseRate && (
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400">Sunday</p>
                  <p className="font-medium dark:text-white">{formatCurrency(work.rates.sunday)}/h</p>
                </div>
              )}
              {work.rates.holidays && work.rates.holidays !== baseRate && (
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400">Holiday</p>
                  <p className="font-medium dark:text-white">{formatCurrency(work.rates.holidays)}/h</p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </BaseWorkCard>
  );
};

export default WorkCard;