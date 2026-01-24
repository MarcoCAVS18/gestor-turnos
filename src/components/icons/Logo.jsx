// src/components/icons/Logo.jsx

import React from 'react';

const Logo = () => {
  return (
    <div className="flex justify-center mb-6">
      <div className="bg-white rounded-full p-4 shadow-md">
        <img src="/assets/SVG/logo.svg" alt="Logo" className="h-16 w-16" />
      </div>
    </div>
  );
};

export default Logo;
