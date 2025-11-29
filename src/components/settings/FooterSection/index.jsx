// src/components/settings/FooterSection/index.jsx

import React from 'react';
import { Github } from 'lucide-react';
import Flex from '../../ui/Flex';

const FooterSection = () => {
  return (
    <div className="text-center py-8 px-4 space-y-2 select-none">
      <p className="text-gray-300 text-sm">
        <span className="font-bold">Hecho por Marco :)</span>
      </p>

      <Flex variant="center" className="space-x-2 text-gray-300 text-sm">
        <span>Como lo estuve desarrollando? Mira:</span>
        <a
          href="https://github.com/MarcoCAVS18/gestor-turnos"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-gray-400 transition-colors"
        >
          <Github size={16} />
        </a>
      </Flex>
    </div>
  );
};

export default FooterSection;