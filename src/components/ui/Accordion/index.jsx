// src/components/ui/Accordion/index.jsx
// Reusable collapsible card, shared across pages (FAQ page, blog faq block, etc.).
//
// The body is ALWAYS rendered in the DOM (collapsed via the CSS grid-rows
// 0fr/1fr trick, not unmounted) so Puppeteer pre-render captures the full text
// and Google indexes the content even while it is visually collapsed.
//
// Props:
//   title       - node (string or JSX) shown in the header
//   children    - body content revealed when expanded
//   accentColor - top accent bar + chevron colour when open (default Orary pink)
//   defaultOpen - start expanded (default false)
//   className   - extra classes for the outer card

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Accordion = ({ title, children, accentColor = '#EC4899', defaultOpen = false, className = '' }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden cursor-pointer transition-shadow hover:shadow-md ${className}`}
      onClick={() => setOpen((o) => !o)}
    >
      <div
        className="h-0.5 w-full transition-colors duration-200"
        style={{ backgroundColor: open ? accentColor : '#e2e8f0' }}
      />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-slate-800 leading-snug flex-1">{title}</p>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 mt-0.5"
          >
            <ChevronDown size={15} style={{ color: open ? accentColor : '#94a3b8' }} />
          </motion.div>
        </div>

        {/* Body — always in DOM, height animated via the CSS grid trick */}
        <div
          className="grid transition-all duration-200 ease-in-out"
          style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            <div className="text-sm text-slate-500 leading-relaxed mt-3 pt-3 border-t border-slate-100">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
