// src/pages/About.jsx

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useThemeColors } from '../hooks/useThemeColors';
import BackLink from '../components/ui/BackLink';
import HeroSection from '../components/about/HeroSection';
import StorySection from '../components/about/StorySection';
import CreatorSection from '../components/about/CreatorSection';
import TechCarousel from '../components/about/TechCarousel';
import ClaudeSection from '../components/about/ClaudeSection';
import FeedbackSection from '../components/about/FeedbackSection';
import AboutFooter from '../components/about/AboutFooter';

const About = () => {
  const colors = useThemeColors();
  const location = useLocation();

  // Scroll to hash anchor (e.g. /about#feedback)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      // Retry scroll with delays to handle render timing
      const attempts = [100, 500, 1000];
      attempts.forEach(delay => {
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, delay);
      });
    }
  }, [location.hash]);

  return (
    <div className="px-4 py-6 space-y-6 overflow-x-hidden">
      <BackLink to="/settings">Settings</BackLink>

      {/* Hero - full width always */}
      <HeroSection colors={colors} />

      {/* DESKTOP: Asymmetric grid layout */}
      <div className="hidden lg:block space-y-8">
        {/* Row 1: Story (wide) + Creator (narrow) */}
        <div className="grid grid-cols-5 gap-6 items-start">
          <div className="col-span-3">
            <StorySection colors={colors} />
          </div>
          <div className="col-span-2">
            <CreatorSection colors={colors} />
          </div>
        </div>

        {/* Row 2: Tech Carousel - FULL WIDTH break */}
        <TechCarousel />

        {/* Row 3: Claude (1/3) + Feedback (2/3) */}
        <div className="grid grid-cols-3 gap-6 items-stretch">
          <div className="col-span-1">
            <ClaudeSection colors={colors} />
          </div>
          <div className="col-span-2">
            <FeedbackSection colors={colors} />
          </div>
        </div>
      </div>

      {/* MOBILE: Vertical stack */}
      <div className="block lg:hidden space-y-2">
        <StorySection colors={colors} />
        <CreatorSection colors={colors} />
        <TechCarousel />
        <ClaudeSection colors={colors} />
        <FeedbackSection colors={colors} />
      </div>

      <AboutFooter colors={colors} />
    </div>
  );
};

export default About;
