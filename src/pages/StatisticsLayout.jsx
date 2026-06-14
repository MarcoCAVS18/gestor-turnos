// src/pages/StatisticsLayout.jsx
// Layout para las rutas anidadas de Estadísticas:
//   /statistics          → Statistics.jsx (charts, grids, delivery)
//   /statistics/payslips → StatisticsPayslips.jsx (PayslipCard)
//
// En mobile muestra un tab switcher interno (mismo patrón que Integrations).
// En desktop el sub-menú del sidebar maneja la navegación — el switcher se oculta.

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BarChart2, FileText } from 'lucide-react';

const TABS = [
  { key: 'overview', path: '/statistics',          icon: BarChart2, labelKey: 'nav.statistics' },
  { key: 'payslips', path: '/statistics/payslips', icon: FileText,  labelKey: 'payslip.title'  },
];

const StatisticsLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = location.pathname === '/statistics/payslips' ? 'payslips' : 'overview';

  return (
    <div>
      {/* Tab switcher — solo visible en mobile/tablet.
          En desktop el sidebar ya muestra los sub-ítems. */}
      <div className="md:hidden px-4 pt-4">
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl w-fit">
          {TABS.map(({ key, path, icon: Icon, labelKey }) => (
            <button
              key={key}
              onClick={() => navigate(path)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === key
                  ? 'bg-white dark:bg-slate-700 shadow text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
              }`}
            >
              <Icon size={15} />
              {t(labelKey)}
            </button>
          ))}
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export default StatisticsLayout;
