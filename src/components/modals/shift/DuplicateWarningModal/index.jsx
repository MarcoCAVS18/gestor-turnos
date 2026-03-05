// src/components/modals/shift/DuplicateWarningModal/index.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const colors = useThemeColors();

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('modals.duplicateWarning.title')}
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
                {t('modals.duplicateWarning.existsMessage', { duplicate: duplicateCount, total: totalCount })}
              </p>
              <p className="text-xs" style={{ color: colors.textSecondary }}>
                {t('modals.duplicateWarning.existsDescription')}
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
                {t('modals.duplicateWarning.uniqueCanCreate', { count: uniqueCount })}
              </p>
              <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                {t('modals.duplicateWarning.clickHint')}
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
            {t('common.goBack')}
          </Button>
          {uniqueCount > 0 ? (
            <Button
              onClick={onSkipDuplicates}
              variant="primary"
              className="flex-1"
              themeColor={colors.primary}
            >
              {t('modals.duplicateWarning.createUnique')}
            </Button>
          ) : (
            <Button
              onClick={onClose}
              variant="primary"
              className="flex-1"
              themeColor={colors.primary}
            >
              {t('common.close')}
            </Button>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default DuplicateWarningModal;
