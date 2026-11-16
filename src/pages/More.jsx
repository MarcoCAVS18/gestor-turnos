// src/pages/More.jsx
// Hub móvil "Más" (patrón Planday): agrupa Estadísticas, Cuenta y Aplicación.
// Solo existe en mobile — en desktop el sidebar ya enlaza todo esto, así que
// cualquier acceso directo a /more redirige al dashboard.
// Resúmenes y Recibos & registros son grupos expandibles EN esta página
// (no navegan): sus hijas se muestran como filas del mismo estilo del hub.

import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart2,
  FileText,
  Bike,
  Globe,
  Settings,
  Crown,
  Plug,
  HelpCircle,
  BookOpen,
  Info,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { usePremium, PREMIUM_COLORS } from '../contexts/PremiumContext';
import { useAustralia88 } from '../hooks/useAustralia88';
import PageHeader from '../components/layout/PageHeader';
import MoreMenuRow from '../components/more/MoreMenuRow';

const More = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { deliveryEnabled } = useApp();
  const { isPremium } = usePremium();
  const { isAustraliaMode, hasEligibleWorks } = useAustralia88();

  // Grupo expandido dentro de la sección Estadísticas ('summaries' | 'payslips')
  const [openGroup, setOpenGroup] = useState(null);
  const toggleGroup = (key) => setOpenGroup((prev) => (prev === key ? null : key));

  // Chequeo síncrono (no useIsMobile: su primer render devuelve false y
  // redirigiría también en móvil). /more es ruta protegida, nunca se prerenderiza.
  if (window.innerWidth >= 768) {
    return <Navigate to="/dashboard" replace />;
  }

  const statGroups = [
    {
      key: 'summaries',
      icon: BarChart2,
      label: t('statsHub.title'),
      children: [
        { label: t('yourHours.title'), to: '/statistics/hours' },
        { label: t('statsHub.weekly'), to: '/statistics/weekly' },
        { label: t('statsHub.monthly'), to: '/statistics/monthly', crown: !isPremium },
      ],
    },
    {
      key: 'payslips',
      icon: FileText,
      label: t('payslip.title'),
      children: [
        { label: t('payslipNav.documents'), to: '/statistics/payslips' },
        { label: t('payslipNav.calculations'), to: '/statistics/payslips/calculations' },
      ],
    },
  ];

  const sections = [
    {
      key: 'account',
      title: t('more.sections.account'),
      rows: [
        { icon: Settings, label: t('nav.settings'), to: '/settings' },
        { icon: Crown, label: t('more.manageAccount'), to: '/premium' },
        { icon: Plug, label: t('nav.integrations'), to: '/integrations', state: { from: '/more' } },
      ],
    },
    {
      key: 'app',
      title: t('more.sections.app'),
      rows: [
        { icon: HelpCircle, label: t('more.needHelp'), to: '/support', state: { from: '/more' } },
        { icon: BookOpen, label: t('more.faq'), to: '/faq', state: { fromApp: true } },
        { icon: Info, label: t('more.about'), to: '/about', state: { from: '/more' } },
      ],
    },
  ];

  const renderChildRow = ({ label, to, crown }) => (
    <button
      key={to}
      type="button"
      onClick={() => navigate(to)}
      className="w-full flex items-center gap-3 pl-14 pr-4 py-3 text-left transition-colors active:bg-gray-50 dark:active:bg-slate-800"
    >
      <span className="flex-1 font-medium text-gray-700 dark:text-slate-200">{label}</span>
      {crown && <Crown size={12} style={{ color: PREMIUM_COLORS.gold }} className="flex-shrink-0" />}
      <ChevronRight size={16} className="text-gray-400 dark:text-slate-500 flex-shrink-0" />
    </button>
  );

  return (
    <div className="py-6 space-y-6">
      <Helmet>
        <title>{`${t('more.title')} - Orary`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <PageHeader
        icon={MoreHorizontal}
        title={t('more.title')}
        subtitle={t('more.subtitle')}
      />

      {/* Sección Estadísticas: grupos expandibles + Delivery */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <h2 className="px-1 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
          {t('nav.statistics')}
        </h2>
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm divide-y divide-gray-100 dark:divide-slate-800 overflow-hidden">
          {statGroups.map(({ key, icon: Icon, label, children }) => (
            <div key={key}>
              <button
                type="button"
                onClick={() => toggleGroup(key)}
                aria-expanded={openGroup === key}
                className="w-full flex items-center gap-4 px-4 py-4 text-left transition-colors active:bg-gray-50 dark:active:bg-slate-800"
              >
                <Icon size={20} className="flex-shrink-0 text-gray-500 dark:text-slate-400" />
                <span className="flex-1 font-medium text-gray-900 dark:text-white">{label}</span>
                <ChevronDown
                  size={18}
                  className={`text-gray-400 dark:text-slate-500 transition-transform duration-200 ${openGroup === key ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openGroup === key && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    {children.map(renderChildRow)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {deliveryEnabled && (
            <MoreMenuRow
              icon={Bike}
              label={t('statistics.tabs.delivery')}
              onClick={() => navigate('/statistics/delivery')}
            />
          )}

          {isAustraliaMode && hasEligibleWorks && (
            <MoreMenuRow
              icon={Globe}
              label={t('australia88.visaTitle')}
              onClick={() => navigate('/statistics/australia88')}
            />
          )}
        </div>
      </motion.section>

      {sections.map((section, i) => (
        <motion.section
          key={section.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: (i + 1) * 0.05 }}
        >
          <h2 className="px-1 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
            {section.title}
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm divide-y divide-gray-100 dark:divide-slate-800 overflow-hidden">
            {section.rows.map(({ icon, label, to, state }) => (
              <MoreMenuRow
                key={to}
                icon={icon}
                label={label}
                onClick={() => navigate(to, state ? { state } : undefined)}
              />
            ))}
          </div>
        </motion.section>
      ))}
    </div>
  );
};

export default More;
