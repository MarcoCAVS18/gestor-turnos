// src/components/about/TechCarousel/index.jsx

import React from 'react';
import { motion } from 'framer-motion';

const technologies = [
  { name: 'React', icon: '/assets/SVG/about/React.svg' },
  { name: 'JavaScript', icon: '/assets/SVG/about/JavaScript.svg' },
  { name: 'Firebase', icon: '/assets/SVG/about/Firebase.svg' },
  { name: 'Tailwind CSS', icon: '/assets/SVG/about/Tailwind.svg' },
  { name: 'Framer Motion', icon: '/assets/SVG/about/Framer.svg' },
  { name: 'Claude AI', icon: '/assets/SVG/about/claude.svg' },
  { name: 'Stripe', icon: '/assets/SVG/about/Stripe.svg' },
  { name: 'jsPDF', icon: '/assets/SVG/about/jsPDF.svg' },
  { name: 'XLSX', icon: '/assets/SVG/about/XLSX.svg' },
  { name: 'Lucide Icons', icon: '/assets/SVG/about/LucideIcons.svg' },
  { name: 'React Router', icon: '/assets/SVG/about/ReactRouter.svg' },
];

const ITEM_SIZE = 80; // w-20 h-20
const GAP = 48; // gap-12
const TOTAL_WIDTH = technologies.length * (ITEM_SIZE + GAP);

const TechCarousel = () => {
  const duplicated = [...technologies, ...technologies];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8 }}
      className="py-10 overflow-hidden"
    >
      {/* Carousel Container */}
      <div className="relative overflow-hidden py-6">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-r from-gray-100 dark:from-slate-950 to-transparent" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-l from-gray-100 dark:from-slate-950 to-transparent" />

        <motion.div
          className="flex items-center gap-12"
          animate={{ x: [0, -TOTAL_WIDTH] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 20,
              ease: 'linear',
            },
          }}
        >
          {duplicated.map((tech, index) => (
            <div
              key={`${tech.name}-${index}`}
              className="shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center p-4 lg:p-5 transition-all duration-300 grayscale hover:grayscale-0 hover:scale-110"
            >
              <img
                src={tech.icon}
                alt={tech.name}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TechCarousel;
