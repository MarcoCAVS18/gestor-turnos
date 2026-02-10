// src/components/about/StorySection/index.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

const StorySection = ({ colors }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className="py-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: colors.transparent10 }}
        >
          <BookOpen size={20} style={{ color: colors.primary }} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: colors.text }}>
          How it all started
        </h2>
      </div>

      <div className="space-y-4 text-sm md:text-base leading-relaxed" style={{ color: colors.textSecondary }}>
        <p>
          It all started in Australia. I was working there and noticed something that drove me crazy:
          every single week, my friends and I would sit down with a calculator, a notepad, and way too
          much patience trying to figure out how much we'd actually earn.
        </p>
        <p>
          Night hours? Different rate. Weekends? Another rate. Public holidays? Who even knows.
          And after all that math, the number on the payslip was <em>never</em> what we calculated.
          Every. Single. Time.
        </p>
        <p>
          So I thought: <strong>"Enough. There has to be a better way."</strong>
        </p>
        <p>
          I built spreadsheets. I tried templates. I made little tools that kind of worked...
          but never really nailed it. Nothing matched the actual payslip values. It was frustrating.
        </p>
        <p>
          Then one day it hit me:{' '}
          <span className="font-semibold" style={{ color: colors.primary }}>
            "Why don't I build something real? Something at scale.
            Something that actually works AND helps me learn at the same time."
          </span>
        </p>
        <p>
          And just like that, GestAPP was born. What started as a personal itch to scratch turned into a
          full-blown application that handles multiple rate types, automatic holiday detection, live tracking,
          bulk creation, exports, and way more than I ever imagined.
        </p>
        <p className="text-xs" style={{ color: colors.textSecondary, opacity: 0.7 }}>
          Turns out, frustration is a pretty good fuel for building things.
        </p>
      </div>
    </motion.div>
  );
};

export default StorySection;
