// src/components/modals/shift/BulkShiftConfirmModal/index.jsx

import React, { useState, useMemo } from 'react';
import { Calendar, AlertCircle, LayoutGrid, CalendarDays, CalendarRange } from 'lucide-react';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { generateBulkShifts, getPatternSummary, detectDuplicates } from '../../../../services/bulkShiftService';
import BaseModal from '../../base/BaseModal';
import Card from '../../../ui/Card';
import Button from '../../../ui/Button';
import WeeklyPattern from '../../../forms/shift/BulkShiftOptions/WeeklyPattern';
import SpecificDates from '../../../forms/shift/BulkShiftOptions/SpecificDates';
import DateRange from '../../../forms/shift/BulkShiftOptions/DateRange';
import BulkPreview from '../../../forms/shift/BulkShiftOptions/BulkPreview';
import DuplicateWarningModal from '../DuplicateWarningModal';
import logger from '../../../../utils/logger';

const BulkShiftConfirmModal = ({
  isOpen,
  onClose,
  baseShift,
  workName,
  existingShifts = [],
  onConfirm
}) => {
  const colors = useThemeColors();

  // Tab state
  const [activeTab, setActiveTab] = useState('weekly');

  // Duplicate warning state
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [duplicateData, setDuplicateData] = useState({ duplicates: [], unique: [] });

  // Weekly pattern state
  const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5]); // Mon-Fri by default
  const [weeks, setWeeks] = useState(4);

  // Specific dates state
  const [selectedDatesList, setSelectedDatesList] = useState([]);

  // Date range state
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [skipWeekends, setSkipWeekends] = useState(true);

  const [isCreating, setIsCreating] = useState(false);

  // Generate shifts based on current tab and configuration
  const generatedShifts = useMemo(() => {
    if (!baseShift || !baseShift.workId || !baseShift.startTime || !baseShift.endTime) {
      return [];
    }

    let pattern;

    switch (activeTab) {
      case 'weekly':
        if (selectedDays.length === 0) return [];
        pattern = {
          type: 'weekly',
          selectedDays,
          weeks,
          startDate: baseShift.startDate
        };
        break;

      case 'dates':
        if (selectedDatesList.length === 0) return [];
        pattern = {
          type: 'dates',
          dates: selectedDatesList
        };
        break;

      case 'range':
        if (!fromDate || !toDate) return [];
        pattern = {
          type: 'range',
          fromDate,
          toDate,
          skipWeekends
        };
        break;

      default:
        return [];
    }

    return generateBulkShifts(baseShift, pattern);
  }, [baseShift, activeTab, selectedDays, weeks, selectedDatesList, fromDate, toDate, skipWeekends]);

  const patternSummary = useMemo(() => {
    if (generatedShifts.length === 0) return '';

    switch (activeTab) {
      case 'weekly':
        return getPatternSummary({ type: 'weekly', selectedDays, weeks });
      case 'dates':
        return `${selectedDatesList.length} specific date${selectedDatesList.length > 1 ? 's' : ''}`;
      case 'range':
        return getPatternSummary({ type: 'range', fromDate, toDate, skipWeekends });
      default:
        return '';
    }
  }, [activeTab, generatedShifts.length, selectedDays, weeks, selectedDatesList.length, fromDate, toDate, skipWeekends]);

  const handleConfirm = async () => {
    if (generatedShifts.length === 0) return;

    // Check for duplicates
    const { duplicates, unique } = detectDuplicates(generatedShifts, existingShifts);

    if (duplicates.length > 0) {
      // Show duplicate warning
      setDuplicateData({ duplicates, unique });
      setShowDuplicateWarning(true);
      return;
    }

    // No duplicates, proceed with creation
    setIsCreating(true);
    try {
      await onConfirm(generatedShifts);
      handleClose();
    } catch (error) {
      logger.error('Error creating bulk shifts:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSkipDuplicates = async () => {
    if (duplicateData.unique.length === 0) return;

    setShowDuplicateWarning(false);
    setIsCreating(true);
    try {
      await onConfirm(duplicateData.unique);
      handleClose();
    } catch (error) {
      logger.error('Error creating bulk shifts:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancelDuplicateWarning = () => {
    setShowDuplicateWarning(false);
    setDuplicateData({ duplicates: [], unique: [] });
  };

  const handleClose = () => {
    if (!isCreating) {
      // Reset state
      setActiveTab('weekly');
      setSelectedDays([1, 2, 3, 4, 5]);
      setWeeks(4);
      setSelectedDatesList([]);
      setFromDate('');
      setToDate('');
      setSkipWeekends(true);
      setShowDuplicateWarning(false);
      setDuplicateData({ duplicates: [], unique: [] });
      onClose();
    }
  };

  const tabs = [
    { id: 'weekly', label: 'Weekly', icon: LayoutGrid },
    { id: 'dates', label: 'Specific Dates', icon: CalendarDays },
    { id: 'range', label: 'Date Range', icon: CalendarRange }
  ];

  const getTabButtonStyle = (tabId) => {
    const isActive = activeTab === tabId;
    return {
      backgroundColor: isActive ? colors.primary : colors.surface2,
      color: isActive ? '#FFFFFF' : colors.text,
      borderColor: isActive ? colors.primary : colors.border
    };
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Multiple Shifts"
      subtitle={`Configure pattern for: ${workName}`}
      icon={Calendar}
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Base Shift Summary */}
        <Card variant="surface2">
          <h4 className="text-sm font-semibold mb-3" style={{ color: colors.text }}>
            Base Shift Template
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: colors.textSecondary }}>Time:</span>
              <span className="font-medium" style={{ color: colors.text }}>
                {baseShift?.startTime} - {baseShift?.endTime}
              </span>
            </div>
            {baseShift?.notes && (
              <div className="flex justify-between">
                <span style={{ color: colors.textSecondary }}>Notes:</span>
                <span className="font-medium" style={{ color: colors.text }}>
                  {baseShift.notes}
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Tab Navigation */}
        <div>
          <h4 className="text-sm font-semibold mb-3" style={{ color: colors.text }}>
            Repetition Pattern
          </h4>
          <div className="flex gap-2 mb-4">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200"
                  style={getTabButtonStyle(tab.id)}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'weekly' && (
              <WeeklyPattern
                selectedDays={selectedDays}
                weeks={weeks}
                onSelectedDaysChange={setSelectedDays}
                onWeeksChange={setWeeks}
              />
            )}

            {activeTab === 'dates' && (
              <SpecificDates
                selectedDates={selectedDatesList}
                onSelectedDatesChange={setSelectedDatesList}
                minDate={baseShift?.startDate}
              />
            )}

            {activeTab === 'range' && (
              <DateRange
                fromDate={fromDate}
                toDate={toDate}
                skipWeekends={skipWeekends}
                onFromDateChange={setFromDate}
                onToDateChange={setToDate}
                onSkipWeekendsChange={setSkipWeekends}
                minDate={baseShift?.startDate}
              />
            )}
          </div>
        </div>

        {/* Preview */}
        {generatedShifts.length > 0 ? (
          <BulkPreview
            shifts={generatedShifts}
            workName={workName}
          />
        ) : (
          <Card variant="surface2">
            <div className="flex items-center gap-2 text-sm" style={{ color: colors.textSecondary }}>
              <AlertCircle size={18} />
              <span>
                {activeTab === 'weekly' && 'Select at least one day to create shifts'}
                {activeTab === 'dates' && 'Add dates to create shifts'}
                {activeTab === 'range' && 'Select start and end dates'}
              </span>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleClose}
            variant="cancel"
            disabled={isCreating}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={handleConfirm}
            variant="primary"
            disabled={generatedShifts.length === 0 || isCreating}
            loading={isCreating}
            className="flex-1"
            themeColor={colors.primary}
          >
            {isCreating
              ? 'Creating...'
              : `Create ${generatedShifts.length} Shift${generatedShifts.length > 1 ? 's' : ''}`
            }
          </Button>
        </div>

        {/* Summary text */}
        {patternSummary && (
          <p className="text-xs text-center" style={{ color: colors.textSecondary }}>
            {patternSummary}
          </p>
        )}
      </div>

      {/* Duplicate Warning Modal */}
      <DuplicateWarningModal
        isOpen={showDuplicateWarning}
        onClose={handleCancelDuplicateWarning}
        duplicateCount={duplicateData.duplicates.length}
        uniqueCount={duplicateData.unique.length}
        totalCount={generatedShifts.length}
        onSkipDuplicates={handleSkipDuplicates}
        onCancel={handleCancelDuplicateWarning}
      />
    </BaseModal>
  );
};

export default BulkShiftConfirmModal;
