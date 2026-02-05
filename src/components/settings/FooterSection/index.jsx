// src/components/settings/FooterSection/index.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Twitter, Crown } from 'lucide-react';

const FooterSection = () => {
  const navigate = useNavigate();

  return (
    <footer className="w-full py-2 px-4 mt-auto border-t border-gray-100 select-none">
      <div className="flex flex-col items-end gap-4">
        <div className="flex flex-wrap justify-end items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-500">
          
          <button
            className="group flex items-center gap-1.5 font-bold text-amber-500 hover:text-amber-600 transition-colors cursor-pointer"
            onClick={() => navigate('/premium')}
          >
            <Crown size={14} className="group-hover:scale-110 transition-transform fill-current" />
            <span>Premium</span>
          </button>

          <span className="text-gray-300 hidden sm:inline">•</span>

          <button 
            onClick={() => navigate('/terms')} 
            className="hover:text-gray-800 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="hidden md:inline">Terms and conditions</span>
            <span className="md:hidden">Terms</span>
          </button>

          <span className="text-gray-300 hidden sm:inline">•</span>

          <button 
            onClick={() => navigate('/privacy')} 
            className="hover:text-gray-800 transition-colors cursor-pointer"
          >
            Privacy and policies
          </button>

          <span className="text-gray-300 hidden sm:inline">|</span>

          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/MarcoCAVS18" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-900 transition-colors"
              aria-label="GitHub"
            >
              <Github size={16} />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;