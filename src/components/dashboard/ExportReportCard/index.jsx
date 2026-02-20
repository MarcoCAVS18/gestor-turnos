// src/components/dashboard/ExportReportCard/index.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download,
  FileText,
  FileDown,
  Image,
  FileSpreadsheet,
  Lock,
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
  const colors = useThemeColors();
  const navigate = useNavigate();
  const { isPremium } = usePremium();

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
        <button onClick={() => navigate('/premium')} className="w-full text-left">
          {/* Blur overlay */}
          <div className="absolute inset-0 backdrop-blur-[2px] bg-white/60 z-10 rounded-xl" />

          {/* Lock badge */}
          <div
            className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ backgroundColor: `${PREMIUM_COLORS.gold}20` }}
          >
            <Crown size={14} style={{ color: PREMIUM_COLORS.gold }} />
            <span className="text-sm font-medium" style={{ color: PREMIUM_COLORS.primary }}>
              Premium
            </span>
          </div>

          {/* Blurred content preview */}
          <Flex variant="between" className="opacity-50">
            <div className="flex-1 pr-4">
              <Flex variant="start" className="gap-2 mb-2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: colors.transparent10 }}
                >
                  <FileDown size={18} style={{ color: colors.primary }} />
                </div>

                <h3 className="text-lg font-semibold text-gray-800">
                  Export Report
                </h3>
              </Flex>

              <p className="text-sm text-gray-700 mb-4">
                Download a complete summary of your statistics, shifts, and activity
              </p>

              <div className="flex gap-2 flex-wrap">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-500">
                  <FileText size={16} />
                  <span className="text-sm font-medium">PDF</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-500">
                  <Image size={16} />
                  <span className="text-sm font-medium">PNG</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-gray-300 text-gray-400">
                <Lock size={24} />
              </div>
            </div>
          </Flex>
        </button>
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
                  Export Report
                </h3>
              </Flex>

          <p className="text-sm text-gray-700 mb-4">
            Download a complete summary of your statistics, shifts, and activity
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
              PDF
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
              PNG
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
              Excel
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
