// src/pages/Admin.jsx
// Admin-only panel: usage/cost dashboard + comment moderation + user list.
// Gated by the `admin` custom claim (useAuth().isAdmin); firestore.rules enforce
// the data access server-side. Non-admins are redirected away.

import React, { useEffect, useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Check, X, RefreshCw, Star, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/layout/PageHeader';
import {
  getUsageStats,
  getSubscriptionMetrics,
  getAllFeedback,
  getAllUsers,
  updateFeedbackStatus,
} from '../services/firebaseService';

const fmt = (n) => (n === null || n === undefined ? '—' : n.toLocaleString());

const StatCard = ({ label, value, accent }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">{label}</p>
    <p className="text-2xl font-bold mt-1" style={{ color: accent }}>{value}</p>
  </div>
);

const StatusPill = ({ status, t }) => {
  const map = {
    approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${map[status] || map.pending}`}>
      {t(`admin.moderation.${status || 'pending'}`)}
    </span>
  );
};

const Admin = () => {
  const { t } = useTranslation();
  const { isAdmin, loading: authLoading } = useAuth();

  const [stats, setStats] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [s, m, f, u] = await Promise.all([
        getUsageStats(),
        getSubscriptionMetrics(),
        getAllFeedback(),
        getAllUsers(),
      ]);
      setStats(s);
      setMetrics(m);
      setFeedback(f);
      setUsers(u);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  // Redirect non-admins once auth has resolved.
  if (!authLoading && !isAdmin) return <Navigate to="/dashboard" replace />;

  const moderate = async (id, status) => {
    setBusyId(id);
    try {
      await updateFeedbackStatus(id, status);
      setFeedback((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } catch {
      setError(true);
    } finally {
      setBusyId(null);
    }
  };

  const stat = (key, accent) => (
    <StatCard label={t(`admin.usage.${key}`)} value={fmt(stats?.[key])} accent={accent} />
  );

  // Derived subscription funnel (approximate, from current point-in-time states).
  const n = (v) => (typeof v === 'number' ? v : 0);
  const paid = n(metrics?.activePaid) + n(metrics?.cancelling);
  const premiumTotal = metrics ? n(metrics.trialing) + paid : null;
  const conversion = metrics && metrics.trialsStarted ? Math.round((paid / metrics.trialsStarted) * 100) : null;
  const churnDenom = paid + n(metrics?.cancelled);
  const churn = metrics && churnDenom > 0 ? Math.round((n(metrics.cancelled) / churnDenom) * 100) : null;
  const pct = (v) => (v === null || v === undefined ? '—' : `${v}%`);

  return (
    <div className="px-4 py-6 pb-32 space-y-8">
      <PageHeader
        title={t('admin.title')}
        subtitle={t('admin.subtitle')}
        icon={Shield}
        action={{ onClick: load, icon: RefreshCw, label: t('admin.usage.refresh') }}
      />

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm">
          {t('admin.error')}
        </div>
      )}

      {/* ── Usage / cost dashboard ─────────────────────────────────────── */}
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t('admin.usage.title')}</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">{t('admin.usage.note')}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {stat('totalUsers', '#6366F1')}
          {stat('newUsers30d', '#6366F1')}
          {stat('totalShifts', '#EC4899')}
          {stat('shifts30d', '#EC4899')}
          {stat('totalWorks', '#0EA5E9')}
          {stat('totalLiveSessions', '#F59E0B')}
          {stat('totalFeedback', '#10B981')}
          {stat('pendingFeedback', '#F59E0B')}
        </div>
      </section>

      {/* ── Subscriptions & conversion ─────────────────────────────────── */}
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t('admin.metrics.title')}</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">{t('admin.metrics.note')}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <StatCard label={t('admin.metrics.premiumTotal')} value={fmt(premiumTotal)} accent="#EC4899" />
          <StatCard label={t('admin.metrics.trialsStarted')} value={fmt(metrics?.trialsStarted)} accent="#6366F1" />
          <StatCard label={t('admin.metrics.trialing')} value={fmt(metrics?.trialing)} accent="#F59E0B" />
          <StatCard label={t('admin.metrics.activePaid')} value={fmt(metrics?.activePaid)} accent="#10B981" />
          <StatCard label={t('admin.metrics.cancelling')} value={fmt(metrics?.cancelling)} accent="#F59E0B" />
          <StatCard label={t('admin.metrics.cancelled')} value={fmt(metrics?.cancelled)} accent="#F43F5E" />
          <StatCard label={t('admin.metrics.conversion')} value={pct(conversion)} accent="#10B981" />
          <StatCard label={t('admin.metrics.churn')} value={pct(churn)} accent="#F43F5E" />
        </div>
      </section>

      {/* ── Comment moderation ─────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {t('admin.moderation.title')}
          {stats?.pendingFeedback ? (
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              {stats.pendingFeedback} {t('admin.moderation.pending').toLowerCase()}
            </span>
          ) : null}
        </h2>

        {loading && !feedback.length ? (
          <p className="text-sm text-gray-400">…</p>
        ) : !feedback.length ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">{t('admin.moderation.empty')}</p>
        ) : (
          <div className="space-y-2">
            {feedback.map((r) => (
              <div
                key={r.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                      {r.isAnonymous ? t('admin.moderation.anonymous') : (r.displayName || t('admin.moderation.anonymous'))}
                    </span>
                    <span className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className={i < (r.rating || 0) ? 'fill-current' : 'opacity-25'} />
                      ))}
                    </span>
                    <StatusPill status={r.status} t={t} />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 break-words">
                    {r.comment || <span className="italic text-gray-400">{t('admin.moderation.noComment')}</span>}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => moderate(r.id, 'approved')}
                    disabled={busyId === r.id || r.status === 'approved'}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-40 transition-colors"
                  >
                    <Check size={13} /> {t('admin.moderation.approve')}
                  </button>
                  <button
                    onClick={() => moderate(r.id, 'rejected')}
                    disabled={busyId === r.id || r.status === 'rejected'}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-40 transition-colors"
                  >
                    <X size={13} /> {t('admin.moderation.reject')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Users ──────────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {t('admin.users.title')}
          {users.length ? <span className="ml-2 text-sm text-gray-400">({users.length})</span> : null}
        </h2>
        {!users.length ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">{t('admin.users.empty')}</p>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{u.displayName || u.email || u.id}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate flex items-center gap-1">
                    <Clock size={10} />
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    u.isPremium
                      ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {u.isPremium ? t('admin.users.premium') : t('admin.users.free')}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Admin;
