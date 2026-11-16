// src/pages/StatisticsPayslips.jsx
// Sub-página de Estadísticas: Recibos & Registros → DOCUMENTOS.
// Ruta: /statistics/payslips
// Acá el usuario agrega/edita sus recibos y ve el resumen (donut + lista).
// Los cálculos detallados viven en /statistics/payslips/calculations.

import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText, Calculator, ChevronRight } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import PayslipCard from '../components/stats/PayslipCard';

const StatisticsPayslips = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Orary — {t('payslipNav.documents')}</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="px-4 py-6 space-y-6">
        <PageHeader
          icon={FileText}
          title={t('payslipNav.documents')}
          subtitle={t('payslip.subtitle')}
        />

        <PayslipCard showCalculations={false} />

        {/* Acceso a Cálculos — solo móvil; en desktop el sidebar tiene la subclase */}
        <button
          type="button"
          onClick={() => navigate('/statistics/payslips/calculations')}
          className="md:hidden w-full flex items-center gap-4 px-4 py-4 text-left bg-white dark:bg-slate-900 rounded-2xl shadow-sm active:bg-gray-50 dark:active:bg-slate-800 transition-colors"
        >
          <Calculator size={20} className="flex-shrink-0 text-gray-500 dark:text-slate-400" />
          <span className="flex-1 font-medium text-gray-900 dark:text-white">
            {t('payslipNav.calculations')}
          </span>
          <ChevronRight size={18} className="text-gray-400 dark:text-slate-500" />
        </button>
      </div>
    </>
  );
};

export default StatisticsPayslips;
