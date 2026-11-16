// src/components/ui/LogoLoaderModal/index.jsx
// Reusable full-screen loading modal styled like the Live Mode modal:
// a primary-colour gradient card with soft light blobs and white text, with the
// animated Orary logo (its three round shapes pulse in sequence) above a title
// and a message. Used e.g. while verifying an uploaded payslip.
//
// Props:
//   isOpen   - show/hide (exit animation handled via AnimatePresence)
//   title    - bold heading (e.g. "One moment")
//   message  - smaller line below the title
//   steps    - optional [{ title, message }]; when given, the text cycles every
//              `intervalMs` (erase + show next) and holds on the last step —
//              reassuring copy for long waits like OCR.
//   intervalMs - ms between steps (default 2800)
//   logoColor - logo fill (defaults to white, to sit on the gradient)

import React, { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { generateColorVariations } from '../../../utils/colorUtils';

// Paths taken verbatim from public/assets/SVG/logo.svg (viewBox 852.69 x 852.17).
const BASE_PATH = 'M137.67,342.17v48.69c0,7.27,16.89,27.07,23.06,31.59,30.56,22.44,52.4.71,82.43-4.68,37.45-6.73,72.35,4.24,102.01,26.88,6.86-2.2,11.54-7.66,17.96-11.11,42.52-22.91,82.72-24.44,125.25-.49,4.59,2.58,15.31,12.09,19.04,11.72,29.6-22.6,64.77-33.71,102.14-26.99,29.96,5.39,51.6,27.31,82.43,4.68,6.17-4.54,23.06-24.32,23.06-31.59v-48.69h30.74v45.27c0,27.91-27.51,58.87-52.51,68.77-49.09,19.45-73.11-13.95-115.74-9.82-15.97,1.55-40.59,11.56-50.19,24.44,8.98,13.43,15.39,29.21,18.1,45.21,5.07,29.92-1.37,61.43-37.94,62-57.59.89-43.23-77.02-21.5-108.39-25.77-25.43-67.13-30.2-99.32-14.23-7.8,3.87-12.77,9.19-20.02,13.35,3.21,9.74,9.26,17.2,12.62,27.22,9.86,29.39,13.39,77.57-27.47,81.71-61.72,6.24-50.7-73.58-26.48-106.86-9.81-13.04-33.73-22.84-50.19-24.44-43.8-4.24-66.18,29.45-115.74,9.82-24.99-9.9-52.51-40.86-52.51-68.77v-45.27h30.77ZM347.75,497.63c-2.99-2.87-5.8,6.48-6.41,8.08-3.05,8.06-11.25,39.22.46,41.47,25.23,4.83,10.08-37.77,5.94-49.55h0ZM514.74,545.02c5.52-5.8-.97-37.61-5.05-44.46-1.3-2.18-1.71-3.53-4.73-2.93-3.42,11.29-17.45,46.02-.06,50.57,2.49.71,8.44-1.69,9.86-3.18h-.01Z';

// The three round "o" shapes, left → middle → right, with staggered delays.
const CIRCLES = [
  { d: 'M263.69,274.32c85.8-1.47,90.86,124.78,11.46,132.76-98.24,9.87-99.63-131.26-11.46-132.76h0ZM261.93,305c-31.36,4.33-45.03,42.29-20.08,63.68,30.65,26.28,74.21-8.29,55.36-45.12-6.15-12.01-21.87-20.42-35.28-18.56h0Z', delay: 0 },
  { d: 'M420.89,274.33c86.69-6.01,97.59,122.97,16.38,132.58-96.24,11.37-103.02-126.57-16.38-132.58h0ZM422.54,305.02c-46.86,5.76-40.45,74.05,4.59,73.07,49.6-1.08,44.36-79.09-4.59-73.07h0Z', delay: 0.15 },
  { d: 'M586.37,274.5c85.87-1.33,88.05,124.8,11.64,132.58-99.95,10.16-101.11-131.18-11.64-132.58ZM581.36,305.01c-54.85,8.96-26.85,95.94,23.56,67.98,36.43-20.21,14.99-74.27-23.56-67.98h0Z', delay: 0.3 },
];

export const OraryLogoLoader = ({ size = 84, color }) => {
  const colors = useThemeColors();
  const fill = color || colors?.primary || '#EC4899';

  return (
    <svg width={size} height={size} viewBox="0 0 852.69 852.17" role="img" aria-label="Orary">
      <path d={BASE_PATH} fill={fill} fillOpacity={0.85} fillRule="evenodd" />
      {CIRCLES.map((c, i) => (
        <motion.path
          key={i}
          d={c.d}
          fill={fill}
          fillRule="evenodd"
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          animate={{ scale: [1, 1.35, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut', delay: c.delay }}
        />
      ))}
    </svg>
  );
};

const LogoLoaderModal = ({ isOpen, title, message, steps = null, intervalMs = 2800, logoColor = '#ffffff' }) => {
  const colors = useThemeColors();

  // Cycle through `steps` while open; hold on the last one.
  const hasSteps = Array.isArray(steps) && steps.length > 0;
  const [stepIndex, setStepIndex] = useState(0);
  useEffect(() => {
    if (!isOpen || !hasSteps || steps.length <= 1) return undefined;
    setStepIndex(0);
    const id = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    }, intervalMs);
    return () => clearInterval(id);
  }, [isOpen, hasSteps, steps, intervalMs]);

  const current = hasSteps ? steps[Math.min(stepIndex, steps.length - 1)] : { title, message };
  const stepKey = hasSteps ? stepIndex : 'static';

  const gradient = useMemo(() => {
    const palette = generateColorVariations(colors.primary) || {
      lighter: colors.primary,
      darker: colors.primaryDark,
    };
    return `linear-gradient(135deg, ${palette.lighter} 0%, ${colors.primary} 50%, ${palette.darker} 100%)`;
  }, [colors.primary, colors.primaryDark]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          style={{ zIndex: 9999 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="relative overflow-hidden w-full max-w-md rounded-2xl"
            style={{ background: gradient }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            {/* Light effects (same language as the Live Mode modal) */}
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-32 h-32 bg-white opacity-5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 px-8 py-12 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-3xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <OraryLogoLoader size={72} color={logoColor} />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={stepKey}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  {current.title && (
                    <h3 className="mt-7 text-2xl font-bold text-white tracking-tight">{current.title}</h3>
                  )}
                  {current.message && (
                    <p className="mt-2 text-sm text-white/80 leading-relaxed max-w-[16rem] mx-auto">{current.message}</p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default LogoLoaderModal;
