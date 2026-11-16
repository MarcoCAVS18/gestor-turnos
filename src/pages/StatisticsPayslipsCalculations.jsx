// src/pages/StatisticsPayslipsCalculations.jsx
// Sub-página de Estadísticas: Recibos & Registros → CÁLCULOS.
// Ruta: /statistics/payslips/calculations
// Vista de solo lectura con los cálculos de los recibos: resumen por recibo,
// desglose por período y proyección del año fiscal. Los documentos se
// gestionan en /statistics/payslips. Base futura del detector de
// discrepancias nómina vs horas (STATS_EXPANSION_ROADMAP §4.1).

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calculator, FileText, ExternalLink, ChevronRight } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import BackLink from '../components/ui/BackLink';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import PayslipHero from '../components/stats/PayslipCard/PayslipHero';
import PayslipAccordions from '../components/stats/PayslipCard/PayslipAccordions';
import PayslipSummaryCard from '../components/stats/PayslipCard/PayslipSummaryCard';
import { usePayslipsData } from '../hooks/usePayslipsData';
import { useThemeColors } from '../hooks/useThemeColors';

const FY_LINKS = {
  AU: 'https://www.ato.gov.au/individuals-and-families/your-tax-return/how-to-lodge-your-tax-return/lodge-your-tax-return-online-with-mytax',
  NZ: 'https://www.ird.govt.nz/myir',
  GB: 'https://www.gov.uk/personal-tax-account',
  IE: 'https://www.revenue.ie/en/online-services/index.aspx',
};

const StatisticsPayslipsCalculations = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const colors = useThemeColors();
  const {
    completePayslips,
    country,
    formatMoney,
    aggregate,
    breakdown,
    fiscalSummary,
    coverageByPayslipId,
  } = usePayslipsData();

  // En esta página los acordeones arrancan abiertos: los cálculos SON el contenido
  const [expanded, setExpanded] = useState({ breakdown: true, fy: true });
  const toggleExpanded = (key) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  // Hero (donut): 'total' agrega todos los recibos; 'detail' muestra el último
  const [heroMode, setHeroMode] = useState('total');
  const toggleHeroMode = () =>
    setHeroMode((prev) => (prev === 'total' ? 'detail' : 'total'));

  const hasData = completePayslips.length > 0;

  return (
    <>
      <Helmet>
        <title>Orary — {t('payslipNav.calculations')}</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="px-4 py-6 space-y-6">
        {/* Back a Documentos — solo móvil; en desktop navega el sidebar */}
        <div className="md:hidden">
          <BackLink to="/statistics/payslips">{t('common.back')}</BackLink>
        </div>

        <PageHeader
          icon={Calculator}
          title={t('payslipNav.calculations')}
          subtitle={t('payslipNav.calculationsSubtitle')}
        />

        {!hasData ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-8 text-center space-y-4"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
              style={{ backgroundColor: colors.transparent10 }}
            >
              <FileText size={26} style={{ color: colors.primary }} />
            </div>
            <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm mx-auto">
              {t('payslipNav.empty')}
            </p>
            <Button
              onClick={() => navigate('/statistics/payslips')}
              themeColor={colors.primary}
              icon={ChevronRight}
              className="mx-auto"
            >
              {t('payslipNav.documents')}
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Donut agregado (antes vivía en Documentos) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="p-4">
                <PayslipHero
                  aggregate={aggregate}
                  latestPayslip={completePayslips[0]}
                  formatMoney={formatMoney}
                  mode={heroMode}
                  onToggle={toggleHeroMode}
                  canToggle={completePayslips.length >= 1}
                />
              </Card>
            </motion.div>

            {/* Resumen por recibo */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {completePayslips.map((payslip, i) => (
                <motion.div
                  key={payslip.id || i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.3) }}
                >
                  <PayslipSummaryCard
                  payslip={payslip}
                  formatMoney={formatMoney}
                  coverage={coverageByPayslipId[payslip.id]}
                />
                </motion.div>
              ))}
            </div>

            {/* Desglose por período + año fiscal */}
            <PayslipAccordions
              breakdown={breakdown}
              fiscalSummary={fiscalSummary}
              aggregate={aggregate}
              formatMoney={formatMoney}
              expanded={expanded}
              onToggleExpanded={toggleExpanded}
            />

            {country && (
              <div className="space-y-1.5 px-1">
                <p className="text-[11px] text-gray-400 dark:text-gray-500 italic leading-relaxed">
                  {t(`payslip.fy.disclaimer${country}`)}
                </p>
                <a
                  href={FY_LINKS[country]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium hover:underline transition-colors"
                  style={{ color: colors.primary }}
                >
                  {t(`payslip.fy.link${country}`)}
                  <ExternalLink size={12} />
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default StatisticsPayslipsCalculations;
