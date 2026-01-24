// src/components/cards/WorkCard/index.jsx

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import BaseWorkCard from '../../base/BaseWorkCard';
import { formatCurrency } from '../../../../utils/currency';
import Flex from '../../../ui/Flex';

const WorkCard = (props) => {
  // Using 'work' as per the project standard
  const { work } = props;

  // Rate information
  const baseRate = work?.baseRate || work?.salary || 0;
  const nightRate = work?.rates?.night || work?.baseRate || work?.salary || 0;
  const hasNightRate = nightRate !== baseRate && nightRate > 0;

  return (
    <BaseWorkCard {...props} type="traditional">
      {/* Rate information */}
      <div className="space-y-2">
        {/* Base rate */}
        <Flex variant="between">
          <Flex variant="center">
            <Sun size={14} className="text-yellow-500 mr-2" />
            <span className="text-sm text-gray-600">Base rate:</span>
          </Flex>
          <span className="text-sm font-medium">{formatCurrency(baseRate)}/hour</span>
        </Flex>

        {/* Night rate if different */}
        {hasNightRate && (
          <Flex variant="between">
            <Flex variant="center">
              <Moon size={14} className="text-indigo-500 mr-2" />
              <span className="text-sm text-gray-600">Night rate:</span>
            </Flex>
            <span className="text-sm font-medium">{formatCurrency(nightRate)}/hour</span>
          </Flex>
        )}

        {/* Additional rate information if it exists */}
        {work?.rates && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-2 text-xs">
              {work.rates.saturday && work.rates.saturday !== baseRate && (
                <Flex variant="between">
                  <span className="text-gray-500">Saturday:</span>
                  <span className="font-medium">{formatCurrency(work.rates.saturday)}/h</span>
                </Flex>
              )}
              {work.rates.sunday && work.rates.sunday !== baseRate && (
                <Flex variant="between">
                  <span className="text-gray-500">Sunday:</span>
                  <span className="font-medium">{formatCurrency(work.rates.sunday)}/h</span>
                </Flex>
              )}
              {work.rates.holidays && work.rates.holidays !== baseRate && (
                <Flex variant="between">
                  <span className="text-gray-500">Holidays:</span>
                  <span className="font-medium">{formatCurrency(work.rates.holidays)}/h</span>
                </Flex>
              )}
            </div>
          </div>
        )}
      </div>
    </BaseWorkCard>
  );
};

export default WorkCard;