// src/pages/Support.jsx

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Crown, MessageSquare, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../hooks/useThemeColors';
import { usePremium } from '../contexts/PremiumContext';
import { useAuth } from '../contexts/AuthContext';
import { sendSupportRequest } from '../services/supportService';
import BackLink from '../components/ui/BackLink';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import AboutFooter from '../components/about/AboutFooter';

const SUBJECT_MAX = 120;
const MESSAGE_MAX = 3000;

const Support = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { isPremium } = usePremium();
  const { currentUser } = useAuth();

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [view, setView] = useState('form'); // 'form' | 'sending' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const isValid = subject.trim().length >= 3 && message.trim().length >= 10;

  const handleSubmit = async () => {
    if (!isValid || view === 'sending') return;
    setView('sending');
    setErrorMsg('');
    try {
      await sendSupportRequest({ subject: subject.trim(), message: message.trim() });
      setView('success');
    } catch (err) {
      const code = err?.code || '';
      if (code === 'functions/resource-exhausted') {
        setErrorMsg(t('support.errorRateLimit'));
      } else {
        setErrorMsg(t('support.errorGeneric'));
      }
      setView('error');
    }
  };

  const handleReset = () => {
    setSubject('');
    setMessage('');
    setErrorMsg('');
    setView('form');
  };

  const blurVariants = {
    initial: { opacity: 0, scale: 0.97, filter: 'blur(4px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit:    { opacity: 0, scale: 1.02, filter: 'blur(4px)' },
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <Helmet>
        <title>Support - Orary</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <BackLink to="/settings">{t('common.backToSettings')}</BackLink>

      {/* Header — logo reutilizado igual que HeroSection */}
      <motion.div
        className="text-center py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img
          src="/assets/SVG/logo.svg"
          alt="Orary"
          className="w-16 h-16 mx-auto mb-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        />
        <motion.h1
          className="text-2xl font-bold mb-1"
          style={{ color: colors.text }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          {t('support.title')}
        </motion.h1>
        <motion.p
          className="text-sm"
          style={{ color: colors.textSecondary }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          {t('support.subtitle')}
        </motion.p>
      </motion.div>

      {/* Premium badge */}
      {isPremium && (
        <motion.div
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
          style={{ backgroundColor: '#FFF3CD', color: '#D4A000' }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Crown size={15} className="fill-current shrink-0" />
          <span>{t('support.premiumBadge')}</span>
        </motion.div>
      )}

      {/* Form card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card variant="surface" padding="none" className="overflow-hidden">
          <div className="p-6 min-h-[320px] flex flex-col">
            <AnimatePresence mode="wait">

              {/* ── FORM ── */}
              {(view === 'form' || view === 'sending' || view === 'error') && (
                <motion.div
                  key="form"
                  variants={blurVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  className="flex flex-col flex-1 gap-4"
                >
                  {/* Section label */}
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} style={{ color: colors.primary }} />
                    <span className="text-sm font-semibold" style={{ color: colors.text }}>
                      {t('support.formTitle')}
                    </span>
                  </div>

                  {/* Error banner */}
                  <AnimatePresence>
                    {view === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm"
                        style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}
                      >
                        <AlertCircle size={15} className="shrink-0" />
                        <span>{errorMsg}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Subject */}
                  <div>
                    <label
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: colors.textSecondary }}
                    >
                      {t('support.subjectLabel')}
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value.slice(0, SUBJECT_MAX))}
                      placeholder={t('support.subjectPlaceholder')}
                      disabled={view === 'sending'}
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:opacity-50"
                      style={{
                        color: colors.text,
                        '--tw-ring-color': colors.primary,
                        fontSize: '16px',
                      }}
                    />
                    <p className="text-right text-[10px] mt-1" style={{ color: colors.textSecondary, opacity: 0.6 }}>
                      {subject.length}/{SUBJECT_MAX}
                    </p>
                  </div>

                  {/* Message */}
                  <div className="flex-1 flex flex-col">
                    <label
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: colors.textSecondary }}
                    >
                      {t('support.messageLabel')}
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value.slice(0, MESSAGE_MAX))}
                      placeholder={t('support.messagePlaceholder')}
                      disabled={view === 'sending'}
                      rows={5}
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:opacity-50 flex-1"
                      style={{
                        color: colors.text,
                        '--tw-ring-color': colors.primary,
                        fontSize: '16px',
                      }}
                    />
                    <p className="text-right text-[10px] mt-1" style={{ color: colors.textSecondary, opacity: 0.6 }}>
                      {message.length}/{MESSAGE_MAX}
                    </p>
                  </div>

                  {/* Reply-to info */}
                  <p className="text-xs" style={{ color: colors.textSecondary, opacity: 0.7 }}>
                    {t('support.replyTo')} <span className="font-medium">{currentUser?.email}</span>
                  </p>

                  {/* Submit */}
                  <Button
                    onClick={handleSubmit}
                    disabled={!isValid}
                    loading={view === 'sending'}
                    loadingText={t('support.sending')}
                    icon={Send}
                    iconPosition="left"
                    themeColor={colors.primary}
                    className="w-full"
                  >
                    {t('support.send')}
                  </Button>
                </motion.div>
              )}

              {/* ── SUCCESS ── */}
              {view === 'success' && (
                <motion.div
                  key="success"
                  variants={blurVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  className="flex flex-col items-center justify-center flex-1 text-center gap-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                  >
                    <CheckCircle size={52} style={{ color: colors.primary }} />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold mb-1" style={{ color: colors.text }}>
                      {t('support.successTitle')}
                    </h3>
                    <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: colors.textSecondary }}>
                      {isPremium ? t('support.successDescPremium') : t('support.successDesc')}
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-xs font-medium transition-opacity hover:opacity-70 mt-2"
                    style={{ color: colors.primary }}
                  >
                    {t('support.sendAnother')}
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </Card>
      </motion.div>

      {/* Footer reutilizado de About */}
      <AboutFooter colors={colors} />
    </div>
  );
};

export default Support;
