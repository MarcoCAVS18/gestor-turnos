// src/services/export/png/PNGDashboard.jsx

import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

/**
 * PNG Dashboard Component - Beautiful, summarized dashboard for PNG export
 * Renders a single-page view with all key metrics
 */
export const PNGDashboard = ({ data, logo, width = 1200, height = 1600 }) => {
  const { metadata, kpis, weekComparison, weeklyData, topWorks, shiftTypes, delivery, projections } = data;

  // Colors
  const colors = {
    primary: '#EC4899',
    secondary: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    gray: '#6B7280',
    lightGray: '#F3F4F6',
    white: '#FFFFFF'
  };

  // Shift type colors
  const shiftTypeColors = {
    'Day': '#FBBF24',
    'Afternoon': '#F97316',
    'Night': '#6366F1',
    'Saturday': '#10B981',
    'Sunday': '#EC4899',
    'Delivery': '#8B5CF6'
  };

  const formatCurrency = (value) => `$${value.toFixed(2)}`;
  const formatHours = (value) => `${value.toFixed(1)}h`;

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: colors.white,
        padding: '40px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        boxSizing: 'border-box'
      }}
    >
      {/* Header with Logo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {logo && logo.base64 && (
            <img
              src={logo.base64}
              alt="Logo"
              style={{ width: '60px', height: '60px' }}
            />
          )}
          <div>
            <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#1F2937' }}>
              Activity Dashboard
            </h1>
            <p style={{ margin: '5px 0 0 0', fontSize: '16px', color: colors.gray }}>
              {metadata.startDate} to {metadata.endDate}
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '14px', color: colors.gray }}>Generated on</p>
          <p style={{ margin: '5px 0 0 0', fontSize: '16px', fontWeight: '600', color: '#1F2937' }}>
            {metadata.generatedDate}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <KPICard
          label="Total Earned"
          value={formatCurrency(kpis.totalEarned)}
          color={colors.primary}
        />
        <KPICard
          label="Total Hours"
          value={formatHours(kpis.totalHours)}
          color={colors.secondary}
        />
        <KPICard
          label="Total Shifts"
          value={kpis.totalShifts.toString()}
          color={colors.success}
        />
        <KPICard
          label="Avg Per Hour"
          value={formatCurrency(kpis.averagePerHour)}
          color={colors.warning}
        />
      </div>

      {/* Week Comparison */}
      <div style={{ backgroundColor: colors.lightGray, padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 15px 0', fontSize: '18px', fontWeight: 'bold', color: '#1F2937' }}>
          This Week
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div>
            <p style={{ margin: 0, fontSize: '14px', color: colors.gray }}>Current Week</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '28px', fontWeight: 'bold', color: colors.primary }}>
              {formatCurrency(weekComparison.current)}
            </p>
          </div>
          <div style={{
            padding: '8px 16px',
            borderRadius: '20px',
            backgroundColor: weekComparison.change >= 0 ? '#D1FAE5' : '#FEE2E2'
          }}>
            <span style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: weekComparison.change >= 0 ? '#065F46' : '#991B1B'
            }}>
              {weekComparison.change >= 0 ? '+' : ''}{weekComparison.change.toFixed(1)}%
            </span>
            <span style={{ fontSize: '14px', color: colors.gray, marginLeft: '5px' }}>vs last week</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        {/* Weekly Evolution Chart */}
        <div style={{ backgroundColor: colors.lightGray, padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: 'bold', color: '#1F2937' }}>
            Weekly Evolution
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="week" stroke={colors.gray} style={{ fontSize: '12px' }} />
              <YAxis stroke={colors.gray} style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{ backgroundColor: colors.white, border: '1px solid #E5E7EB', borderRadius: '6px' }}
              />
              <Line type="monotone" dataKey="earnings" stroke={colors.primary} strokeWidth={3} dot={{ fill: colors.primary, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Shift Types Chart */}
        <div style={{ backgroundColor: colors.lightGray, padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: 'bold', color: '#1F2937' }}>
            Hours by Shift Type
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={shiftTypes} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" stroke={colors.gray} style={{ fontSize: '12px' }} />
              <YAxis type="category" dataKey="type" stroke={colors.gray} style={{ fontSize: '12px' }} width={80} />
              <Tooltip
                contentStyle={{ backgroundColor: colors.white, border: '1px solid #E5E7EB', borderRadius: '6px' }}
              />
              <Bar dataKey="hours" radius={[0, 4, 4, 0]}>
                {shiftTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={shiftTypeColors[entry.type] || colors.secondary} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section: Top Works and Additional Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Top Works */}
        <div>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: 'bold', color: '#1F2937' }}>
            Top Works
          </h3>
          <div style={{ backgroundColor: colors.lightGray, borderRadius: '8px', overflow: 'hidden' }}>
            {topWorks.map((work, index) => (
              <div
                key={index}
                style={{
                  padding: '12px 16px',
                  borderBottom: index < topWorks.length - 1 ? '1px solid #E5E7EB' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1F2937' }}>
                    {work.name}
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: colors.gray }}>
                    {formatHours(work.hours)}
                  </p>
                </div>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: colors.primary }}>
                  {formatCurrency(work.earned)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: 'bold', color: '#1F2937' }}>
            Summary
          </h3>
          <div style={{ backgroundColor: colors.lightGray, padding: '20px', borderRadius: '8px' }}>
            {/* Delivery Stats if available */}
            {delivery && (
              <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #E5E7EB' }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600', color: '#1F2937' }}>
                  Delivery Summary
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: colors.gray }}>Total Earned:</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#1F2937' }}>
                    {formatCurrency(delivery.totalEarned)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: colors.gray }}>Orders:</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#1F2937' }}>
                    {delivery.totalOrders}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: colors.gray }}>Avg Per Order:</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#1F2937' }}>
                    {formatCurrency(delivery.averagePerOrder)}
                  </span>
                </div>
              </div>
            )}

            {/* Monthly Projection */}
            <div>
              <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600', color: '#1F2937' }}>
                Monthly Projection
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: colors.gray }}>Projected:</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: colors.primary }}>
                  {formatCurrency(projections.monthlyProjected)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: colors.gray }}>Days in Month:</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#1F2937' }}>
                  {projections.daysInMonth}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: colors.gray }}>Days Remaining:</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#1F2937' }}>
                  {projections.daysRemaining}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * KPI Card Component
 */
const KPICard = ({ label, value, color }) => {
  return (
    <div
      style={{
        backgroundColor: '#F9FAFB',
        padding: '20px',
        borderRadius: '8px',
        border: `2px solid ${color}`,
        textAlign: 'center'
      }}
    >
      <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </p>
      <p style={{ margin: '10px 0 0 0', fontSize: '28px', fontWeight: 'bold', color }}>
        {value}
      </p>
    </div>
  );
};

const PNGDashboardModule = {
  PNGDashboard,
  KPICard
};

export default PNGDashboardModule;
