// src/components/shifts/ShiftsEmptyState/index.jsx

import React from 'react';
import ***REMOVED*** Calendar, Plus, Briefcase, ArrowRight ***REMOVED*** from 'lucide-react';
import Flex from '../../ui/Flex';

function ShiftsEmptyState(***REMOVED*** allJobs, onNewShift, thematicColors ***REMOVED***) ***REMOVED***
  const handleGoToJobs = () => ***REMOVED*** 
    window.location.href = '/trabajos'; 
  ***REMOVED***;

  if (allJobs.length === 0) ***REMOVED***
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <Flex variant="center"
          className="p-4 rounded-full w-20 h-20 mx-auto mb-4" 
          style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.transparent10 || 'rgba(255, 152, 0, 0.1)' ***REMOVED******REMOVED***
        >
          <Briefcase 
            className="w-10 h-10" 
            style=***REMOVED******REMOVED*** color: thematicColors?.base || '#FF9800' ***REMOVED******REMOVED*** 
          />
        </Flex>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          First you need to create a job
        </h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          To register shifts, first you must create at least one job.
        </p>
        <button 
          onClick=***REMOVED***handleGoToJobs***REMOVED*** 
          className="text-white bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2"
        >
          <Briefcase className="w-4 h-4" />
          <span>Create Job</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  ***REMOVED***

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <Flex variant="center"
        className="p-4 rounded-full w-20 h-20 mx-auto mb-4" 
        style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.transparent10 ***REMOVED******REMOVED***
      >
        <Calendar 
          className="w-10 h-10" 
          style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED*** 
        />
      </Flex>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No shifts registered
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Start adding your first shift to start managing your income.
      </p>
      <button 
        onClick=***REMOVED***onNewShift***REMOVED*** 
        className="text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2" 
        style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.base, filter: 'brightness(1.1)' ***REMOVED******REMOVED*** 
        onMouseEnter=***REMOVED***(e) => ***REMOVED*** e.target.style.filter = 'brightness(1.0)'; ***REMOVED******REMOVED*** 
        onMouseLeave=***REMOVED***(e) => ***REMOVED*** e.target.style.filter = 'brightness(1.1)'; ***REMOVED******REMOVED***
      >
        <Plus className="w-4 h-4" />
        <span>Add First Shift</span>
      </button>
    </div>
  );
***REMOVED***

export default ShiftsEmptyState;