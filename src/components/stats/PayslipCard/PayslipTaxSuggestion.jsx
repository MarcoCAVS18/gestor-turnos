// src/components/stats/PayslipCard/PayslipTaxSuggestion.jsx
// Compares the tax rate implied by the active payslip (tax/gross) against
// the user's configured discount for the matching work — inferred from the
// shifts covering the payslip's period, falling back to the global default
// when the work can't be confidently determined (0 or several works among
// the covering shifts) — and offers a one-click update when they differ.

import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Button from '../../ui/Button';

const MIN_DIFFERENCE = 1; // percentage points — ignore rounding noise

const PayslipTaxSuggestion = ({ gross, tax, coverage }) => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { works, defaultDiscount, taxesPerWork, savePreferences } = useApp();
  const [saving, setSaving] = useState(false);
  const [applied, setApplied] = useState(false);

  const targetWork = useMemo(() => {
    const shifts = (coverage?.days || []).flatMap((d) => d.shifts || []);
    const workIds = new Set(shifts.map((s) => s.workId).filter(Boolean));
    if (workIds.size !== 1) return null;
    const [workId] = workIds;
    return (works || []).find((w) => w.id === workId) || null;
  }, [coverage, works]);

  const suggestion = useMemo(() => {
    const g = Number(gross);
    const tx = Number(tax);
    if (!g || g <= 0 || tx === null || tx === undefined || tx === '' || tx < 0 || tx >= g) return null;

    const impliedRate = Math.round((tx / g) * 1000) / 10; // 1 decimal
    const configuredRate = targetWork
      ? (taxesPerWork?.[targetWork.id] ?? defaultDiscount ?? 0)
      : (defaultDiscount ?? 0);

    if (Math.abs(impliedRate - configuredRate) < MIN_DIFFERENCE) return null;
    return { impliedRate, configuredRate };
  }, [gross, tax, targetWork, taxesPerWork, defaultDiscount]);

  if (!suggestion || applied) return null;

  const handleApply = async () => {
    setSaving(true);
    try {
      if (targetWork) {
        await savePreferences({
          taxesPerWork: { ...(taxesPerWork || {}), [targetWork.id]: suggestion.impliedRate },
        });
      } else {
        await savePreferences({ defaultDiscount: suggestion.impliedRate });
      }
      setApplied(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-3">
      <div className="flex items-start gap-2">
        <TrendingUp size={16} className="flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            {t('payslip.taxSuggestion.message', {
              implied: suggestion.impliedRate,
              configured: suggestion.configuredRate,
            })}
          </p>
          <Button
            onClick={handleApply}
            loading={saving}
            size="sm"
            themeColor={colors.primary}
            className="mt-2"
          >
            {t('payslip.taxSuggestion.apply', { rate: suggestion.impliedRate })}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PayslipTaxSuggestion;
