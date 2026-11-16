// src/components/stats/PayslipCard/PayslipNotesFooter.jsx
// Small notes shown BELOW the payslip cards: the refund-availability scope and
// an honest note that detection uses several technologies and may occasionally
// fail. Kept out of the cards so they don't clutter the data.

import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';

const PayslipNotesFooter = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-1.5 px-2 pt-1 text-center">
      <p className="text-xs text-gray-400 dark:text-gray-500">{t('payslip.unsupportedCountry')}</p>
      <p className="inline-flex items-center justify-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
        <Info size={12} className="flex-shrink-0" />
        {t('payslip.techNote')}
      </p>
    </div>
  );
};

export default PayslipNotesFooter;
