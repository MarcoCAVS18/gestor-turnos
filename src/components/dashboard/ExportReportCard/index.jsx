// src/components/dashboard/ExportReportCard/index.jsx

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Download,
  FileText,
  FileDown,
  Image,
  FileSpreadsheet,
  Crown
} from 'lucide-react';

import { motion } from 'framer-motion';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { usePremium, PREMIUM_COLORS } from '../../../contexts/PremiumContext';

import Card from '../../ui/Card';
import Flex from '../../ui/Flex';
import Button from '../../ui/Button';
import logger from '../../../utils/logger';

const ExportReportCard = ({ onExport }) => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { isPremium, openPremiumModal } = usePremium();

  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (isExporting) return;

    setIsExporting(true);

    try {
      await onExport(selectedFormat);
    } catch (error) {
      logger.error('Error exporting:', error);
    } finally {
      setTimeout(() => {
        setIsExporting(false);
      }, 1200);
    }
  };

  // Premium locked state for non-premium users
  if (!isPremium) {
    return (
      <Card variant="transparent" className="relative overflow-hidden">
        {/* Blur overlay */}
        <div className="absolute inset-0 backdrop-blur-[3px] bg-white/70 dark:bg-slate-800/70 z-10 rounded-xl pointer-events-none" />

        {/* Blurred content preview */}
        <div className="opacity-40 pointer-events-none select-none" aria-hidden="true">
          <Flex variant="between" className="items-start gap-4">
            <div className="flex-1 pr-4">
              <Flex variant="start" className="gap-2 mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center">
                  <FileDown size={18} style={{ color: colors.primary }} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {t('dashboard.export.title')}
                </h3>
              </Flex>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                {t('dashboard.export.description')}
              </p>
              <div className="flex gap-2 flex-wrap">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-500">
                  <FileText size={16} />
                  <span className="text-sm font-medium">PDF</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-500">
                  <Image size={16} />
                  <span className="text-sm font-medium">PNG</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-gray-300 dark:border-slate-600 text-gray-400" />
            </div>
          </Flex>
        </div>

        {/* CTA overlay — horizontal layout for wide card */}
        <div className="absolute inset-0 z-20 flex items-center justify-between gap-4 px-6">
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg"
            style={{ background: `linear-gradient(135deg, ${PREMIUM_COLORS.gold}33, ${PREMIUM_COLORS.gold}66)` }}
          >
            <Crown size={24} style={{ color: PREMIUM_COLORS.gold }} />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-gray-800 dark:text-gray-100 mb-0.5">
              {t('dashboard.export.title')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug">
              {t('dashboard.export.description')}
            </p>
          </div>

          {/* Button */}
          <button
            onClick={openPremiumModal}
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold shadow-md transition-transform hover:scale-105 active:scale-95"
            style={{ background: `linear-gradient(135deg, ${PREMIUM_COLORS.gold}, #f59e0b)`, color: '#1a1100' }}
          >
            <Crown size={15} />
            {t('premium.hero.unlockPremium')}
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="transparent" className="relative overflow-hidden">
      <Flex variant="between" className="items-start gap-4">
        {/* Left side */}
        <div className="flex-1 pr-4">
              <Flex variant="start" className="gap-2 mb-2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                >
                  <FileDown size={18} style={{ color: colors.primary }} />
                </div>

                <h3 className="text-lg font-semibold text-gray-800">
                  {t('dashboard.export.title')}
                </h3>
              </Flex>

          <p className="text-sm text-gray-700 mb-4">
            {t('dashboard.export.description')}
          </p>

          {/* Format selector */}
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => setSelectedFormat('pdf')}
              disabled={isExporting}
              variant={selectedFormat === 'pdf' ? 'solid' : 'outline'}
              themeColor={colors.primary}
              icon={FileText}
              iconPosition="left"
              className="px-4"
            >
              {t('dashboard.export.formats.pdf')}
            </Button>

            <Button
              onClick={() => setSelectedFormat('png')}
              disabled={isExporting}
              variant={selectedFormat === 'png' ? 'solid' : 'outline'}
              themeColor={colors.primary}
              icon={Image}
              iconPosition="left"
              className="px-4"
            >
              {t('dashboard.export.formats.png')}
            </Button>

            <Button
              onClick={() => setSelectedFormat('xlsx')}
              disabled={isExporting}
              variant={selectedFormat === 'xlsx' ? 'solid' : 'outline'}
              themeColor={colors.primary}
              icon={FileSpreadsheet}
              iconPosition="left"
              className="px-4"
            >
              {t('dashboard.export.formats.excel')}
            </Button>
          </div>
        </div>

        {/* Right side: Export button */}
        <div className="flex-shrink-0">
          <motion.button
            onClick={handleExport}
            disabled={isExporting}
            className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-2"
            style={{
              borderColor: colors.primary,
              color: colors.primary,
              backgroundColor: isExporting ? `${colors.primary}10` : 'transparent',
            }}
          >
            {/* Animated Download Icon */}
            <motion.div
              animate={
                isExporting
                  ? { y: [0, 10, 0], opacity: [1, 0.6, 1] }
                  : { y: 0, opacity: 1 }
              }
              transition={
                isExporting
                  ? { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 0.2 }
              }
            >
              <Download size={24} />
            </motion.div>

            {/* Rotating ring when exporting */}
            {isExporting && (
              <motion.div
                className="absolute inset-0 rounded-full border-2"
                style={{
                  borderColor: `${colors.primary}30`,
                  borderTopColor: colors.primary,
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </motion.button>
        </div>
      </Flex>
    </Card>
  );
};

export default ExportReportCard;
