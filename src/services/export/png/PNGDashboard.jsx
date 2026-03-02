// src/services/export/png/PNGDashboard.jsx

import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

/**
 * PNG Dashboard Component - Professional card-style dashboard for PNG export
 */
export const PNGDashboard = ({ data, logo, width = 1200 }) => {
  const { metadata, userInfo, kpis, weekComparison, weeklyData, topWorks, shiftTypes, delivery, projections } = data;

  const colors = {
    // Brand
    brandDark: '#0F172A',
    brandMid: '#1E3A5F',
    brandAccent: '#EC4899',
    // UI
    primary: '#1E3A5F',
    secondary: '#3B82F6',
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    // Neutrals
    gray: '#6B7280',
    lightGray: '#F3F4F6',
    borderGray: '#E5E7EB',
    white: '#FFFFFF',
    dark: '#111827',
    cardBg: '#FFFFFF',
    pageBg: '#F1F5F9'
  };

  const shiftTypeColors = {
    'Day': '#D97706',
    'Afternoon': '#EA580C',
    'Night': '#4F46E5',
    'Saturday': '#059669',
    'Sunday': '#EC4899',
    'Delivery': '#7C3AED'
  };

  const r2 = (v) => Math.round((v || 0) * 100) / 100;
  const r1 = (v) => Math.round((v || 0) * 10) / 10;

  const formatCurrency = (value) => `$${r2(value).toFixed(2)}`;
  const formatHours = (value) => `${r1(value).toFixed(1)}h`;

  const cardStyle = {
    backgroundColor: colors.cardBg,
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05)',
    border: `1px solid ${colors.borderGray}`
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
      {/* ─── Header ─── */}
      <div style={{
        backgroundColor: colors.brandDark,
        borderRadius: '16px',
        padding: '32px 36px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '300px',
          height: '100%',
          background: 'linear-gradient(135deg, transparent 0%, rgba(236,72,153,0.08) 100%)',
          pointerEvents: 'none'
        }} />

        {/* Left: Logo + App name + Report title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {logo && logo.base64 && (
            <img
              src={logo.base64}
              alt="Orary"
              style={{ width: '52px', height: '52px', objectFit: 'contain', flexShrink: 0 }}
            />
          )}
          <div>
            <p style={{
              margin: 0,
              fontSize: '11px',
              fontWeight: '700',
              color: colors.brandAccent,
              letterSpacing: '3px',
              textTransform: 'uppercase'
            }}>
              Orary
            </p>
            <h1 style={{ margin: '5px 0 0 0', fontSize: '26px', fontWeight: '700', color: colors.white, lineHeight: 1.2 }}>
              Activity Report
            </h1>
            <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: 'rgba(255,255,255,0.55)' }}>
              {metadata.startDate} — {metadata.endDate}
            </p>
          </div>
        </div>

        {/* Right: Generated date + shift count */}
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.45)', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Generated
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '15px', fontWeight: '600', color: colors.white }}>
            {metadata.generatedDate}
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
            {metadata.totalShifts} shifts · {metadata.totalWorks} works
          </p>
        </div>
      </div>

      {/* ─── User Info Card ─── */}
      {userInfo && (
        <div style={{
          ...cardStyle,
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Avatar */}
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: colors.brandDark,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.white,
              fontSize: '18px',
              fontWeight: '700',
              flexShrink: 0
            }}>
              {(userInfo.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: colors.dark }}>
                {userInfo.name}
              </p>
              <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: colors.gray }}>
                {userInfo.email || 'Orary User'}
              </p>
            </div>
          </div>
          {/* Account type badge — centered in the card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              padding: '5px 14px',
              borderRadius: '20px',
              backgroundColor: userInfo.isPremium ? '#FDF2F8' : colors.lightGray,
              border: `1px solid ${userInfo.isPremium ? '#FBCFE8' : '#E5E7EB'}`
            }}>
              <span style={{
                fontSize: '12px',
                fontWeight: '700',
                color: userInfo.isPremium ? '#BE185D' : colors.gray,
                letterSpacing: '0.3px'
              }}>
                {userInfo.isPremium ? '★ Premium' : 'Free'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─── KPI Cards ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <KPICard label="Total Earned" value={formatCurrency(kpis.totalEarned)} accentColor={colors.brandAccent} />
        <KPICard label="Total Hours" value={formatHours(kpis.totalHours)} accentColor={colors.secondary} />
        <KPICard label="Total Shifts" value={String(kpis.totalShifts)} accentColor={colors.success} />
        <KPICard label="Avg / Hour" value={formatCurrency(kpis.averagePerHour)} accentColor={colors.warning} />
      </div>

      {/* ─── Week Comparison ─── */}
      <div style={{ ...cardStyle, marginBottom: '24px', padding: '20px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: '600', color: colors.gray, textTransform: 'uppercase', letterSpacing: '1px' }}>
              This Week
            </p>
            <p style={{ margin: '8px 0 0 0', fontSize: '30px', fontWeight: '700', color: colors.dark }}>
              {formatCurrency(weekComparison.current)}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              padding: '8px 16px',
              borderRadius: '10px',
              backgroundColor: weekComparison.change >= 0 ? '#ECFDF5' : '#FEF2F2',
              border: `1px solid ${weekComparison.change >= 0 ? '#A7F3D0' : '#FECACA'}`
            }}>
              <span style={{
                fontSize: '15px',
                fontWeight: '700',
                color: weekComparison.change >= 0 ? '#065F46' : '#991B1B'
              }}>
                {weekComparison.change >= 0 ? '↑' : '↓'} {Math.abs(r1(weekComparison.change)).toFixed(1)}%
              </span>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '11px', color: colors.gray }}>vs last week</p>
              <p style={{ margin: '3px 0 0 0', fontSize: '14px', fontWeight: '500', color: colors.dark }}>
                {formatCurrency(weekComparison.previous)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Charts ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {/* Weekly Evolution */}
        <div style={cardStyle}>
          <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '700', color: colors.dark }}>
            Weekly Earnings
          </p>
          <p style={{ margin: '0 0 16px 0', fontSize: '11px', color: colors.gray }}>Last 4 weeks</p>
          {weeklyData && weeklyData.length > 0 ? (
            <LineChart width={chartWidth} height={200} data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.borderGray} />
              <XAxis dataKey="week" stroke={colors.gray} tick={{ fontSize: 10 }} />
              <YAxis stroke={colors.gray} tick={{ fontSize: 10 }} tickFormatter={(v) => `$${Math.round(v)}`} />
              <Tooltip
                contentStyle={{ backgroundColor: colors.white, border: `1px solid ${colors.borderGray}`, borderRadius: '8px', fontSize: '12px' }}
                formatter={(v) => [`$${r2(v).toFixed(2)}`, 'Earnings']}
              />
              <Line type="monotone" dataKey="earnings" stroke={colors.brandAccent} strokeWidth={2.5} dot={{ fill: colors.brandAccent, r: 4, strokeWidth: 0 }} />
            </LineChart>
          ) : (
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.gray, fontSize: '13px' }}>
              No weekly data
            </div>
          )}
        </div>

        {/* Shift Types */}
        <div style={cardStyle}>
          <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '700', color: colors.dark }}>
            Hours by Shift Type
          </p>
          <p style={{ margin: '0 0 16px 0', fontSize: '11px', color: colors.gray }}>Distribution overview</p>
          {shiftTypes && shiftTypes.length > 0 ? (
            <BarChart width={chartWidth} height={200} data={shiftTypes} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={colors.borderGray} />
              <XAxis type="number" stroke={colors.gray} tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}h`} />
              <YAxis type="category" dataKey="type" stroke={colors.gray} tick={{ fontSize: 10 }} width={75} />
              <Tooltip
                contentStyle={{ backgroundColor: colors.white, border: `1px solid ${colors.borderGray}`, borderRadius: '8px', fontSize: '12px' }}
                formatter={(v) => [`${r1(v).toFixed(1)}h`, 'Hours']}
              />
              <Bar dataKey="hours" radius={[0, 4, 4, 0]}>
                {shiftTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || shiftTypeColors[entry.type] || colors.secondary} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.gray, fontSize: '13px' }}>
              No shift data
            </div>
          )}
        </div>
      </div>

      {/* ─── Bottom: Top Works + Summary ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Top Works */}
        <div style={cardStyle}>
          <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '700', color: colors.dark }}>
            Top Works
          </p>
          <p style={{ margin: '0 0 16px 0', fontSize: '11px', color: colors.gray }}>Ranked by earnings</p>
          {topWorks && topWorks.length > 0 ? (
            <div>
              {topWorks.map((work, index) => (
                <div
                  key={index}
                  style={{
                    padding: '12px 0',
                    borderBottom: index < topWorks.length - 1 ? `1px solid ${colors.borderGray}` : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      backgroundColor: colors.lightGray,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: colors.gray
                    }}>
                      {index + 1}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: colors.dark }}>
                        {work.name}
                      </p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: colors.gray }}>
                        {formatHours(work.hours)} · {work.shifts} shifts
                      </p>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: colors.dark }}>
                    {formatCurrency(work.earned)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: '13px', color: colors.gray }}>No work data</p>
          )}
        </div>

        {/* Summary */}
        <div style={cardStyle}>
          <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '700', color: colors.dark }}>
            Summary
          </p>
          <p style={{ margin: '0 0 16px 0', fontSize: '11px', color: colors.gray }}>Key statistics</p>

          {/* Delivery Stats */}
          {delivery && (
            <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: `1px solid ${colors.borderGray}` }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '10px', fontWeight: '700', color: colors.gray, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Delivery
              </p>
              <SummaryRow label="Earned" value={formatCurrency(delivery.totalEarned)} highlight />
              <SummaryRow label="Orders" value={String(delivery.totalOrders)} />
              <SummaryRow label="Avg / Order" value={formatCurrency(delivery.averagePerOrder)} />
              {delivery.totalKilometers > 0 && (
                <SummaryRow label="Distance" value={`${Math.round(delivery.totalKilometers)} km`} />
              )}
            </div>
          )}

          {/* Projections */}
          <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: `1px solid ${colors.borderGray}` }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '10px', fontWeight: '700', color: colors.gray, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Projections
            </p>
            <SummaryRow label="Monthly" value={formatCurrency(projections.monthlyProjection)} highlight bold />
            <SummaryRow label="Weekly Avg" value={formatCurrency(projections.weeklyAverage)} />
            <SummaryRow label="Hourly Rate" value={formatCurrency(projections.hourlyProjection)} />
          </div>

          {/* Averages */}
          <div>
            <p style={{ margin: '0 0 10px 0', fontSize: '10px', fontWeight: '700', color: colors.gray, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Averages
            </p>
            <SummaryRow label="Per Shift" value={formatCurrency(kpis.averagePerShift)} />
            <SummaryRow label="Per Hour" value={formatCurrency(kpis.averagePerHour)} />
          </div>
        </div>
      </div>

      {/* ─── Footer ─── */}
      <div style={{
        marginTop: '32px',
        paddingTop: '20px',
        borderTop: `1px solid ${colors.borderGray}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <p style={{ margin: 0, fontSize: '11px', color: colors.gray }}>
          Generated by <strong style={{ color: colors.dark }}>Orary</strong> · orary.app
        </p>
      </div>
    </div>
  );
};

/**
 * KPI Card Component - Professional card with subtle accent bar
 */
const KPICard = ({ label, value, accentColor }) => (
  <div style={{
    backgroundColor: '#FFFFFF',
    padding: '20px 22px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
    border: '1px solid #E5E7EB',
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* Accent bar */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      backgroundColor: accentColor
    }} />
    <p style={{ margin: '0 0 10px 0', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
      {label}
    </p>
    <p style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#111827' }}>
      {value}
    </p>
  </div>
);

/**
 * Summary Row Component
 */
const SummaryRow = ({ label, value, highlight, bold }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
    <span style={{ fontSize: '12px', color: '#6B7280' }}>{label}</span>
    <span style={{
      fontSize: bold ? '14px' : '12px',
      fontWeight: bold ? '700' : '600',
      color: highlight ? '#111827' : '#374151'
    }}>
      {value}
    </span>
  </div>
);

const PNGDashboardModule = { PNGDashboard, KPICard };
export default PNGDashboardModule;
