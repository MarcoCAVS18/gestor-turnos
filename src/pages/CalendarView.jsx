// src/pages/CalendarView.jsx

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Plus } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useThemeColors } from '../hooks/useThemeColors';
import PageHeader from '../components/layout/PageHeader';
import { localDateToISO } from '../utils/calendarUtils';
import { createSafeDate } from '../utils/time';
import Calendario from '../components/calendar/Calendar';
import CalendarDaySummary from '../components/calendar/CalendarDaySummary';
import ShiftModal from '../components/modals/shift/ShiftModal';
import { useTurnManager } from '../hooks/useTurnManager';
import { useDeleteManager } from '../hooks/useDeleteManager';
import DeleteAlert from '../components/alerts/DeleteAlert';
import Loader from '../components/other/Loader';

const CalendarView = () => {
  const { shiftsByDate, allWorks, thematicColors, loading, deleteShift } = useApp();
  const colors = useThemeColors();
  
  const hasWorks = allWorks && allWorks.length > 0;
  
  const [selectedDate, setSelectedDate] = useState(localDateToISO(createSafeDate(new Date())));

  const selectedShifts = useMemo(() => 
    selectedDate ? (shiftsByDate[selectedDate] || []) : [], 
    [shiftsByDate, selectedDate]
  );

  const { 
    isModalOpen, 
    selectedShift, 
    initialDate,
    openEditModal,
    openModalWithDate,
    closeModal 
  } = useTurnManager();
  
  const { 
    showDeleteModal,
    itemToDelete, 
    deleting,
    startDeletion,
    cancelDeletion,
    confirmDeletion
  } = useDeleteManager(deleteShift);
  
  const formatDate = useCallback((dateStr) => {
    const date = createSafeDate(dateStr);
    
    // Explicitly check for invalid date object
    if (isNaN(date.getTime())) {
      console.error('Invalid Date object created by createSafeDate for input:', dateStr);
      return 'Invalid date'; 
    }
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const baseFormattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${baseFormattedDate}`;
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${baseFormattedDate}`;
    }
    
    return baseFormattedDate;
  }, []);
  
  // Format itemToDelete for summary display
  const deletionDetails = useMemo(() => {
    if (!itemToDelete) return [];
    
    const work = allWorks.find(t => t.id === itemToDelete.workId);
    const workName = work ? work.name : 'Unknown Work';
    
    return [
      `Work shift for ${workName}`,
      `Date: ${formatDate(itemToDelete.startDate)}`,
      `Schedule: ${itemToDelete.startTime} - ${itemToDelete.endTime}`
    ];
  }, [itemToDelete, allWorks, formatDate]);

  const selectDay = (date) => {
    setSelectedDate(localDateToISO(date));
  };

  const onNewShift = (date) => {
    openModalWithDate(date);
  };
  
  const calendarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } }
  };
  
  const detailsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
  };
  
  return (
    <div className="px-4 py-6 pb-32 space-y-6">
      {loading && <Loader />}
      <PageHeader
        title="Calendar"
        subtitle={hasWorks ? "Visualize and manage your shifts by date" : null}
        icon={CalendarDays}
        action={hasWorks && selectedDate && {
          onClick: () => onNewShift(createSafeDate(selectedDate)),
          icon: Plus,
          label: "New Shift",
          mobileLabel: "New",
          themeColor: colors.primary,
        }}
      />
      
      {!hasWorks && (
        <motion.div
          className="mb-4 p-4 rounded-lg border"
          style={{
            backgroundColor: thematicColors?.transparent10 || 'rgba(255, 193, 7, 0.1)',
            borderColor: thematicColors?.transparent20 || 'rgba(255, 193, 7, 0.2)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p style={{ color: thematicColors?.base || '#FFC107' }} className="text-sm font-medium">
            To use the calendar, you first need to create at least one work in the "Works" section.
          </p>
        </motion.div>
      )}
      
      <motion.div
        variants={calendarVariants}
        initial="hidden"
        animate="visible"
      >
        <Calendario onSelectedDay={selectDay} />
      </motion.div>
      
      <motion.div
        variants={detailsVariants}
        initial="hidden"
        animate="visible"
      >
        <CalendarDaySummary
          selectedDate={selectedDate}
          shifts={selectedShifts}
          formatDate={formatDate}
          onNewShift={onNewShift}
          onEdit={openEditModal}
          onDelete={startDeletion}
        />
      </motion.div>
      
      <ShiftModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        shift={selectedShift}
        initialDate={initialDate}
      />
      
      <DeleteAlert
        visible={showDeleteModal}
        onCancel={cancelDeletion}
        onConfirm={confirmDeletion}
        deleting={deleting}
        tipo="shift"
        detalles={deletionDetails}
      />
    </div>
  );
};
export default CalendarView;