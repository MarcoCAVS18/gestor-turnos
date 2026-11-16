// src/pages/StatisticsDelivery.jsx
// Sub-página de Estadísticas dedicada a Delivery.
// Ruta: /statistics/delivery  (visible solo si delivery está activo)
//
// Tiene su propio selector de período (hoy / semana / 90 días / año) que es la
// ÚNICA fuente del período: todas las tarjetas se alimentan del mismo rango,
// resolviendo la mezcla de períodos que tenía la página semanal.

import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { Bike } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import { useApp } from '../contexts/AppContext';
import { useDeliveryContext } from '../contexts/DeliveryContext';
import { calculateDeliveryStats, getDeliveryPeriodRange } from '../services/calculationService';
import { getMileageRate } from '../constants/mileageRates';
import { useThemeColors } from '../hooks/useThemeColors';

import DeliverySummary from '../components/stats/DeliverySummary';
import PlatformComparison from '../components/stats/PlatformComparison';
import VehicleEfficiency from '../components/stats/VehicleEfficiency';
import FuelEfficiency from '../components/stats/FuelEfficiency';
import DeliveryHourlyAnalysis from '../components/stats/DeliveryHourlyAnalysis';

const PERIODS = [
  { id: 'today', labelKey: 'statistics.delivery.periods.today' },
  { id: 'week', labelKey: 'statistics.delivery.periods.week' },
  { id: '90days', labelKey: 'statistics.delivery.periods.days90' },
  { id: 'year', labelKey: 'statistics.delivery.periods.year' },
];

const StatisticsDelivery = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { deliveryEnabled, holidayCountry } = useApp();
  const { deliveryWork, deliveryShifts } = useDeliveryContext();

  const [period, setPeriod] = useState('week');

  const range = useMemo(() => getDeliveryPeriodRange(period), [period]);

  // Delivery shifts that fall inside the selected period — the one list every
  // card on this page is built from.
  const periodShifts = useMemo(() => {
    return (deliveryShifts || []).filter((s) => {
      const d = s.startDate || s.date;
      return d && d >= range.start && d <= range.end;
    });
  }, [deliveryShifts, range]);

  const deliveryStats = useMemo(() => {
    const mileageConfig = getMileageRate(holidayCountry);
    return calculateDeliveryStats({
      deliveryWork,
      deliveryShifts,
      startDate: range.start,
      endDate: range.end,
      mileageRate: mileageConfig?.ratePerKm || null,
    });
  }, [deliveryWork, deliveryShifts, range, holidayCountry]);

  // Gate: only reachable when delivery is enabled.
  if (!deliveryEnabled) return <Navigate to="/statistics" replace />;

  const hasAnyShift = (deliveryShifts || []).length > 0;
  const hasPeriodData = periodShifts.length > 0;

  return (
    <>
      <Helmet>
        <title>Orary — {t('statistics.delivery.title')}</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="px-4 py-6 space-y-6">
        <PageHeader
          icon={Bike}
          title={t('statistics.delivery.title')}
          subtitle={t('statistics.delivery.subtitle')}
        />

        {/* Period selector — single source of the period for the whole page */}
        <div className="flex flex-wrap gap-2 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl w-fit">
          {PERIODS.map(({ id, labelKey }) => (
            <button
              key={id}
              onClick={() => setPeriod(id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                period === id
                  ? 'bg-white dark:bg-slate-700 shadow text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
              }`}
              style={period === id ? { color: colors.primary } : undefined}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>

        {!hasAnyShift ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-10 text-center">
            <Bike size={32} className="mx-auto mb-3 text-gray-300 dark:text-slate-600" />
            <p className="text-sm text-gray-500 dark:text-slate-400">{t('statistics.delivery.empty')}</p>
          </div>
        ) : !hasPeriodData ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-10 text-center">
            <p className="text-sm text-gray-500 dark:text-slate-400">{t('statistics.delivery.emptyPeriod')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-stretch">
            <div className="flex flex-col gap-6 h-full">
              <DeliverySummary deliveryStats={deliveryStats} />
              <div className="flex-grow flex flex-col">
                <DeliveryHourlyAnalysis shifts={periodShifts} className="h-full" />
              </div>
            </div>
            <div className="flex flex-col gap-6 h-full">
              <PlatformComparison deliveryStats={deliveryStats} />
              <VehicleEfficiency vehicleStats={deliveryStats.statsByVehicle} />
              <div className="flex-grow flex flex-col">
                <FuelEfficiency deliveryStats={deliveryStats} shifts={periodShifts} className="h-full" />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StatisticsDelivery;
