// src/components/cards/work/WorkCard/index.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseWorkCard from '../../base/BaseWorkCard';
import { formatCurrency } from '../../../../utils/currency';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import Flex from '../../../ui/Flex';
import Card from '../../../ui/Card';

const WorkCard = (props) => {
  const { work } = props;
  const { t } = useTranslation();
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
          <span className="text-gray-600">{t('cards.work.baseRate')}</span>
          <span className="font-semibold" style={{ color: workColor }}>
            {formatCurrency(baseRate)}{t('cards.work.perHour')}
          </span>
        </Flex>

        {/* Additional rates grid */}
        {hasRates && (
          <Card variant="surface" padding="sm" className="mt-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              {work.rates.night && (
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400">{t('cards.work.night')}</p>
                  <p className="font-medium dark:text-white">{formatCurrency(work.rates.night)}/h</p>
                </div>
              )}
              {work.rates.saturday && (
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400">{t('cards.work.saturday')}</p>
                  <p className="font-medium dark:text-white">{formatCurrency(work.rates.saturday)}/h</p>
                </div>
              )}
              {work.rates.sunday && (
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400">{t('cards.work.sunday')}</p>
                  <p className="font-medium dark:text-white">{formatCurrency(work.rates.sunday)}/h</p>
                </div>
              )}
              {work.rates.holidays && (
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400">{t('cards.work.holiday')}</p>
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
