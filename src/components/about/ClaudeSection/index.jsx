// src/components/about/ClaudeSection/index.jsx

import React from 'react';
import { motion } from 'framer-motion';
import Card from '../../ui/Card';

const ClaudeSection = ({ colors }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className="h-full"
    >
      <Card
        variant="gradient"
        className="relative overflow-hidden h-full"
        padding="none"
      >
        {/* Subtle glow accent */}
        <div
          className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: '#D97757' }}
        />

        <div className="relative p-6 h-full flex flex-col justify-center">
          <div className="flex flex-col items-center text-center gap-5">
            {/* Claude Logo */}
            <motion.div
              className="shrink-0"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center p-3"
                style={{
                  background: 'linear-gradient(135deg, #D97757 0%, #C4643F 100%)',
                  boxShadow: '0 8px 32px rgba(217, 119, 87, 0.3)',
                }}
              >
                <img
                  src="/assets/SVG/about/claude.svg"
                  alt="Claude AI"
                  className="w-full h-full object-contain brightness-0 invert"
                />
              </div>
            </motion.div>

            {/* Content */}
            <div>
              <h3 className="text-lg font-bold mb-1" style={{ color: colors.text }}>
                Powered by Claude
              </h3>
              <p className="text-xs font-medium mb-3" style={{ color: '#D97757' }}>
                by Anthropic
              </p>
              <p className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>
                Some of the more complex features in GestAPP were built with the help of Claude AI,
                an assistant that made it possible to tackle challenges that would have taken much
                longer to solve alone.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ClaudeSection;
