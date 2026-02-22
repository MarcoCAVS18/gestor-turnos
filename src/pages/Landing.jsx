// src/pages/Landing.jsx
// Public landing page at orary.app/
// Uses mock app components to showcase the product visually

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  Clock, DollarSign, TrendingUp, Calendar,
  ArrowRight, Timer, CheckCircle, Zap,
  Briefcase, BarChart2, Shield, Truck
} from 'lucide-react';

const PINK = '#EC4899';

// ─── Mock stat card (mimics StatCard visual) ────────────────────────────────
const MockStatCard = ({ icon: Icon, label, value, sub, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-2"
  >
    <div className="flex items-center gap-2">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}18` }}
      >
        <Icon size={15} style={{ color }} />
      </div>
      <span className="text-xs text-gray-500 font-medium leading-tight">{label}</span>
    </div>
    <div className="text-xl font-bold text-gray-900 leading-none">{value}</div>
    <div className="text-xs text-gray-400 leading-tight">{sub}</div>
  </motion.div>
);

// ─── Mock Live Mode card (mimics LiveModeCard active state) ─────────────────
const MockLiveModeCard = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.2, duration: 0.4 }}
    className="rounded-2xl p-5 text-white relative overflow-hidden"
    style={{ background: `linear-gradient(135deg, ${PINK} 0%, #9d174d 100%)` }}
  >
    {/* Badge */}
    <div className="inline-flex items-center gap-1.5 mb-4 px-2.5 py-1 rounded-full bg-white/20 border border-white/25 text-xs font-bold uppercase tracking-wide">
      <motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-2 h-2 bg-red-300 rounded-full"
      />
      Live Active
    </div>
    <p className="text-white/75 text-xs mb-1">Retail Assistant</p>
    <motion.div
      animate={{ scale: [1, 1.01, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="font-mono text-4xl font-bold text-white mb-3"
    >
      02:34:17
    </motion.div>
    <div className="flex items-center gap-2 bg-white/15 rounded-lg px-3 py-2 w-fit mb-4">
      <DollarSign size={16} className="text-white/80" />
      <span className="font-semibold text-lg">$57.20</span>
    </div>
    <div className="flex gap-2">
      <div className="bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">Pause</div>
      <div className="bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">Finish</div>
      <div className="bg-white text-pink-600 text-xs font-semibold px-3 py-1.5 rounded-lg">More info</div>
    </div>
    {/* Decorative icon */}
    <div className="absolute -top-3 -right-3 opacity-10 pointer-events-none">
      <Timer size={90} />
    </div>
  </motion.div>
);

// ─── Mock Works list ─────────────────────────────────────────────────────────
const MockWorkItem = ({ name, rate, color, isDelivery, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.3 }}
    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
  >
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: `${color}20` }}
    >
      {isDelivery
        ? <Truck size={15} style={{ color }} />
        : <Briefcase size={15} style={{ color }} />}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-800 truncate">{name}</p>
      <p className="text-xs text-gray-400">{rate}</p>
    </div>
    <div className="flex items-center gap-1">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
    </div>
  </motion.div>
);

// ─── Mock weekly bar chart ───────────────────────────────────────────────────
const MockChartCard = () => {
  const bars = [
    { h: 55, label: 'M', val: '$320' },
    { h: 80, label: 'T', val: '$465' },
    { h: 40, label: 'W', val: '$233' },
    { h: 100, label: 'T', val: '$582', highlight: true },
    { h: 70, label: 'F', val: '$408' },
    { h: 60, label: 'S', val: '$349' },
    { h: 45, label: 'S', val: '$262' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <BarChart2 size={16} className="text-gray-400" />
          <p className="font-semibold text-gray-800 text-sm">Weekly Earnings</p>
        </div>
        <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">+8% this week</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-4">$2,619</p>
      <div className="flex items-end gap-1.5 h-24 mb-2">
        {bars.map((b, i) => (
          <motion.div
            key={i}
            className="flex-1 flex flex-col items-center gap-1 h-full justify-end"
          >
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${b.h}%` }}
              transition={{ delay: 0.4 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
              className="w-full rounded-t-md"
              style={{ backgroundColor: b.highlight ? PINK : `${PINK}30` }}
            />
          </motion.div>
        ))}
      </div>
      <div className="flex gap-1.5">
        {bars.map((b, i) => (
          <div key={i} className="flex-1 text-center text-xs text-gray-400 font-medium">{b.label}</div>
        ))}
      </div>
    </motion.div>
  );
};

// ─── Feature checklist card ──────────────────────────────────────────────────
const MockFeaturesCard = () => {
  const features = [
    'Traditional & delivery shift tracking',
    'Auto-calculate earnings with penalty rates',
    'Live Mode real-time timer & earnings',
    'Google Calendar synchronization',
    'Export reports to PDF & Excel',
    'Delivery earnings, tips & km tracking',
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Shield size={16} className="text-gray-400" />
        <p className="font-semibold text-gray-800 text-sm">What Orary does</p>
      </div>
      <div className="space-y-2.5">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 + i * 0.06, duration: 0.3 }}
            className="flex items-start gap-2.5"
          >
            <CheckCircle size={14} style={{ color: PINK }} className="flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-600 leading-tight">{f}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ─── Main Landing component ──────────────────────────────────────────────────
const Landing = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, loading, navigate]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${PINK} transparent transparent transparent` }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col">
        {/* Video background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/75 z-10" />
          <video
            autoPlay loop muted playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/assets/videos/sample_0.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Header nav */}
        <header className="relative z-20 flex items-center justify-between px-5 sm:px-8 py-5">
          <div className="text-2xl font-bold text-white tracking-tight">Orary</div>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white border border-white/30 hover:border-white/60 rounded-lg transition-all"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors"
              style={{ backgroundColor: PINK }}
            >
              Get started free
            </Link>
          </div>
        </header>

        {/* Hero text */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 text-center pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-6 border"
              style={{ backgroundColor: `${PINK}25`, borderColor: `${PINK}50`, color: '#f9a8d4' }}
            >
              <Zap size={12} />
              Free for all workers worldwide
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
              Work Shift Management
              <br />
              <span style={{ color: '#f9a8d4' }}>&amp; Earnings Tracker</span>
            </h1>

            <p className="text-white/70 text-base sm:text-lg max-w-lg mx-auto mb-8 leading-relaxed">
              Track shifts, calculate pay automatically, monitor delivery income,
              and visualize your earnings — all in one place.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors shadow-lg"
                style={{ backgroundColor: PINK }}
              >
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-white/90 font-medium px-8 py-3.5 rounded-xl text-base border border-white/30 hover:bg-white/10 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="relative z-20 flex justify-center pb-8">
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="flex flex-col items-center gap-1.5 text-white/40 text-xs"
          >
            <span>Explore features</span>
            <div className="w-px h-6 bg-gradient-to-b from-white/30 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* ── APP SHOWCASE ─────────────────────────────────────────────────── */}
      <section className="bg-gray-50 px-4 sm:px-6 py-14">
        <div className="max-w-3xl mx-auto space-y-3">

          {/* Section header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Everything you need to manage your work
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              Designed for casual workers, delivery riders, and anyone paid by the hour
            </p>
          </div>

          {/* Row 1: 4 stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MockStatCard icon={DollarSign} label="This Month" value="$2,847" sub="+12% vs last month" color={PINK} delay={0.05} />
            <MockStatCard icon={Clock} label="Hours Worked" value="184h" sub="32 shifts logged" color="#8B5CF6" delay={0.1} />
            <MockStatCard icon={TrendingUp} label="Avg per hour" value="$24.80" sub="Base + penalties" color="#059669" delay={0.15} />
            <MockStatCard icon={Calendar} label="Next Shift" value="Tomorrow" sub="8:00 AM – 4:00 PM" color="#F59E0B" delay={0.2} />
          </div>

          {/* Row 2: Live Mode + Works list */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <MockLiveModeCard />

            <div className="sm:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Briefcase size={15} className="text-gray-400" />
                  <p className="font-semibold text-gray-800 text-sm">Your Works</p>
                </div>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">3 active</span>
              </div>
              <div className="space-y-1">
                <MockWorkItem name="Retail Assistant" rate="$22.50/hr · Traditional" color={PINK} delay={0.25} />
                <MockWorkItem name="DoorDash Delivery" rate="Delivery · Bicycle" color="#059669" isDelivery delay={0.3} />
                <MockWorkItem name="Warehouse Casual" rate="$28.00/hr · Traditional" color="#8B5CF6" delay={0.35} />
              </div>
            </div>
          </div>

          {/* Row 3: Chart + Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MockChartCard />
            <MockFeaturesCard />
          </div>

        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-gray-100 py-10 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-2xl font-bold text-gray-900 mb-1">Orary</div>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            Work Shift Management &amp; Earnings Tracker — Free for all workers worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm mb-6">
            <Link to="/login" className="text-gray-500 hover:text-gray-700 transition-colors">Sign in</Link>
            <Link to="/register" className="text-gray-500 hover:text-gray-700 transition-colors">Register</Link>
            <Link
              to="/privacy"
              className="font-semibold transition-colors"
              style={{ color: PINK }}
            >
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-500 hover:text-gray-700 transition-colors">Terms of Service</Link>
          </div>
          <p className="text-gray-400 text-xs">© 2026 Orary. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
