// src/components/dashboard/ExportReportCard/index.jsx

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Download,
  FileText,
  Image,
  FileSpreadsheet,
  Crown,
  Sparkles,
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { usePremium, PREMIUM_COLORS } from '../../../contexts/PremiumContext';

import Card from '../../ui/Card';
import logger from '../../../utils/logger';

const FORMATS = [
  { id: 'pdf',  icon: FileText,      labelKey: 'dashboard.export.formats.pdf' },
  { id: 'png',  icon: Image,         labelKey: 'dashboard.export.formats.png' },
  { id: 'xlsx', icon: FileSpreadsheet, labelKey: 'dashboard.export.formats.excel' },
];

const ExportReportCard = ({ onExport }) => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { isPremium, openPremiumModal } = usePremium();

  // Sin selección por defecto: el botón Exportar arranca inactivo y se
  // habilita cuando el usuario elige un formato.
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (isExporting || !selectedFormat) return;
    setIsExporting(true);
    try {
      await onExport(selectedFormat);
    } catch (error) {
      logger.error('Error exporting:', error);
    } finally {
      setTimeout(() => setIsExporting(false), 1200);
    }
  };

  /* ─── LOCKED (non-premium) ─── */
  if (!isPremium) {
    return (
      <Card variant="transparent">
        {/* Header */}
        <h3 className="text-lg font-semibold mb-1 flex items-center">
          <Download size={20} style={{ color: colors.primary }} className="mr-2" />
          {t('dashboard.export.title')}
          <span
            className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: `${PREMIUM_COLORS.gold}20`, color: PREMIUM_COLORS.gold }}
          >
            <Crown size={10} />
            Premium
          </span>
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-snug">
          {t('dashboard.export.description')}
        </p>

        {/* Format chips — muted preview */}
        <div className="flex gap-2 flex-wrap mb-4">
          {FORMATS.map(({ id, icon: Icon, labelKey }) => (
            <div
              key={id}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-slate-700/50 select-none"
            >
              <Icon size={13} />
              {t(labelKey)}
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={openPremiumModal}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: `linear-gradient(135deg, ${PREMIUM_COLORS.gold}, #f59e0b)`, color: '#1a1100' }}
        >
          <Sparkles size={15} />
          {t('premium.hero.unlockPremium')}
        </button>
      </Card>
    );
  }

  /* ─── UNLOCKED (premium) ─── */
  return (
    <Card variant="transparent">
      {/* Header */}
      <h3 className="text-lg font-semibold mb-1 flex items-center">
        <Download size={20} style={{ color: colors.primary }} className="mr-2" />
        {t('dashboard.export.title')}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-snug">
        {t('dashboard.export.description')}
      </p>

      {/* Formatos: ocupan todo el ancho en grid de 3 columnas, pero con altura
          compacta (chip horizontal). Sin selección por defecto. */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {FORMATS.map(({ id, icon: Icon, labelKey }) => {
          const active = selectedFormat === id;
          return (
            <button
              key={id}
              onClick={() => setSelectedFormat(id)}
              disabled={isExporting}
              className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
              style={
                active
                  ? {
                      backgroundColor: `${colors.primary}15`,
                      color: colors.primary,
                      borderColor: colors.primary,
                    }
                  : {
                      backgroundColor: 'transparent',
                      color: colors.textSecondary,
                      borderColor: colors.border,
                    }
              }
            >
              <Icon size={13} />
              {t(labelKey)}
            </button>
          );
        })}
      </div>

      {/* Botón Exportar — mismo tamaño que el Live Mode de QuickActions
          (px-3 py-3 rounded-xl). Inactivo hasta que se elija un formato. */}
      <motion.button
        onClick={handleExport}
        disabled={isExporting || !selectedFormat}
        className="flex items-center justify-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: selectedFormat
            ? `linear-gradient(135deg, ${colors.primary}, ${colors.primary}cc)`
            : '#9CA3AF',
        }}
        whileHover={selectedFormat && !isExporting ? { scale: 1.02 } : undefined}
        whileTap={selectedFormat && !isExporting ? { scale: 0.98 } : undefined}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isExporting ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
              style={{ animation: 'spin 0.7s linear infinite' }}
            />
          ) : (
            <motion.div
              key="icon"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
            >
              <Download size={15} />
            </motion.div>
          )}
        </AnimatePresence>
        {isExporting ? t('common.loading') : t('dashboard.export.title')}
      </motion.button>
    </Card>
  );
};

export default ExportReportCard;
