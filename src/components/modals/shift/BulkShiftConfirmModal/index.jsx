// src/components/modals/shift/BulkShiftConfirmModal/index.jsx

import React, { useState, useMemo } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { generateBulkShifts, getPatternSummary } from '../../../../services/bulkShiftService';
import BaseModal from '../../base/BaseModal';
import Card from '../../../ui/Card';
import Button from '../../../ui/Button';
import WeeklyPattern from '../../../forms/shift/BulkShiftOptions/WeeklyPattern';
import BulkPreview from '../../../forms/shift/BulkShiftOptions/BulkPreview';

const BulkShiftConfirmModal = ({
  isOpen,
  onClose,
  baseShift,
  workName,
  onConfirm
}) => {
  const colors = useThemeColors();

  const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5]); // Mon-Fri by default
  const [weeks, setWeeks] = useState(4);
  const [isCreating, setIsCreating] = useState(false);

  // Generate shifts based on current configuration
  const generatedShifts = useMemo(() => {
    if (!baseShift || !baseShift.workId || !baseShift.startTime || !baseShift.endTime) {
      return [];
    }

    if (selectedDays.length === 0) {
      return [];
    }

    const pattern = {
      type: 'weekly',
      selectedDays,
      weeks,
      startDate: baseShift.startDate
    };

    return generateBulkShifts(baseShift, pattern);
  }, [baseShift, selectedDays, weeks]);

  const patternSummary = useMemo(() => {
    if (selectedDays.length === 0) return '';
    return getPatternSummary({
      type: 'weekly',
      selectedDays,
      weeks
    });
  }, [selectedDays, weeks]);

  const handleConfirm = async () => {
    if (generatedShifts.length === 0) return;

    setIsCreating(true);
    try {
      await onConfirm(generatedShifts);
      onClose();
    } catch (error) {
      console.error('Error creating bulk shifts:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      // Reset state
      setSelectedDays([1, 2, 3, 4, 5]);
      setWeeks(4);
      onClose();
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Multiple Shifts"
      subtitle={`Configure pattern for: ${workName}`}
      icon={Calendar}
      maxWidth="max-w-2xl"
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
            <div className="flex justify-between">
              <span style={{ color: colors.textSecondary }}>Break:</span>
              <span className="font-medium" style={{ color: colors.text }}>
                {baseShift?.hadBreak ? `${baseShift?.breakMinutes || 0} min` : 'No'}
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

        {/* Pattern Configuration */}
        <div>
          <h4 className="text-sm font-semibold mb-3" style={{ color: colors.text }}>
            Repetition Pattern
          </h4>
          <WeeklyPattern
            selectedDays={selectedDays}
            weeks={weeks}
            onSelectedDaysChange={setSelectedDays}
            onWeeksChange={setWeeks}
          />
        </div>

        {/* Preview */}
        {generatedShifts.length > 0 ? (
          <BulkPreview
            shifts={generatedShifts}
            workName={workName}
          />
        ) : (
          <Card variant="surface2">
            <div className="flex items-center gap-2 text-sm" style={{ color: colors.error }}>
              <AlertCircle size={18} />
              <span>Select at least one day to create shifts</span>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleClose}
            variant="secondary"
            disabled={isCreating}
            className="flex-1"
          >
            Cancel
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
            {patternSummary} • Starting from {baseShift?.startDate}
          </p>
        )}
      </div>
    </BaseModal>
  );
};

export default BulkShiftConfirmModal;
