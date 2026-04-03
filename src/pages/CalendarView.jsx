// src/pages/CalendarView.jsx

import React, { useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CalendarDays, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../contexts/AppContext';
import { useThemeColors } from '../hooks/useThemeColors';
import PageHeader from '../components/layout/PageHeader';
import { localDateToISO } from '../utils/calendarUtils';
import { createSafeDate } from '../utils/time';
import { generateShiftDetails } from '../utils/shiftDetailsUtils';
import Calendario from '../components/calendar/Calendar';
import CalendarDaySummary from '../components/calendar/CalendarDaySummary';
import ShiftModal from '../components/modals/shift/ShiftModal';
import { useTurnManager } from '../hooks/useTurnManager';
import { useDeleteManager } from '../hooks/useDeleteManager';
import DeleteAlert from '../components/alerts/DeleteAlert';
import Loader from '../components/other/Loader';
import Flex from '../components/ui/Flex';
import logger from '../utils/logger';

const CalendarView = () => {
  const { t, i18n } = useTranslation();
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
      logger.error('Invalid Date object created by createSafeDate for input:', dateStr);
      return t('calendar.invalidDate'); 
    }
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const locale = i18n.language === 'es' ? 'es-ES' : i18n.language === 'fr' ? 'fr-FR' : 'en-US';
    const baseFormattedDate = date.toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (date.toDateString() === today.toDateString()) {
      return t('calendar.todayDate', { date: baseFormattedDate });
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return t('calendar.yesterdayDate', { date: baseFormattedDate });
    }
    
    return baseFormattedDate;
  }, [t, i18n.language]);
  
  // Format itemToDelete for summary display using shared utility
  const deletionDetails = useMemo(() => {
    return generateShiftDetails(itemToDelete, allWorks);
  }, [itemToDelete, allWorks]);

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

  if (loading) {
    return (
      <Flex variant="center" className="h-screen">
        <Loader />
      </Flex>
    );
  }

  return (
    <div className="px-4 py-6 pb-32 space-y-6">
      <Helmet>
        <title>Calendar - Orary</title>
        <meta name="description" content="View your work shifts on a calendar. Plan upcoming shifts and track your schedule." />
      </Helmet>
      <PageHeader
        title={t('nav.calendar')}
        subtitle={hasWorks ? t('calendar.subtitle') : null}
        icon={CalendarDays}
        action={hasWorks && selectedDate && {
          onClick: () => onNewShift(createSafeDate(selectedDate)),
          icon: Plus,
          label: t('nav.newShift'),
          mobileLabel: t('nav.newShift'),
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
            {t('calendar.noWorksMessage')}
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
        type="shift"
        details={deletionDetails}
      />
    </div>
  );
};
export default CalendarView;
