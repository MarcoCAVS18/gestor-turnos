// src/components/modals/liveMode/LiveModeFinishConfirmModal/index.jsx
// Modal to confirm finishing a Live Mode session - Styled like FeatureAnnouncementCard

import React, { useMemo, useState } from 'react';
import { CheckCircle, Clock, DollarSign, Briefcase, AlertCircle, X, Timer, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../../ui/Button';
import Flex from '../../../ui/Flex';
import Switch from '../../../ui/Switch';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { generateColorVariations } from '../../../../utils/colorUtils';

const LiveModeFinishConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  sessionData = {},
}) => {
  const colors = useThemeColors();
  const isMobile = useIsMobile();

  const {
    time = '00:00:00',
    earnings = '$0.00',
    workName = 'Work',
    shouldOfferSmoko = false,
    smokoMinutes = 30,
  } = sessionData;

  // State for smoko deduction toggle
  const [deductSmoko, setDeductSmoko] = useState(shouldOfferSmoko);

  const palette = useMemo(() => {
    return generateColorVariations(colors.primary) || {
      lighter: colors.primary,
      base: colors.primary,
      dark: colors.primaryDark,
      darker: colors.primaryDark
    };
  }, [colors.primary, colors.primaryDark]);

  const gradient = `linear-gradient(135deg, ${palette.lighter} 0%, ${colors.primary} 50%, ${palette.darker} 100%)`;

  if (!isOpen) return null;

  return (
    <Flex
      variant="center"
      className="fixed inset-0 bg-black/70 backdrop-blur-sm p-4"
      style={{ zIndex: 10000 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className={`
          relative overflow-hidden w-full
          ${isMobile ? 'max-w-sm mx-2 rounded-2xl' : 'max-w-sm rounded-2xl'}
        `}
        style={{ background: gradient }}
      >
        {/* Decorative background icon */}
        <Timer
          className="absolute -right-4 -bottom-4 text-white/5"
          size={100}
          strokeWidth={1}
          style={{ transform: 'rotate(-20deg)' }}
        />

        {/* Light effects */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white opacity-5 rounded-full blur-2xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="p-6 pb-4 text-center">
            <div className="flex justify-end mb-2">
              <button
                onClick={onClose}
                disabled={loading}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X size={16} className="text-white" />
              </button>
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
              className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 mx-auto mb-4 flex items-center justify-center"
            >
              <CheckCircle size={32} className="text-white" />
            </motion.div>

            <h2 className="text-xl font-bold text-white mb-2">
              Finish Live Shift?
            </h2>
            <p className="text-white/70 text-sm">
              Your shift will be saved with these details
            </p>
          </div>

          {/* Session Summary */}
          <div className="px-6 pb-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-3 border border-white/20">
              {/* Work name */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Briefcase size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/60">Work</p>
                  <p className="font-medium text-white">{workName}</p>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Clock size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/60">Duration</p>
                  <p className="font-medium text-white font-mono">{time}</p>
                </div>
              </div>

              {/* Earnings */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <DollarSign size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/60">Estimated Earnings</p>
                  <p className="font-bold text-lg text-white">{earnings}</p>
                </div>
              </div>
            </div>

            {/* Smoko deduction option */}
            {shouldOfferSmoko && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/30 flex items-center justify-center">
                      <Coffee size={18} className="text-yellow-300" />
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">Deduct smoko?</p>
                      <p className="text-xs text-white/60">
                        No breaks recorded • -{smokoMinutes} min
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={deductSmoko}
                    onChange={setDeductSmoko}
                  />
                </div>
              </motion.div>
            )}

            {/* Info note */}
            <div className="flex items-start gap-2 mt-4 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <AlertCircle size={16} className="text-yellow-300 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-white/80">
                This shift will be saved to your history and marked as a live-tracked shift.
                {deductSmoko && shouldOfferSmoko && ` ${smokoMinutes} minutes will be deducted for break time.`}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 pt-2 flex gap-3">
            <Button
              variant="solid"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white border-none"
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              onClick={() => onConfirm(deductSmoko)}
              loading={loading}
              loadingText="Saving..."
              disabled={loading}
              className="flex-1 bg-white hover:bg-gray-50 font-semibold shadow-lg"
              themeColor={colors.primary}
              icon={CheckCircle}
            >
              Finish
            </Button>
          </div>
        </div>
      </motion.div>
    </Flex>
  );
};

export default LiveModeFinishConfirmModal;
