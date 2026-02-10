// src/components/modals/shift/DuplicateWarningModal/index.jsx

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import BaseModal from '../../base/BaseModal';
import Card from '../../../ui/Card';
import Button from '../../../ui/Button';

const DuplicateWarningModal = ({
  isOpen,
  onClose,
  duplicateCount,
  uniqueCount,
  totalCount,
  onSkipDuplicates,
  onCancel
}) => {
  const colors = useThemeColors();

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Duplicate Shifts Detected"
      icon={AlertTriangle}
      maxWidth="sm"
    >
      <div className="space-y-4">
        {/* Warning Message */}
        <Card variant="surface2">
          <div className="flex items-start gap-3">
            <AlertTriangle
              size={20}
              style={{ color: colors.warning }}
              className="flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: colors.text }}>
                {duplicateCount} of {totalCount} shifts already exist
              </p>
              <p className="text-xs" style={{ color: colors.textSecondary }}>
                These shifts have the same work, date, and times as existing shifts in your schedule.
              </p>
            </div>
          </div>
        </Card>

        {/* Info about unique shifts */}
        {uniqueCount > 0 && (
          <Card variant="surface2">
            <div
              className="p-3 rounded-lg border"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.primary + '40'
              }}
            >
              <p className="text-sm font-medium" style={{ color: colors.text }}>
                {uniqueCount} unique shift{uniqueCount > 1 ? 's' : ''} can be created
              </p>
              <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                Click "Create Unique Only" to skip duplicates and create the remaining shifts.
              </p>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={onCancel}
            variant="cancel"
            className="flex-1"
          >
            Go Back
          </Button>
          {uniqueCount > 0 ? (
            <Button
              onClick={onSkipDuplicates}
              variant="primary"
              className="flex-1"
              themeColor={colors.primary}
            >
              Create Unique Only
            </Button>
          ) : (
            <Button
              onClick={onClose}
              variant="primary"
              className="flex-1"
              themeColor={colors.primary}
            >
              Close
            </Button>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default DuplicateWarningModal;
