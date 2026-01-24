// src/components/modals/base/WorkTypeSelector/index.jsx
// Modal component for selecting work type

import React from 'react';
import ***REMOVED*** Briefcase, Truck, Clock, DollarSign, Package, Navigation ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../../hooks/useThemeColors';
import Flex from '../../../ui/Flex';

const WorkTypeSelector = (***REMOVED*** onSelectType, isMobile ***REMOVED***) => ***REMOVED***
  // Use colors from context if not passed as prop
  const colors = useThemeColors();

  const handleSelect = (type) => ***REMOVED***
    onSelectType(type);
  ***REMOVED***;

  return (
    <div className=***REMOVED***`space-y-6 $***REMOVED***isMobile ? 'mobile-form' : ''***REMOVED***`***REMOVED***>
      <div className="text-center mb-6">
        <h3 
          className=***REMOVED***`font-semibold mb-3 $***REMOVED***isMobile ? 'text-xl' : 'text-lg'***REMOVED***`***REMOVED***
          style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
        >
          What type of work do you want to add?
        </h3>
        <p className=***REMOVED***`text-gray-600 $***REMOVED***isMobile ? 'text-base' : 'text-sm'***REMOVED***`***REMOVED***>
          Select the type that best describes your work
        </p>
      </div>
      
      <div className=***REMOVED***`grid grid-cols-1 $***REMOVED***isMobile ? 'gap-6' : 'gap-4'***REMOVED***`***REMOVED***>
        ***REMOVED***/* Traditional Work */***REMOVED***
        <button
          type="button"
          onClick=***REMOVED***() => handleSelect('traditional')***REMOVED***
          className=***REMOVED***`
            border-2 rounded-xl hover:shadow-lg transition-all duration-300 group text-left
            transform hover:scale-105 active:scale-95
            $***REMOVED***isMobile ? 'p-6 min-h-[140px]' : 'p-6'***REMOVED***
          `***REMOVED***
          style=***REMOVED******REMOVED*** 
            borderColor: '#e5e7eb',
            backgroundColor: 'white'
          ***REMOVED******REMOVED***
          onMouseEnter=***REMOVED***(e) => ***REMOVED***
            e.currentTarget.style.borderColor = colors.primary;
            e.currentTarget.style.backgroundColor = colors.transparent5;
            e.currentTarget.style.boxShadow = `0 8px 25px $***REMOVED***colors.transparent30***REMOVED***`;
          ***REMOVED******REMOVED***
          onMouseLeave=***REMOVED***(e) => ***REMOVED***
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.boxShadow = 'none';
          ***REMOVED******REMOVED***
        >
          <div className=***REMOVED***`flex items-start $***REMOVED***isMobile ? 'space-x-4' : 'space-x-4'***REMOVED***`***REMOVED***>
            <div className="flex-shrink-0">
              <Flex variant="center" 
                className=***REMOVED***`
                  rounded-lg transition-all duration-300
                  $***REMOVED***isMobile ? 'w-12 h-12' : 'w-10 h-10'***REMOVED***
                `***REMOVED***
                style=***REMOVED******REMOVED*** backgroundColor: colors.transparent10 ***REMOVED******REMOVED***
              >
                <Briefcase 
                  className=***REMOVED***`text-blue-500 group-hover:scale-110 transition-transform $***REMOVED***isMobile ? 'w-7 h-7' : 'w-6 h-6'***REMOVED***`***REMOVED*** 
                />
              </Flex>
            </div>
            <div className="flex-1">
              <h4 className=***REMOVED***`font-semibold mb-2 $***REMOVED***isMobile ? 'text-lg' : 'text-lg'***REMOVED***`***REMOVED***>
                Hourly Work
              </h4>
              <p className=***REMOVED***`text-gray-600 mb-3 $***REMOVED***isMobile ? 'text-base leading-relaxed' : 'text-sm'***REMOVED***`***REMOVED***>
                For jobs with a fixed hourly rate and different shift types
              </p>
              <ul className=***REMOVED***`space-y-2 $***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED*** text-gray-500`***REMOVED***>
                <li className="flex items-center">
                  <Clock size=***REMOVED***isMobile ? 14 : 12***REMOVED*** className="mr-2 text-blue-500 flex-shrink-0" />
                  <span>Rates by shift type (day, afternoon, night)</span>
                </li>
                <li className="flex items-center">
                  <DollarSign size=***REMOVED***isMobile ? 14 : 12***REMOVED*** className="mr-2 text-green-500 flex-shrink-0" />
                  <span>Special weekend rates</span>
                </li>
                <li className="flex items-center">
                  <Briefcase size=***REMOVED***isMobile ? 14 : 12***REMOVED*** className="mr-2 text-purple-500 flex-shrink-0" />
                  <span>Automatic calculation with discounts</span>
                </li>
              </ul>
            </div>
          </div>
        </button>

        ***REMOVED***/* Delivery Work */***REMOVED***
        <button
          type="button"
          onClick=***REMOVED***() => handleSelect('delivery')***REMOVED***
          className=***REMOVED***`
            border-2 rounded-xl hover:shadow-lg transition-all duration-300 group text-left
            transform hover:scale-105 active:scale-95
            $***REMOVED***isMobile ? 'p-6 min-h-[140px]' : 'p-6'***REMOVED***
          `***REMOVED***
          style=***REMOVED******REMOVED*** 
            borderColor: '#e5e7eb',
            backgroundColor: 'white'
          ***REMOVED******REMOVED***
          onMouseEnter=***REMOVED***(e) => ***REMOVED***
            e.currentTarget.style.borderColor = colors.primary;
            e.currentTarget.style.backgroundColor = colors.transparent5;
            e.currentTarget.style.boxShadow = `0 8px 25px $***REMOVED***colors.transparent30***REMOVED***`;
          ***REMOVED******REMOVED***
          onMouseLeave=***REMOVED***(e) => ***REMOVED***
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.boxShadow = 'none';
          ***REMOVED******REMOVED***
        >
          <div className=***REMOVED***`flex items-start $***REMOVED***isMobile ? 'space-x-4' : 'space-x-4'***REMOVED***`***REMOVED***>
            <div className="flex-shrink-0">
              <Flex variant="center"
                className=***REMOVED***`
                  rounded-lg transition-all duration-300
                  $***REMOVED***isMobile ? 'w-12 h-12' : 'w-10 h-10'***REMOVED***
                `***REMOVED***
                style=***REMOVED******REMOVED*** backgroundColor: '#dcfce7' ***REMOVED******REMOVED***
              >
                <Truck 
                  className=***REMOVED***`text-green-600 group-hover:scale-110 transition-transform $***REMOVED***isMobile ? 'w-7 h-7' : 'w-6 h-6'***REMOVED***`***REMOVED*** 
                />
              </Flex>
            </div>
            <div className="flex-1">
              <h4 className=***REMOVED***`font-semibold mb-2 $***REMOVED***isMobile ? 'text-lg' : 'text-lg'***REMOVED***`***REMOVED***>
                Delivery Work
              </h4>
              <p className=***REMOVED***`text-gray-600 mb-3 $***REMOVED***isMobile ? 'text-base leading-relaxed' : 'text-sm'***REMOVED***`***REMOVED***>
                For delivery jobs with variable earnings per shift
              </p>
              <ul className=***REMOVED***`space-y-2 $***REMOVED***isMobile ? 'text-sm' : 'text-xs'***REMOVED*** text-gray-500`***REMOVED***>
                <li className="flex items-center">
                  <DollarSign size=***REMOVED***isMobile ? 14 : 12***REMOVED*** className="mr-2 text-green-500 flex-shrink-0" />
                  <span>Record of total earnings per shift</span>
                </li>
                <li className="flex items-center">
                  <Package size=***REMOVED***isMobile ? 14 : 12***REMOVED*** className="mr-2 text-blue-500 flex-shrink-0" />
                  <span>Tracking of orders and kilometers</span>
                </li>
                <li className="flex items-center">
                  <Navigation size=***REMOVED***isMobile ? 14 : 12***REMOVED*** className="mr-2 text-orange-500 flex-shrink-0" />
                  <span>Control of tips and fuel expenses</span>
                </li>
              </ul>
            </div>
          </div>
        </button>
      </div>

      ***REMOVED***/* Help button on mobile */***REMOVED***
      ***REMOVED***isMobile && (
        <div className="text-center pt-4">
          <button
            type="button"
            className="text-sm text-gray-500 underline"
            onClick=***REMOVED***() => ***REMOVED***
              alert('If you have doubts about which type to choose, you can change this later in the job settings.');
            ***REMOVED******REMOVED***
          >
            Not sure which to choose?
          </button>
        </div>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default WorkTypeSelector;