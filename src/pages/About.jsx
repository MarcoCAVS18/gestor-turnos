// src/pages/About.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { useThemeColors } from '../hooks/useThemeColors';
import Card from '../components/ui/Card';
import PageHeader from '../components/layout/PageHeader';

const About = () => {
  const colors = useThemeColors();

  // Technologies used in the project
  const technologies = [
    { name: 'React', icon: '⚛️' },
    { name: 'JavaScript', icon: '🟨' },
    { name: 'Firebase', icon: '🔥' },
    { name: 'Tailwind CSS', icon: '💨' },
    { name: 'Framer Motion', icon: '🎬' },
    { name: 'Recharts', icon: '📊' },
    { name: 'Claude AI', icon: '🤖' },
    { name: 'Stripe', icon: '💳' },
    { name: 'jsPDF', icon: '📄' },
    { name: 'XLSX', icon: '📑' },
    { name: 'Lucide Icons', icon: '🎨' },
    { name: 'React Router', icon: '🛣️' },
  ];

  // Duplicate array for infinite scroll effect
  const duplicatedTechnologies = [...technologies, ...technologies];

  return (
    <div className="px-4 py-6 space-y-6">
      <PageHeader
        title="About"
        subtitle="Learn more about this application"
        icon={Info}
      />

      <div className="space-y-6">
        {/* Logo Section */}
        <Card variant="surface" className="text-center py-8">
          <div className="flex justify-center mb-4">
            <img
              src="/assets/SVG/logo.svg"
              alt="GestAPPLogo"
              className="w-24 h-24"
            />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
            GestAPP
          </h2>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Professional shift tracking and management
          </p>
        </Card>

        {/* Description */}
        <Card variant="surface" className="p-6">
          <h3 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>
            What is GestAPP?
          </h3>
          <div className="space-y-3 text-sm" style={{ color: colors.textSecondary }}>
            <p>
              GestAPP is a comprehensive application designed to help you track and manage your work shifts efficiently.
              Whether you work traditional hourly jobs or delivery-based gigs, this app provides all the tools you need to
              monitor your earnings, schedule, and performance.
            </p>
            <p>
              With features like live shift tracking, bulk shift creation, detailed statistics, calendar views, and professional
              export capabilities, GestAPP makes it easy to stay organized and understand your work patterns.
            </p>
            <p>
              The app supports multiple rate types (day, afternoon, night, weekend rates), automatic holiday detection,
              break management, and comprehensive reporting with Excel and PDF exports.
            </p>
          </div>
        </Card>

        {/* Technologies Section */}
        <Card variant="surface" className="p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
            Built With
          </h3>
          <p className="text-sm mb-6" style={{ color: colors.textSecondary }}>
            This application is powered by modern technologies and tools
          </p>

          {/* Infinite Carousel */}
          <div className="relative overflow-hidden py-4">
            <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
              style={{
                background: `linear-gradient(to right, ${colors.surface} 0%, transparent 100%)`
              }}
            />
            <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
              style={{
                background: `linear-gradient(to left, ${colors.surface} 0%, transparent 100%)`
              }}
            />

            <motion.div
              className="flex gap-6"
              animate={{
                x: [0, -50 * technologies.length],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
            >
              {duplicatedTechnologies.map((tech, index) => (
                <div
                  key={`${tech.name}-${index}`}
                  className="flex flex-col items-center justify-center min-w-[100px] gap-2"
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl grayscale hover:grayscale-0 transition-all duration-300"
                    style={{ backgroundColor: colors.surface2 }}
                  >
                    {tech.icon}
                  </div>
                  <span className="text-xs font-medium whitespace-nowrap" style={{ color: colors.textSecondary }}>
                    {tech.name}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </Card>

        {/* AI Assistant Section */}
        <Card variant="surface" className="p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🤖</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
                Developed with Claude AI
              </h3>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                This application was developed with the assistance of Claude, an AI assistant by Anthropic.
                Claude helped design and implement features, optimize code, and ensure best practices throughout
                the development process.
              </p>
            </div>
          </div>
        </Card>

        {/* Version & Credits */}
        <Card variant="surface" className="p-6 text-center">
          <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
            Version 2.0.0
          </p>
          <p className="text-xs" style={{ color: colors.textSecondary }}>
            Developed by Marqui
          </p>
          <p className="text-xs mt-2" style={{ color: colors.textSecondary }}>
            © 2026 GestAPP. All rights reserved.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default About;
