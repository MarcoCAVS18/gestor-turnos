// src/components/settings/FooterSection/index.jsx

import React from 'react';
import ***REMOVED*** useNavigate ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** Github, Twitter, Crown ***REMOVED*** from 'lucide-react';

const FooterSection = () => ***REMOVED***
  const navigate = useNavigate();

  return (
    <footer className="w-full py-2 px-4 mt-auto border-t border-gray-100 select-none">
      <div className="flex flex-col items-end gap-4">
        <div className="flex flex-wrap justify-end items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-500">
          
          <button 
            className="group flex items-center gap-1.5 font-bold text-amber-500 hover:text-amber-600 transition-colors cursor-pointer"
            onClick=***REMOVED***() => console.log('Abrir modal premium')***REMOVED***
          >
            <Crown size=***REMOVED***14***REMOVED*** className="group-hover:scale-110 transition-transform fill-current" />
            <span>Premium</span>
          </button>

          <span className="text-gray-300 hidden sm:inline">•</span>

          <button 
            onClick=***REMOVED***() => navigate('/terms')***REMOVED*** 
            className="hover:text-gray-800 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="hidden md:inline">Términos y condiciones</span>
            <span className="md:hidden">Términos</span>
          </button>

          <span className="text-gray-300 hidden sm:inline">•</span>

          <button 
            onClick=***REMOVED***() => navigate('/privacy')***REMOVED*** 
            className="hover:text-gray-800 transition-colors cursor-pointer"
          >
            Privacidad y políticas
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
              <Github size=***REMOVED***16***REMOVED*** />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors"
              aria-label="Twitter"
            >
              <Twitter size=***REMOVED***16***REMOVED*** />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
***REMOVED***;

export default FooterSection;