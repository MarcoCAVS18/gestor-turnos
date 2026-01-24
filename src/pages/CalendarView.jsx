// src/pages/CalendarView.jsx

import React, ***REMOVED*** useState, useMemo, useCallback ***REMOVED*** from 'react';
import ***REMOVED*** motion ***REMOVED*** from 'framer-motion';
import ***REMOVED*** CalendarDays, Plus ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../hooks/useThemeColors';
import PageHeader from '../components/layout/PageHeader';
import ***REMOVED*** localDateToISO ***REMOVED*** from '../utils/calendarUtils';
import ***REMOVED*** createSafeDate ***REMOVED*** from '../utils/time';
import Calendario from '../components/calendar/Calendar';
import CalendarDaySummary from '../components/calendar/CalendarDaySummary';
import ShiftModal from '../components/modals/shift/ShiftModal';
import ***REMOVED*** useTurnManager ***REMOVED*** from '../hooks/useTurnManager';
import ***REMOVED*** useDeleteManager ***REMOVED*** from '../hooks/useDeleteManager';
import DeleteAlert from '../components/alerts/DeleteAlert';
import Loader from '../components/other/Loader';

const CalendarView = () => ***REMOVED***
  const ***REMOVED*** shiftsByDate, allWorks, thematicColors, loading, deleteShift ***REMOVED*** = useApp();
  const colors = useThemeColors();
  
  const hasWorks = allWorks && allWorks.length > 0;
  
  const [selectedDate, setSelectedDate] = useState(localDateToISO(createSafeDate(new Date())));

  const selectedShifts = useMemo(() => 
    selectedDate ? (shiftsByDate[selectedDate] || []) : [], 
    [shiftsByDate, selectedDate]
  );

  const ***REMOVED*** 
    isModalOpen, 
    selectedShift, 
    initialDate,
    openEditModal,
    openModalWithDate,
    closeModal 
  ***REMOVED*** = useTurnManager();
  
  const ***REMOVED*** 
    showDeleteModal,
    itemToDelete, 
    deleting,
    startDeletion,
    cancelDeletion,
    confirmDeletion
  ***REMOVED*** = useDeleteManager(deleteShift);
  
  const formatDate = useCallback((dateStr) => ***REMOVED***
    const date = createSafeDate(dateStr);
    
    // Explicitly check for invalid date object
    if (isNaN(date.getTime())) ***REMOVED***
      console.error('Invalid Date object created by createSafeDate for input:', dateStr);
      return 'Invalid date'; 
    ***REMOVED***
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const baseFormattedDate = date.toLocaleDateString('en-US', ***REMOVED***
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    ***REMOVED***);

    if (date.toDateString() === today.toDateString()) ***REMOVED***
      return `Today, $***REMOVED***baseFormattedDate***REMOVED***`;
    ***REMOVED***
    if (date.toDateString() === yesterday.toDateString()) ***REMOVED***
      return `Yesterday, $***REMOVED***baseFormattedDate***REMOVED***`;
    ***REMOVED***
    
    return baseFormattedDate;
  ***REMOVED***, []);
  
  // Format itemToDelete for summary display
  const deletionDetails = useMemo(() => ***REMOVED***
    if (!itemToDelete) return [];
    
    const work = allWorks.find(t => t.id === itemToDelete.workId);
    const workName = work ? work.name : 'Unknown Work';
    
    return [
      `Work shift for $***REMOVED***workName***REMOVED***`,
      `Date: $***REMOVED***formatDate(itemToDelete.startDate)***REMOVED***`,
      `Schedule: $***REMOVED***itemToDelete.startTime***REMOVED*** - $***REMOVED***itemToDelete.endTime***REMOVED***`
    ];
  ***REMOVED***, [itemToDelete, allWorks, formatDate]);

  const selectDay = (date) => ***REMOVED***
    setSelectedDate(localDateToISO(date));
  ***REMOVED***;

  const onNewShift = (date) => ***REMOVED***
    openModalWithDate(date);
  ***REMOVED***;
  
  const calendarVariants = ***REMOVED***
    hidden: ***REMOVED*** opacity: 0, y: -20 ***REMOVED***,
    visible: ***REMOVED*** opacity: 1, y: 0, transition: ***REMOVED*** duration: 0.5, delay: 0.1 ***REMOVED*** ***REMOVED***
  ***REMOVED***;
  
  const detailsVariants = ***REMOVED***
    hidden: ***REMOVED*** opacity: 0, y: 20 ***REMOVED***,
    visible: ***REMOVED*** opacity: 1, y: 0, transition: ***REMOVED*** duration: 0.5, delay: 0.2 ***REMOVED*** ***REMOVED***
  ***REMOVED***;
  
  return (
    <div className="px-4 py-6 pb-32 space-y-6">
      ***REMOVED***loading && <Loader />***REMOVED***
      <PageHeader
        title="Calendar"
        subtitle=***REMOVED***hasWorks ? "Visualize and manage your shifts by date" : null***REMOVED***
        icon=***REMOVED***CalendarDays***REMOVED***
        action=***REMOVED***hasWorks && selectedDate && ***REMOVED***
          onClick: () => onNewShift(createSafeDate(selectedDate)),
          icon: Plus,
          label: "New Shift",
          mobileLabel: "New",
          themeColor: colors.primary,
        ***REMOVED******REMOVED***
      />
      
      ***REMOVED***!hasWorks && (
        <motion.div
          className="mb-4 p-4 rounded-lg border"
          style=***REMOVED******REMOVED***
            backgroundColor: thematicColors?.transparent10 || 'rgba(255, 193, 7, 0.1)',
            borderColor: thematicColors?.transparent20 || 'rgba(255, 193, 7, 0.2)'
          ***REMOVED******REMOVED***
          initial=***REMOVED******REMOVED*** opacity: 0 ***REMOVED******REMOVED***
          animate=***REMOVED******REMOVED*** opacity: 1 ***REMOVED******REMOVED***
        >
          <p style=***REMOVED******REMOVED*** color: thematicColors?.base || '#FFC107' ***REMOVED******REMOVED*** className="text-sm font-medium">
            To use the calendar, you first need to create at least one work in the "Works" section.
          </p>
        </motion.div>
      )***REMOVED***
      
      <motion.div
        variants=***REMOVED***calendarVariants***REMOVED***
        initial="hidden"
        animate="visible"
      >
        <Calendario onSelectedDay=***REMOVED***selectDay***REMOVED*** />
      </motion.div>
      
      <motion.div
        variants=***REMOVED***detailsVariants***REMOVED***
        initial="hidden"
        animate="visible"
      >
        <CalendarDaySummary
          selectedDate=***REMOVED***selectedDate***REMOVED***
          shifts=***REMOVED***selectedShifts***REMOVED***
          formatDate=***REMOVED***formatDate***REMOVED***
          onNewShift=***REMOVED***onNewShift***REMOVED***
          onEdit=***REMOVED***openEditModal***REMOVED***
          onDelete=***REMOVED***startDeletion***REMOVED***
        />
      </motion.div>
      
      <ShiftModal 
        isOpen=***REMOVED***isModalOpen***REMOVED*** 
        onClose=***REMOVED***closeModal***REMOVED*** 
        shift=***REMOVED***selectedShift***REMOVED***
        initialDate=***REMOVED***initialDate***REMOVED***
      />
      
      <DeleteAlert
        visible=***REMOVED***showDeleteModal***REMOVED***
        onCancel=***REMOVED***cancelDeletion***REMOVED***
        onConfirm=***REMOVED***confirmDeletion***REMOVED***
        deleting=***REMOVED***deleting***REMOVED***
        tipo="shift"
        detalles=***REMOVED***deletionDetails***REMOVED***
      />
    </div>
  );
***REMOVED***;
export default CalendarView;