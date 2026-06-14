// src/components/stats/PayslipCard/PayslipHero.jsx
// Hero vertical del dashboard de payslips: donut grande arriba, número
// del Net debajo centrado, y las 3 mini-stats (Tax / Hours / Tasa efectiva)
// en una fila al final.
//
// Card clickeable: alterna entre dos modos con un toggle interno
//   - 'total'  → suma agregada de todos los recibos cargados
//   - 'detail' → el recibo más reciente individualmente
// Si solo hay un recibo cargado, el toggle se oculta (los dos modos serían
// idénticos) y la card no es clickeable.

import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { DonutChart, MiniStat } from './ui';
import { formatPeriodShort } from './helpers';

const PayslipHero = ({ aggregate, latestPayslip, formatMoney, mode, onToggle, canToggle }) => {
  const { t } = useTranslation();
  const colors = useThemeColors();

  // Selecciona la fuente de datos según el modo. Cuando estamos en 'detail'
  // armamos un objeto con la misma forma que aggregate para reusar la UI.
  const isDetail = mode === 'detail' && latestPayslip;
  const data = isDetail
    ? {
        totalGross: latestPayslip.gross || 0,
        totalTax: latestPayslip.tax || 0,
        totalNet: (latestPayslip.gross || 0) - (latestPayslip.tax || 0),
        totalHours: latestPayslip.hours || 0,
      }
    : aggregate;

  const netPct = data.totalGross > 0
    ? (data.totalNet / data.totalGross) * 100
    : 0;

  const effectiveRate = data.totalGross > 0
    ? `${((data.totalTax / data.totalGross) * 100).toFixed(1)}%`
    : '—';

  const periodLabel = isDetail
    ? formatPeriodShort(latestPayslip.periodStart, latestPayslip.periodEnd)
    : null;

  return (
    <button
      type="button"
      onClick={canToggle ? onToggle : undefined}
      disabled={!canToggle}
      className={`w-full text-left rounded-xl border border-gray-200 dark:border-slate-700 p-4 transition-colors ${
        canToggle ? 'cursor-pointer hover:border-gray-300 dark:hover:border-slate-600' : 'cursor-default'
      }`}
    >
      {/* Toggle indicator arriba */}
      {canToggle && (
        <div className="flex items-center justify-between mb-3 text-[10px] uppercase tracking-wide">
          <span className="font-semibold" style={{ color: colors.primary }}>
            {isDetail ? t('payslip.dashboard.modeDetail') : t('payslip.dashboard.modeTotal')}
          </span>
          <span className="text-gray-400 dark:text-gray-500 normal-case tracking-normal">
            {t('payslip.dashboard.tapToToggle')}
          </span>
        </div>
      )}

      {/* Animación entre modos: el contenido fade-cross al alternar */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isDetail ? 'detail' : 'total'}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          {/* Donut centrado arriba */}
          <div className="flex justify-center">
            <DonutChart netPct={netPct} primaryColor={colors.primary} />
          </div>

          {/* Net + Bruto debajo centrados.
              El slot del período se renderiza SIEMPRE para reservar espacio,
              aunque esté vacío (visibility hidden) en modo Total — así la
              altura de la card no cambia al alternar. */}
          <div className="text-center mt-3">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {t('payslip.dashboard.net')}
            </p>
            <p
              className="text-2xl font-bold leading-tight mt-0.5"
              style={{ color: colors.primary }}
            >
              {formatMoney(data.totalNet)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t('payslip.gross')}: {formatMoney(data.totalGross)}
            </p>
            <p
              className="text-[11px] text-gray-400 dark:text-gray-500 mt-1"
              style={{ visibility: periodLabel ? 'visible' : 'hidden' }}
              aria-hidden={!periodLabel}
            >
              {periodLabel || '—'}
            </p>
          </div>

          {/* 3 mini-stats al final */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
            <MiniStat label={t('payslip.tax')} value={formatMoney(data.totalTax)} />
            <MiniStat
              label={t('payslip.hours')}
              value={data.totalHours > 0 ? `${data.totalHours.toFixed(1)}h` : '—'}
            />
            <MiniStat label={t('payslip.dashboard.effectiveRate')} value={effectiveRate} />
          </div>
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

export default PayslipHero;
