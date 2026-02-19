// src/services/export/png/PNGDashboard.jsx

import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

/**
 * PNG Dashboard Component - Card-style dashboard for PNG export
 * Dynamic height based on content, no forced A4 format
 */
export const PNGDashboard = ({ data, logo, width = 1200 }) => {
  const { metadata, userInfo, kpis, weekComparison, weeklyData, topWorks, shiftTypes, delivery, projections } = data;

  const colors = {
    primary: '#EC4899',
    secondary: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    gray: '#6B7280',
    lightGray: '#F3F4F6',
    white: '#FFFFFF',
    dark: '#1F2937',
    cardBg: '#FFFFFF',
    pageBg: '#F9FAFB'
  };

  const shiftTypeColors = {
    'Day': '#FBBF24',
    'Afternoon': '#F97316',
    'Night': '#6366F1',
    'Saturday': '#10B981',
    'Sunday': '#EC4899',
    'Delivery': '#8B5CF6'
  };

  const formatCurrency = (value) => `$${(value || 0).toFixed(2)}`;
  const formatHours = (value) => `${(value || 0).toFixed(1)}h`;

  const cardStyle = {
    backgroundColor: colors.cardBg,
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)'
  };

  const chartWidth = Math.floor((width - 120) / 2) - 48;

  return (
    <div
      style={{
        width: `${width}px`,
        backgroundColor: colors.pageBg,
        padding: '40px',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        boxSizing: 'border-box'
      }}
    >
      {/* Header */}
      <div style={{
        ...cardStyle,
        background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
        color: colors.white,
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {logo && logo.base64 && (
            <img
              src={logo.base64}
              alt="Logo"
              style={{ width: '56px', height: '56px', borderRadius: '12px' }}
            />
          )}
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: colors.white }}>
              Activity Dashboard
            </h1>
            <p style={{ margin: '6px 0 0 0', fontSize: '15px', color: 'rgba(255,255,255,0.85)' }}>
              {metadata.startDate} — {metadata.endDate}
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Generated</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '15px', fontWeight: '600', color: colors.white }}>
            {metadata.generatedDate}
          </p>
        </div>
      </div>

      {/* User Info Card */}
      {userInfo && (
        <div style={{
          ...cardStyle,
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* User icon circle */}
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.white,
              fontSize: '20px',
              fontWeight: '700'
            }}>
              {(userInfo.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: colors.dark }}>
                {userInfo.name}
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: colors.gray }}>
                {metadata.totalShifts} shifts across {metadata.totalWorks} works
              </p>
            </div>
          </div>
          <div style={{
            padding: '6px 14px',
            borderRadius: '20px',
            backgroundColor: userInfo.isPremium ? '#FDF2F8' : colors.lightGray,
            border: userInfo.isPremium ? '1px solid #FBCFE8' : '1px solid #E5E7EB'
          }}>
            <span style={{
              fontSize: '13px',
              fontWeight: '600',
              color: userInfo.isPremium ? '#BE185D' : colors.gray
            }}>
              {userInfo.isPremium ? 'Premium' : 'Free'}
            </span>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <KPICard label="Total Earned" value={formatCurrency(kpis.totalEarned)} icon="$" color={colors.primary} />
        <KPICard label="Total Hours" value={formatHours(kpis.totalHours)} icon="⏱" color={colors.secondary} />
        <KPICard label="Total Shifts" value={kpis.totalShifts.toString()} icon="📋" color={colors.success} />
        <KPICard label="Avg/Hour" value={formatCurrency(kpis.averagePerHour)} icon="⚡" color={colors.warning} />
      </div>

      {/* Week Comparison */}
      <div style={{ ...cardStyle, marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: colors.gray, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              This Week
            </p>
            <p style={{ margin: '8px 0 0 0', fontSize: '32px', fontWeight: '700', color: colors.dark }}>
              {formatCurrency(weekComparison.current)}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '8px 16px',
              borderRadius: '12px',
              backgroundColor: weekComparison.change >= 0 ? '#D1FAE5' : '#FEE2E2'
            }}>
              <span style={{
                fontSize: '16px',
                fontWeight: '700',
                color: weekComparison.change >= 0 ? '#065F46' : '#991B1B'
              }}>
                {weekComparison.change >= 0 ? '↑' : '↓'} {Math.abs(weekComparison.change).toFixed(1)}%
              </span>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '12px', color: colors.gray }}>vs last week</p>
              <p style={{ margin: '2px 0 0 0', fontSize: '14px', fontWeight: '500', color: colors.gray }}>
                {formatCurrency(weekComparison.previous)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section - Fixed dimensions instead of ResponsiveContainer */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {/* Weekly Evolution Chart */}
        <div style={cardStyle}>
          <p style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '600', color: colors.dark }}>
            Weekly Evolution
          </p>
          {weeklyData && weeklyData.length > 0 ? (
            <LineChart width={chartWidth} height={220} data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="week" stroke={colors.gray} style={{ fontSize: '11px' }} />
              <YAxis stroke={colors.gray} style={{ fontSize: '11px' }} />
              <Tooltip contentStyle={{ backgroundColor: colors.white, border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="earnings" stroke={colors.primary} strokeWidth={3} dot={{ fill: colors.primary, r: 5 }} name="Earnings ($)" />
            </LineChart>
          ) : (
            <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.gray, fontSize: '14px' }}>
              No weekly data available
            </div>
          )}
        </div>

        {/* Shift Types Chart */}
        <div style={cardStyle}>
          <p style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '600', color: colors.dark }}>
            Hours by Shift Type
          </p>
          {shiftTypes && shiftTypes.length > 0 ? (
            <BarChart width={chartWidth} height={220} data={shiftTypes} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" stroke={colors.gray} style={{ fontSize: '11px' }} />
              <YAxis type="category" dataKey="type" stroke={colors.gray} style={{ fontSize: '11px' }} width={80} />
              <Tooltip contentStyle={{ backgroundColor: colors.white, border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="hours" radius={[0, 6, 6, 0]} name="Hours">
                {shiftTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || shiftTypeColors[entry.type] || colors.secondary} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.gray, fontSize: '14px' }}>
              No shift type data available
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Top Works + Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Top Works */}
        <div style={cardStyle}>
          <p style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '600', color: colors.dark }}>
            Top Works
          </p>
          {topWorks && topWorks.length > 0 ? (
            <div>
              {topWorks.map((work, index) => (
                <div
                  key={index}
                  style={{
                    padding: '14px 0',
                    borderBottom: index < topWorks.length - 1 ? '1px solid #F3F4F6' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: work.color || colors.primary
                    }} />
                    <div>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: colors.dark }}>
                        {work.name}
                      </p>
                      <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: colors.gray }}>
                        {formatHours(work.hours)} · {work.shifts} shifts
                      </p>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: colors.primary }}>
                    {formatCurrency(work.earned)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: '14px', color: colors.gray }}>No work data available</p>
          )}
        </div>

        {/* Summary */}
        <div style={cardStyle}>
          <p style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '600', color: colors.dark }}>
            Summary
          </p>

          {/* Delivery Stats */}
          {delivery && (
            <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #F3F4F6' }}>
              <p style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '600', color: colors.gray, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Delivery
              </p>
              <SummaryRow label="Total Earned" value={formatCurrency(delivery.totalEarned)} color={colors.primary} />
              <SummaryRow label="Orders" value={delivery.totalOrders.toString()} />
              <SummaryRow label="Avg/Order" value={formatCurrency(delivery.averagePerOrder)} />
              {delivery.totalKilometers > 0 && (
                <SummaryRow label="Kilometers" value={`${delivery.totalKilometers.toFixed(0)} km`} />
              )}
            </div>
          )}

          {/* Projections */}
          <div style={{ marginBottom: delivery ? '0' : '0' }}>
            <p style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '600', color: colors.gray, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Projections
            </p>
            <SummaryRow label="Monthly" value={formatCurrency(projections.monthlyProjection)} color={colors.primary} bold />
            <SummaryRow label="Weekly Avg" value={formatCurrency(projections.weeklyAverage)} />
            <SummaryRow label="Hourly Rate" value={formatCurrency(projections.hourlyProjection)} />
          </div>

          {/* Extra KPIs */}
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
            <p style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '600', color: colors.gray, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Averages
            </p>
            <SummaryRow label="Per Shift" value={formatCurrency(kpis.averagePerShift)} />
            <SummaryRow label="Per Hour" value={formatCurrency(kpis.averagePerHour)} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '24px',
        textAlign: 'center',
        padding: '16px 0'
      }}>
        <p style={{ margin: 0, fontSize: '12px', color: colors.gray }}>
          Generated by Orary · orary.app
        </p>
      </div>
    </div>
  );
};

/**
 * KPI Card Component - Modern card style
 */
const KPICard = ({ label, value, icon, color }) => {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        padding: '20px',
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Color accent bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        backgroundColor: color,
        borderRadius: '16px 16px 0 0'
      }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <p style={{ margin: 0, fontSize: '12px', fontWeight: '500', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </p>
        <span style={{ fontSize: '18px' }}>{icon}</span>
      </div>
      <p style={{ margin: 0, fontSize: '26px', fontWeight: '700', color: '#1F2937' }}>
        {value}
      </p>
    </div>
  );
};

/**
 * Summary Row Component
 */
const SummaryRow = ({ label, value, color, bold }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
    <span style={{ fontSize: '13px', color: '#6B7280' }}>{label}</span>
    <span style={{
      fontSize: bold ? '15px' : '13px',
      fontWeight: bold ? '700' : '600',
      color: color || '#1F2937'
    }}>
      {value}
    </span>
  </div>
);

const PNGDashboardModule = {
  PNGDashboard,
  KPICard
};

export default PNGDashboardModule;
