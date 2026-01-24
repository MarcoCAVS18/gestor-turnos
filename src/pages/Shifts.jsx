// src/pages/Shifts.jsx

import React, ***REMOVED*** useState, useMemo ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** useTurnManager ***REMOVED*** from '../hooks/useTurnManager';
import ***REMOVED*** useDeleteManager ***REMOVED*** from '../hooks/useDeleteManager';
import ***REMOVED*** useShiftFilters ***REMOVED*** from '../hooks/useFilterTurnos';
import ***REMOVED*** createSafeDate ***REMOVED*** from '../utils/time';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import PageHeader from '../components/layout/PageHeader'; 
import ***REMOVED*** List, Plus, ChevronDown, ChevronUp ***REMOVED*** from 'lucide-react';
import ShiftsEmptyState from '../components/shifts/ShiftsEmptyState';
import ShiftFilters from '../components/filters/ShiftFilters';
import ShiftModal from '../components/modals/shift/ShiftModal';
import DeleteAlert from '../components/alerts/AlertaEliminacion';
import WeeklyShiftsSection from '../components/shifts/WeeklyShiftsSection';
import ***REMOVED*** generateShiftDetails ***REMOVED*** from '../utils/shiftDetailsUtils';
import Flex from '../components/ui/Flex';

import LoadingSpinner from '../components/ui/LoadingSpinner/LoadingSpinner';

const WEEKS_PER_PAGE = 4;

const Shifts = () => ***REMOVED***
  const ***REMOVED*** 
    loading, 
    deleteShift, 
    deleteDeliveryShift, 
    thematicColors, 
    shiftsByDate,
    works,
    deliveryWorks 
  ***REMOVED*** = useApp();
  
  const [weeksShown, setWeeksShown] = useState(WEEKS_PER_PAGE);
  const [expanding, setExpanding] = useState(false);

  // Hook for filter management
  const ***REMOVED***
    filters,
    updateFilters,
    filteredShifts,
    filterStats,
    hasActiveFilters
  ***REMOVED*** = useShiftFilters(shiftsByDate);

  // Specialized hooks for modal management
  const ***REMOVED*** isModalOpen, selectedShift, openNewModal, openEditModal, closeModal ***REMOVED*** = useTurnManager();
  
  // Delete function
  const handleDeleteShift = async (shift) => ***REMOVED***
    try ***REMOVED***
      if (shift.type === 'delivery') ***REMOVED***
        await deleteDeliveryShift(shift.id);
      ***REMOVED*** else ***REMOVED***
        await deleteShift(shift.id);
      ***REMOVED***
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error deleting shift:', error);
    ***REMOVED***
  ***REMOVED***;

  const deleteManager = useDeleteManager(handleDeleteShift);

  // Process shift data (use filtered if active filters)
  const shiftsToDisplay = hasActiveFilters ? filteredShifts : shiftsByDate;
  const allJobs = useMemo(() => [...works, ...deliveryWorks], [works, deliveryWorks]);

  // Function to get Monday of a date
  const getMondayOfWeek = (dateStr) => ***REMOVED***
    const date = createSafeDate(dateStr);
    const weekDay = date.getDay();
    const daysUntilMonday = weekDay === 0 ? -6 : -(weekDay - 1);
    const monday = new Date(date);
    monday.setDate(date.getDate() + daysUntilMonday);
    return monday.toISOString().split('T')[0];
  ***REMOVED***;

  // Function to format week range
  const formatWeekRange = (mondayDate) => ***REMOVED***
    const monday = createSafeDate(mondayDate);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const mondayOptions = ***REMOVED*** day: 'numeric', month: 'short' ***REMOVED***;
    const sundayOptions = ***REMOVED*** day: 'numeric', month: 'short', year: 'numeric' ***REMOVED***;

    const mondayStr = monday.toLocaleDateString('en-US', mondayOptions);
    const sundayStr = sunday.toLocaleDateString('en-US', sundayOptions);

    return `$***REMOVED***mondayStr***REMOVED*** - $***REMOVED***sundayStr***REMOVED***`;
  ***REMOVED***;

  // Group shifts by weeks
  const shiftsByWeek = useMemo(() => ***REMOVED***
    const weeks = ***REMOVED******REMOVED***;
    
    Object.entries(shiftsToDisplay || ***REMOVED******REMOVED***).forEach(([date, shifts]) => ***REMOVED***
      const mondayDate = getMondayOfWeek(date);
      
      if (!weeks[mondayDate]) ***REMOVED***
        weeks[mondayDate] = ***REMOVED******REMOVED***;
      ***REMOVED***
      
      weeks[mondayDate][date] = shifts;
    ***REMOVED***);

    // Sort weeks by date (most recent first)
    const sortedWeeks = Object.keys(weeks)
      .sort((a, b) => new Date(b) - new Date(a))
      .map(mondayDate => (***REMOVED***
        mondayDate,
        weekRange: formatWeekRange(mondayDate),
        shifts: weeks[mondayDate],
        totalShifts: Object.values(weeks[mondayDate]).flat().length
      ***REMOVED***));

    return sortedWeeks;
  ***REMOVED***, [shiftsToDisplay]);

  const weeksToDisplay = shiftsByWeek.slice(0, weeksShown);
  const hasMoreWeeks = shiftsByWeek.length > weeksShown;
  const hasShifts = shiftsByWeek.length > 0;

  const handleShowMoreWeeks = () => ***REMOVED***
    setExpanding(true);
    setTimeout(() => ***REMOVED***
      setWeeksShown(prev => Math.min(prev + WEEKS_PER_PAGE, shiftsByWeek.length));
      setExpanding(false);
    ***REMOVED***, 300);
  ***REMOVED***;

  const handleShowLessWeeks = () => ***REMOVED***
    setWeeksShown(WEEKS_PER_PAGE);
    window.scrollTo(***REMOVED*** top: 0, behavior: 'smooth' ***REMOVED***);
  ***REMOVED***;

  const testDelete = (shift) => ***REMOVED***
    deleteManager.startDeletion(shift);
  ***REMOVED***;

  return (
    <LoadingWrapper loading=***REMOVED***loading***REMOVED***>
      ***REMOVED***/* Main container with improved spacing */***REMOVED***
      <div className="px-4 py-6 space-y-6">
        <PageHeader
          title="Shifts"
          subtitle="Manage and visualize your registered shifts."
          icon=***REMOVED***List***REMOVED***
          action=***REMOVED******REMOVED*** onClick: openNewModal, icon: Plus, label: 'New Shift' ***REMOVED******REMOVED***
        />

        ***REMOVED***/* Filter system */***REMOVED***
        ***REMOVED***(Object.keys(shiftsByDate || ***REMOVED******REMOVED***).length > 0) && (
          <ShiftFilters
            onFiltersChange=***REMOVED***updateFilters***REMOVED***
            activeFilters=***REMOVED***filters***REMOVED***
          />
        )***REMOVED***

        ***REMOVED***/* Filtering statistics */***REMOVED***
        ***REMOVED***hasActiveFilters && (
          <div 
            className="p-3 rounded-lg border-l-4 text-sm"
            style=***REMOVED******REMOVED*** 
              backgroundColor: thematicColors?.transparent5,
              borderLeftColor: thematicColors?.base 
            ***REMOVED******REMOVED***
          >
            <Flex variant="between">
              <span style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED*** className="font-medium">
                Showing ***REMOVED***filterStats.filteredShiftsCount***REMOVED*** of ***REMOVED***filterStats.totalShifts***REMOVED*** shifts
              </span>
              <span className="text-gray-600">
                ***REMOVED***shiftsByWeek.length***REMOVED*** weeks with shifts
              </span>
            </Flex>
          </div>
        )***REMOVED***

        ***REMOVED***/* Main content */***REMOVED***
        ***REMOVED***!hasShifts && !hasActiveFilters ? (
          <ShiftsEmptyState 
            allJobs=***REMOVED***allJobs***REMOVED***
            onNewShift=***REMOVED***openNewModal***REMOVED***
            thematicColors=***REMOVED***thematicColors***REMOVED***
          />
        ) : !hasShifts && hasActiveFilters ? (
          // State when there are filters but no results
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Flex 
              variant="center" 
              className="p-4 rounded-full w-20 h-20 mx-auto mb-4"
              style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.transparent10 ***REMOVED******REMOVED***
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
              onClick=***REMOVED***() => updateFilters(***REMOVED*** work: 'all', weekDays: [], shiftType: 'all' ***REMOVED***)***REMOVED***
              className="text-white px-6 py-3 rounded-lg transition-colors hover:opacity-90"
              style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.base ***REMOVED******REMOVED***
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            ***REMOVED***/* List of shifts organized by weeks */***REMOVED***
            <div className="space-y-8">
              ***REMOVED***weeksToDisplay.map((***REMOVED*** mondayDate, weekRange, shifts, totalShifts ***REMOVED***) => (
                <WeeklyShiftsSection
                  key=***REMOVED***mondayDate***REMOVED***
                  weekRange=***REMOVED***weekRange***REMOVED***
                  shifts=***REMOVED***shifts***REMOVED***
                  totalShifts=***REMOVED***totalShifts***REMOVED***
                  allJobs=***REMOVED***allJobs***REMOVED***
                  onEditShift=***REMOVED***openEditModal***REMOVED***
                  onDeleteShift=***REMOVED***testDelete***REMOVED***
                  thematicColors=***REMOVED***thematicColors***REMOVED***
                />
              ))***REMOVED***
            </div>

            ***REMOVED***/* Navigation (show more/less weeks) */***REMOVED***
            ***REMOVED***hasMoreWeeks && (
              <div className="relative flex flex-col items-center pt-8 pb-12">
                <div
                  className="absolute top-0 left-0 right-0 h-16 rounded-lg opacity-30"
                  style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.transparent5 ***REMOVED******REMOVED***
                />
                <button
                  onClick=***REMOVED***handleShowMoreWeeks***REMOVED***
                  disabled=***REMOVED***expanding***REMOVED***
                  className="relative z-10 flex items-center space-x-2 px-6 py-3 rounded-full font-medium text-white transition-all hover:shadow-lg disabled:opacity-50"
                  style=***REMOVED******REMOVED*** 
                    backgroundColor: thematicColors?.base
                  ***REMOVED******REMOVED***
                >
                  ***REMOVED***expanding ? (
                    <>
                      <LoadingSpinner 
                        size="h-5 w-5"
                        style=***REMOVED******REMOVED*** borderColor: 'white' ***REMOVED******REMOVED***
                        color="border-transparent"
                      />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown size=***REMOVED***20***REMOVED*** />
                      <span>Show more weeks</span>
                    </>
                  )***REMOVED***
                </button>
              </div>
            )***REMOVED***

            ***REMOVED***!hasMoreWeeks && weeksShown > WEEKS_PER_PAGE && (
              <div className="flex justify-center py-4">
                <button
                  onClick=***REMOVED***handleShowLessWeeks***REMOVED***
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChevronUp size=***REMOVED***18***REMOVED*** />
                  <span>Show less</span>
                </button>
              </div>
            )***REMOVED***
          </>
        )***REMOVED***
      </div>

      ***REMOVED***/* Modals */***REMOVED***
      <ShiftModal 
        isOpen=***REMOVED***isModalOpen***REMOVED*** 
        onClose=***REMOVED***closeModal***REMOVED*** 
        shift=***REMOVED***selectedShift***REMOVED*** 
      />

      <DeleteAlert
        visible=***REMOVED***deleteManager.showDeleteModal***REMOVED***
        onCancel=***REMOVED***() => ***REMOVED***
          deleteManager.cancelDeletion();
        ***REMOVED******REMOVED***
        onConfirm=***REMOVED***() => ***REMOVED***
          deleteManager.confirmDeletion();
        ***REMOVED******REMOVED***
        deleting=***REMOVED***deleteManager.deleting***REMOVED***
        type="shift"
        details=***REMOVED***generateShiftDetails(deleteManager.itemToDelete, allJobs)***REMOVED***
      />
    </LoadingWrapper>
  );
***REMOVED***;

export default Shifts;