// src/pages/Shifts.jsx

import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { useTurnManager } from '../hooks/useTurnManager';
import { useDeleteManager } from '../hooks/useDeleteManager';
import { useShiftFilters } from '../hooks/useFilterTurnos';
import { createSafeDate } from '../utils/time';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import PageHeader from '../components/layout/PageHeader'; 
import { List, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import ShiftsEmptyState from '../components/shifts/ShiftsEmptyState';
import ShiftFilters from '../components/filters/ShiftFilters';
import ShiftModal from '../components/modals/shift/ShiftModal';
import DeleteAlert from '../components/alerts/DeleteAlert';
import WeeklyShiftsSection from '../components/shifts/WeeklyShiftsSection';
import { generateShiftDetails } from '../utils/shiftDetailsUtils';
import Flex from '../components/ui/Flex';

import LoadingSpinner from '../components/ui/LoadingSpinner/LoadingSpinner';

const WEEKS_PER_PAGE = 4;

const Shifts = () => {
  const { 
    loading, 
    deleteShift, 
    deleteDeliveryShift, 
    thematicColors, 
    shiftsByDate,
    works,
    deliveryWork
  } = useApp();
  
  const [weeksShown, setWeeksShown] = useState(WEEKS_PER_PAGE);
  const [expanding, setExpanding] = useState(false);

  // Hook for filter management
  const {
    filters,
    updateFilters,
    filteredShifts,
    filterStats,
    hasActiveFilters
  } = useShiftFilters(shiftsByDate);

  // Specialized hooks for modal management
  const { isModalOpen, selectedShift, openNewModal, openEditModal, closeModal } = useTurnManager();
  
  // Delete function
  const handleDeleteShift = async (shift) => {
    try {
      if (shift.type === 'delivery') {
        await deleteDeliveryShift(shift.id);
      } else {
        await deleteShift(shift.id);
      }
    } catch (error) {
      console.error('Error deleting shift:', error);
    }
  };

  const deleteManager = useDeleteManager(handleDeleteShift);

  // Process shift data (use filtered if active filters)
  const shiftsToDisplay = hasActiveFilters ? filteredShifts : shiftsByDate;
  const allJobs = useMemo(() => [...works, ...deliveryWork], [works, deliveryWork]);

  // Function to get Monday of a date
  const getMondayOfWeek = (dateStr) => {
    const date = createSafeDate(dateStr);
    const weekDay = date.getDay();
    const daysUntilMonday = weekDay === 0 ? -6 : -(weekDay - 1);
    const monday = new Date(date);
    monday.setDate(date.getDate() + daysUntilMonday);
    return monday.toISOString().split('T')[0];
  };

  // Function to format week range
  const formatWeekRange = (mondayDate) => {
    const monday = createSafeDate(mondayDate);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const mondayOptions = { day: 'numeric', month: 'short' };
    const sundayOptions = { day: 'numeric', month: 'short', year: 'numeric' };

    const mondayStr = monday.toLocaleDateString('en-US', mondayOptions);
    const sundayStr = sunday.toLocaleDateString('en-US', sundayOptions);

    return `${mondayStr} - ${sundayStr}`;
  };

  // Group shifts by weeks
  const shiftsByWeek = useMemo(() => {
    const weeks = {};
    
    Object.entries(shiftsToDisplay || {}).forEach(([date, shifts]) => {
      const mondayDate = getMondayOfWeek(date);
      
      if (!weeks[mondayDate]) {
        weeks[mondayDate] = {};
      }
      
      weeks[mondayDate][date] = shifts;
    });

    // Sort weeks by date (most recent first)
    const sortedWeeks = Object.keys(weeks)
      .sort((a, b) => new Date(b) - new Date(a))
      .map(mondayDate => ({
        mondayDate,
        weekRange: formatWeekRange(mondayDate),
        shifts: weeks[mondayDate],
        totalShifts: Object.values(weeks[mondayDate]).flat().length
      }));

    return sortedWeeks;
  }, [shiftsToDisplay]);

  const weeksToDisplay = shiftsByWeek.slice(0, weeksShown);
  const hasMoreWeeks = shiftsByWeek.length > weeksShown;
  const hasShifts = shiftsByWeek.length > 0;

  const handleShowMoreWeeks = () => {
    setExpanding(true);
    setTimeout(() => {
      setWeeksShown(prev => Math.min(prev + WEEKS_PER_PAGE, shiftsByWeek.length));
      setExpanding(false);
    }, 300);
  };

  const handleShowLessWeeks = () => {
    setWeeksShown(WEEKS_PER_PAGE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const testDelete = (shift) => {
    deleteManager.startDeletion(shift);
  };

  return (
    <LoadingWrapper loading={loading}>
      {/* Main container with improved spacing */}
      <div className="px-4 py-6 space-y-6">
        <PageHeader
          title="Shifts"
          subtitle="Manage and visualize your registered shifts."
          icon={List}
          action={{ onClick: openNewModal, icon: Plus, label: 'New Shift' }}
        />

        {/* Filter system */}
        {(Object.keys(shiftsByDate || {}).length > 0) && (
          <ShiftFilters
            onFiltersChange={updateFilters}
            activeFilters={filters}
          />
        )}

        {/* Filtering statistics */}
        {hasActiveFilters && (
          <div 
            className="p-3 rounded-lg border-l-4 text-sm"
            style={{ 
              backgroundColor: thematicColors?.transparent5,
              borderLeftColor: thematicColors?.base 
            }}
          >
            <Flex variant="between">
              <span style={{ color: thematicColors?.base }} className="font-medium">
                Showing {filterStats.filteredShiftsCount} of {filterStats.totalShifts} shifts
              </span>
              <span className="text-gray-600">
                {shiftsByWeek.length} weeks with shifts
              </span>
            </Flex>
          </div>
        )}

        {/* Main content */}
        {!hasShifts && !hasActiveFilters ? (
          <ShiftsEmptyState 
            allJobs={allJobs}
            onNewShift={openNewModal}
            thematicColors={thematicColors}
          />
        ) : !hasShifts && hasActiveFilters ? (
          // State when there are filters but no results
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Flex 
              variant="center" 
              className="p-4 rounded-full w-20 h-20 mx-auto mb-4"
              style={{ backgroundColor: thematicColors?.transparent10 }}
            >
              <span className="text-2xl">🔍</span>
            </Flex>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No shifts matching filters
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Try adjusting the filters to see more results.
            </p>
            <button
              onClick={() => updateFilters({ work: 'all', weekDays: [], shiftType: 'all' })}
              className="text-white px-6 py-3 rounded-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: thematicColors?.base }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* List of shifts organized by weeks */}
            <div className="space-y-8">
              {weeksToDisplay.map(({ mondayDate, weekRange, shifts, totalShifts }) => (
                <WeeklyShiftsSection
                  key={mondayDate}
                  weekRange={weekRange}
                  shifts={shifts}
                  totalShifts={totalShifts}
                  allJobs={allJobs}
                  onEditShift={openEditModal}
                  onDeleteShift={testDelete}
                  thematicColors={thematicColors}
                />
              ))}
            </div>

            {/* Navigation (show more/less weeks) */}
            {hasMoreWeeks && (
              <div className="relative flex flex-col items-center pt-8 pb-12">
                <div
                  className="absolute top-0 left-0 right-0 h-16 rounded-lg opacity-30"
                  style={{ backgroundColor: thematicColors?.transparent5 }}
                />
                <button
                  onClick={handleShowMoreWeeks}
                  disabled={expanding}
                  className="relative z-10 flex items-center space-x-2 px-6 py-3 rounded-full font-medium text-white transition-all hover:shadow-lg disabled:opacity-50"
                  style={{ 
                    backgroundColor: thematicColors?.base
                  }}
                >
                  {expanding ? (
                    <>
                      <LoadingSpinner 
                        size="h-5 w-5"
                        style={{ borderColor: 'white' }}
                        color="border-transparent"
                      />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown size={20} />
                      <span>Show more weeks</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {!hasMoreWeeks && weeksShown > WEEKS_PER_PAGE && (
              <div className="flex justify-center py-4">
                <button
                  onClick={handleShowLessWeeks}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChevronUp size={18} />
                  <span>Show less</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <ShiftModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        shift={selectedShift} 
      />

      <DeleteAlert
        visible={deleteManager.showDeleteModal}
        onCancel={() => {
          deleteManager.cancelDeletion();
        }}
        onConfirm={() => {
          deleteManager.confirmDeletion();
        }}
        deleting={deleteManager.deleting}
        type="shift"
        details={generateShiftDetails(deleteManager.itemToDelete, allJobs)}
      />
    </LoadingWrapper>
  );
};

export default Shifts;