// src/pages/ServerError.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../hooks/useThemeColors';
import Button from '../components/ui/Button';

const ServerError = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const colors = useThemeColors();

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center"
      >
        {/* SVG Illustration */}
        <div className="mb-8 flex justify-center">
          <img
            src="/assets/SVG/error.svg"
            alt="Server Error"
            className="w-full max-w-md h-auto"
          />
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white"
        >
          {t('serverError.title')}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto"
        >
          {t('serverError.description')}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            onClick={handleRefresh}
            variant="primary"
            size="lg"
            icon={RefreshCw}
            iconPosition="left"
            themeColor={colors.primary}
            className="min-w-[200px]"
          >
            {t('serverError.refresh')}
          </Button>

          <Button
            onClick={handleGoHome}
            variant="ghost"
            size="lg"
            icon={Home}
            iconPosition="left"
            className="min-w-[200px] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            {t('serverError.goHome')}
          </Button>
        </motion.div>

        {/* Additional Help Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-sm text-gray-500 dark:text-gray-500"
        >
          {t('serverError.support')}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ServerError;
