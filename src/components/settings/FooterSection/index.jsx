// src/components/settings/FooterSection/index.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Info } from 'lucide-react';

const FooterSection = () => {
  const navigate = useNavigate();

  return (
    <footer className="w-full py-2 px-4 mt-auto border-t border-gray-100 select-none">
      <div className="flex flex-col items-end gap-2">
        <div className="flex flex-wrap justify-end items-center gap-x-3 gap-y-1 text-xs text-gray-500">

          <button
            className="group flex items-center gap-1 font-bold text-amber-500 hover:text-amber-600 transition-colors cursor-pointer"
            onClick={() => navigate('/premium')}
          >
            <Crown size={12} className="group-hover:scale-110 transition-transform fill-current" />
            <span>Premium</span>
          </button>

          <span className="text-gray-300">•</span>

          <button
            onClick={() => navigate('/terms', { state: { from: 'Settings' } })}
            className="hover:text-gray-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            Terms
          </button>

          <span className="text-gray-300">•</span>

          <button
            onClick={() => navigate('/privacy', { state: { from: 'Settings' } })}
            className="hover:text-gray-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            Privacy
          </button>

          <span className="text-gray-300">•</span>

          <button
            onClick={() => navigate('/about')}
            className="flex items-center gap-1 hover:text-gray-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Info size={12} />
            <span>About</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;