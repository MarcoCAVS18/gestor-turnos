// src/components/cards/WorkCard/index.jsx - Refactored using BaseWorkCard

import React from 'react';
import ***REMOVED*** Sun, Moon ***REMOVED*** from 'lucide-react';
import BaseWorkCard from '../../base/BaseWorkCard';
import ***REMOVED*** formatCurrency ***REMOVED*** from '../../../../utils/currency';
import Flex from '../../../ui/Flex';

const WorkCard = (props) => ***REMOVED***
  const ***REMOVED*** work ***REMOVED*** = props;

  // Rate information
  const baseRate = work?.baseRate || work?.salary || 0;
  const nightRate = work?.rates?.night || work?.baseRate || work?.salary || 0;
  const hasNightRate = nightRate !== baseRate && nightRate > 0;

  return (
    <BaseWorkCard ***REMOVED***...props***REMOVED*** type="traditional">
      ***REMOVED***/* Rate information */***REMOVED***
      <div className="space-y-2">
        ***REMOVED***/* Base rate */***REMOVED***
        <Flex variant="between">
          <Flex variant="center">
            <Sun size=***REMOVED***14***REMOVED*** className="text-yellow-500 mr-2" />
            <span className="text-sm text-gray-600">Base rate:</span>
          </Flex>
          <span className="text-sm font-medium">***REMOVED***formatCurrency(baseRate)***REMOVED***/hour</span>
        </Flex>

        ***REMOVED***/* Night rate if different */***REMOVED***
        ***REMOVED***hasNightRate && (
          <Flex variant="between">
            <Flex variant="center">
              <Moon size=***REMOVED***14***REMOVED*** className="text-indigo-500 mr-2" />
              <span className="text-sm text-gray-600">Night rate:</span>
            </Flex>
            <span className="text-sm font-medium">***REMOVED***formatCurrency(nightRate)***REMOVED***/hour</span>
          </Flex>
        )***REMOVED***

        ***REMOVED***/* Additional rate information if it exists */***REMOVED***
        ***REMOVED***work?.rates && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-2 text-xs">
              ***REMOVED***work.rates.saturday && work.rates.saturday !== baseRate && (
                <Flex variant="between">
                  <span className="text-gray-500">Saturday:</span>
                  <span className="font-medium">***REMOVED***formatCurrency(work.rates.saturday)***REMOVED***/h</span>
                </Flex>
              )***REMOVED***
              ***REMOVED***work.rates.sunday && work.rates.sunday !== baseRate && (
                <Flex variant="between">
                  <span className="text-gray-500">Sunday:</span>
                  <span className="font-medium">***REMOVED***formatCurrency(work.rates.sunday)***REMOVED***/h</span>
                </Flex>
              )***REMOVED***
              ***REMOVED***work.rates.holidays && work.rates.holidays !== baseRate && (
                <Flex variant="between">
                  <span className="text-gray-500">Holidays:</span>
                  <span className="font-medium">***REMOVED***formatCurrency(work.rates.holidays)***REMOVED***/h</span>
                </Flex>
              )***REMOVED***
            </div>
          </div>
        )***REMOVED***
      </div>
    </BaseWorkCard>
  );
***REMOVED***;

export default WorkCard;
