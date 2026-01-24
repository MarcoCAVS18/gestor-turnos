// src/components/modals/base/WorkTypeSelector/index.jsx
// Modal component for selecting work type

import React from 'react';
import { Briefcase, Truck, Clock, DollarSign, Package, Navigation } from 'lucide-react';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import Flex from '../../../ui/Flex';

const WorkTypeSelector = ({ onSelectType, isMobile }) => {
  // Use colors from context if not passed as prop
  const colors = useThemeColors();

  const handleSelect = (type) => {
    onSelectType(type);
  };

  return (
    <div className={`space-y-6 ${isMobile ? 'mobile-form' : ''}`}>
      <div className="text-center mb-6">
        <h3 
          className={`font-semibold mb-3 ${isMobile ? 'text-xl' : 'text-lg'}`}
          style={{ color: colors.primary }}
        >
          What type of work do you want to add?
        </h3>
        <p className={`text-gray-600 ${isMobile ? 'text-base' : 'text-sm'}`}>
          Select the type that best describes your work
        </p>
      </div>
      
      <div className={`grid grid-cols-1 ${isMobile ? 'gap-6' : 'gap-4'}`}>
        {/* Traditional Work */}
        <button
          type="button"
          onClick={() => handleSelect('traditional')}
          className={`
            border-2 rounded-xl hover:shadow-lg transition-all duration-300 group text-left
            transform hover:scale-105 active:scale-95
            ${isMobile ? 'p-6 min-h-[140px]' : 'p-6'}
          `}
          style={{ 
            borderColor: '#e5e7eb',
            backgroundColor: 'white'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = colors.primary;
            e.currentTarget.style.backgroundColor = colors.transparent5;
            e.currentTarget.style.boxShadow = `0 8px 25px ${colors.transparent30}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div className={`flex items-start ${isMobile ? 'space-x-4' : 'space-x-4'}`}>
            <div className="flex-shrink-0">
              <Flex variant="center" 
                className={`
                  rounded-lg transition-all duration-300
                  ${isMobile ? 'w-12 h-12' : 'w-10 h-10'}
                `}
                style={{ backgroundColor: colors.transparent10 }}
              >
                <Briefcase 
                  className={`text-blue-500 group-hover:scale-110 transition-transform ${isMobile ? 'w-7 h-7' : 'w-6 h-6'}`} 
                />
              </Flex>
            </div>
            <div className="flex-1">
              <h4 className={`font-semibold mb-2 ${isMobile ? 'text-lg' : 'text-lg'}`}>
                Hourly Work
              </h4>
              <p className={`text-gray-600 mb-3 ${isMobile ? 'text-base leading-relaxed' : 'text-sm'}`}>
                For jobs with a fixed hourly rate and different shift types
              </p>
              <ul className={`space-y-2 ${isMobile ? 'text-sm' : 'text-xs'} text-gray-500`}>
                <li className="flex items-center">
                  <Clock size={isMobile ? 14 : 12} className="mr-2 text-blue-500 flex-shrink-0" />
                  <span>Rates by shift type (day, afternoon, night)</span>
                </li>
                <li className="flex items-center">
                  <DollarSign size={isMobile ? 14 : 12} className="mr-2 text-green-500 flex-shrink-0" />
                  <span>Special weekend rates</span>
                </li>
                <li className="flex items-center">
                  <Briefcase size={isMobile ? 14 : 12} className="mr-2 text-purple-500 flex-shrink-0" />
                  <span>Automatic calculation with discounts</span>
                </li>
              </ul>
            </div>
          </div>
        </button>

        {/* Delivery Work */}
        <button
          type="button"
          onClick={() => handleSelect('delivery')}
          className={`
            border-2 rounded-xl hover:shadow-lg transition-all duration-300 group text-left
            transform hover:scale-105 active:scale-95
            ${isMobile ? 'p-6 min-h-[140px]' : 'p-6'}
          `}
          style={{ 
            borderColor: '#e5e7eb',
            backgroundColor: 'white'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = colors.primary;
            e.currentTarget.style.backgroundColor = colors.transparent5;
            e.currentTarget.style.boxShadow = `0 8px 25px ${colors.transparent30}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div className={`flex items-start ${isMobile ? 'space-x-4' : 'space-x-4'}`}>
            <div className="flex-shrink-0">
              <Flex variant="center"
                className={`
                  rounded-lg transition-all duration-300
                  ${isMobile ? 'w-12 h-12' : 'w-10 h-10'}
                `}
                style={{ backgroundColor: '#dcfce7' }}
              >
                <Truck 
                  className={`text-green-600 group-hover:scale-110 transition-transform ${isMobile ? 'w-7 h-7' : 'w-6 h-6'}`} 
                />
              </Flex>
            </div>
            <div className="flex-1">
              <h4 className={`font-semibold mb-2 ${isMobile ? 'text-lg' : 'text-lg'}`}>
                Delivery Work
              </h4>
              <p className={`text-gray-600 mb-3 ${isMobile ? 'text-base leading-relaxed' : 'text-sm'}`}>
                For delivery jobs with variable earnings per shift
              </p>
              <ul className={`space-y-2 ${isMobile ? 'text-sm' : 'text-xs'} text-gray-500`}>
                <li className="flex items-center">
                  <DollarSign size={isMobile ? 14 : 12} className="mr-2 text-green-500 flex-shrink-0" />
                  <span>Record of total earnings per shift</span>
                </li>
                <li className="flex items-center">
                  <Package size={isMobile ? 14 : 12} className="mr-2 text-blue-500 flex-shrink-0" />
                  <span>Tracking of orders and kilometers</span>
                </li>
                <li className="flex items-center">
                  <Navigation size={isMobile ? 14 : 12} className="mr-2 text-orange-500 flex-shrink-0" />
                  <span>Control of tips and fuel expenses</span>
                </li>
              </ul>
            </div>
          </div>
        </button>
      </div>

      {/* Help button on mobile */}
      {isMobile && (
        <div className="text-center pt-4">
          <button
            type="button"
            className="text-sm text-gray-500 underline"
            onClick={() => {
              alert('If you have doubts about which type to choose, you can change this later in the job settings.');
            }}
          >
            Not sure which to choose?
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkTypeSelector;