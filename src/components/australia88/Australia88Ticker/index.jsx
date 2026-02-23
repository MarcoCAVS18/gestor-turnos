// src/components/australia88/Australia88Ticker/index.jsx
// Scrolling announcement ticker for the AU Working Holiday Visa 88-day tracker.
// Renders above the Dashboard page header.

import React from 'react';
import { Globe, TrendingUp, Clock, Target, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { useAustralia88 } from '../../../hooks/useAustralia88';

// Renders one set of N segments as flat flex items (no wrapper div).
// Each segment is [px-8][icon  text][px-8][•] so the gap at the loop boundary
// is [px-8 right][•][px-8 left] — identical to every inter-segment gap.
const Segments = ({ segments, keyPrefix }) =>
  segments.map(({ icon: Icon, text }, i) => (
    <React.Fragment key={`${keyPrefix}-${i}`}>
      <div className="flex items-center gap-2 px-8 whitespace-nowrap">
        <Icon size={12} className="flex-shrink-0" style={{ opacity: 0.7 }} />
        <span className="text-xs font-medium tracking-wide" style={{ opacity: 0.9 }}>
          {text}
        </span>
      </div>
      <span className="flex-shrink-0 text-sm select-none" style={{ opacity: 0.3 }}>•</span>
    </React.Fragment>
  ));

const Australia88Ticker = () => {
  const {
    isAustraliaMode,
    hasEligibleWorks,
    totalVisaDays,
    currentWeekVisaDays,
    milestone,
  } = useAustralia88();

  if (!isAustraliaMode) return null;

  const milestoneTarget = milestone === 'complete' ? 176 : milestone;
  const daysRemaining = milestoneTarget - totalVisaDays;

  let segments;
  if (!hasEligibleWorks) {
    segments = [
      { icon: Globe,      text: 'Working Holiday Visa tracker' },
      { icon: Info,       text: 'Mark a job as eligible to start accumulating visa days' },
      { icon: ArrowRight, text: 'Go to Works > Edit > Enable WHV extension' },
    ];
  } else if (milestone === 'complete') {
    segments = [
      { icon: Globe,        text: 'Working Holiday Visa' },
      { icon: TrendingUp,   text: `${totalVisaDays} days accumulated` },
      { icon: CheckCircle2, text: 'Both extension years complete — congratulations!' },
    ];
  } else {
    segments = [
      { icon: Globe,      text: 'Working Holiday Visa' },
      { icon: TrendingUp, text: `${totalVisaDays} / ${milestoneTarget} days accumulated` },
      { icon: Clock,      text: `This week +${currentWeekVisaDays} days` },
      { icon: Target,     text: `${daysRemaining} days remaining` },
    ];
  }

  return (
    <div
      className="overflow-hidden rounded-xl select-none"
      style={{
        background: 'linear-gradient(90deg, #0d2b1a 0%, #0a2340 50%, #0d2b1a 100%)',
      }}
    >
      {/*
        All 2×N segments live in ONE flat flex row — no div boundaries between
        the two copies. width:max-content makes translateX(-50%) equal exactly
        one copy's width, so the loop is pixel-perfect regardless of viewport size.
      */}
      <div
        className="flex items-center py-2 text-white"
        style={{ width: 'max-content', animation: 'au88-ticker 28s linear infinite' }}
      >
        <Segments segments={segments} keyPrefix="a" />
        <Segments segments={segments} keyPrefix="b" />
      </div>
    </div>
  );
};

export default Australia88Ticker;
