// src/pages/StatisticsAustralia88.jsx
// Sub-página de Estadísticas dedicada al tracker de Working Holiday Visa (88 días).
// Ruta: /statistics/australia88 (visible solo si el modo Australia está activo
// y hay al menos un trabajo elegible — mismo gate que la card del Dashboard).
//
// Página delgada: solo compone componentes de src/components/australia88/,
// cada uno auto-contenido (llama a useAustralia88() por su cuenta).

import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { Globe } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import { useAustralia88 } from '../hooks/useAustralia88';
import Australia88ProgressSummary from '../components/australia88/Australia88ProgressSummary';
import Australia88WeeklyChart from '../components/australia88/Australia88WeeklyChart';
import Australia88MonthlyChart from '../components/australia88/Australia88MonthlyChart';
import Australia88LearnMore from '../components/australia88/Australia88LearnMore';

const StatisticsAustralia88 = () => {
  const { t } = useTranslation();
  const { isAustraliaMode, hasEligibleWorks } = useAustralia88();

  // Gate: only reachable in Australia mode with eligible work data.
  if (!isAustraliaMode || !hasEligibleWorks) return <Navigate to="/statistics" replace />;

  return (
    <>
      <Helmet>
        <title>{`${t('australia88.visaTitle')} - Orary`}</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="px-4 py-6 space-y-6">
        <PageHeader
          icon={Globe}
          title={t('australia88.visaTitle')}
          subtitle={t('australia88.stats.pageSubtitle')}
        />

        <Australia88ProgressSummary />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Australia88WeeklyChart />
          <Australia88MonthlyChart />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">
            {t('australia88.stats.learnTitle')}
          </h2>
          <Australia88LearnMore />
        </div>
      </div>
    </>
  );
};

export default StatisticsAustralia88;
