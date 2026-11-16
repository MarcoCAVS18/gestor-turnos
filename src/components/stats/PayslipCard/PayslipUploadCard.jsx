// src/components/stats/PayslipCard/PayslipUploadCard.jsx
// Centered upload card shown when there are no payslips yet: a large drop zone
// plus the manual-entry option. Kept small and presentational.

import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import PayslipDropZone from './PayslipDropZone';

const PayslipUploadCard = ({ onPickFiles, onFilesDropped, onManualAdd }) => {
  const { t } = useTranslation();

  return (
    <Card variant="transparent" className="p-4 w-full">
      <div className="max-w-lg mx-auto w-full">
        <PayslipDropZone onClick={onPickFiles} onFiles={onFilesDropped} />
        <div className="mt-5 flex flex-col items-center gap-2 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('payslip.dropzone.manualHint')}</p>
          <Button onClick={onManualAdd} variant="secondary" size="sm" icon={Plus} iconPosition="left">
            {t('payslip.addManual')}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PayslipUploadCard;
