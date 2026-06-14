// src/pages/StatisticsPayslips.jsx
// Sub-página de Estadísticas: Recibos & Registros.
// Ruta: /statistics/payslips

import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import PayslipCard from '../components/stats/PayslipCard';

const StatisticsPayslips = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Orary — {t('payslip.title')}</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="px-4 py-6 space-y-6">
        <PageHeader
          icon={FileText}
          title={t('payslip.title')}
          subtitle={t('payslip.subtitle')}
        />

        <PayslipCard />
      </div>
    </>
  );
};

export default StatisticsPayslips;
