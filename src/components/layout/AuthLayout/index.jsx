// src/components/layout/AuthLayout/index.jsx
// Shared layout for all auth pages (Login, Register, ForgotPassword, ResetPassword)

import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="fixed inset-0">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black opacity-50 z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute object-cover w-full h-full"
        >
          <source src="/assets/videos/sample_0.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div className="fixed inset-0 z-20 flex flex-col items-center justify-center p-4 py-6 md:py-10 overflow-y-auto">
        {/* Branding container */}
        <div className="flex flex-col items-center mb-4 md:mb-6 flex-shrink-0">
          <div className="bg-white rounded-full p-3 md:p-4 shadow-md mb-2 md:mb-3">
            <img
              src="/assets/SVG/logo.svg"
              alt="Orary"
              className="h-10 w-10 md:h-14 md:w-14"
            />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-0.5">
            {title || 'Orary'}
          </h1>
          {subtitle && (
            <p className="text-sm md:text-base text-white/80">{subtitle}</p>
          )}
        </div>

        {/* Form container */}
        <div className="bg-white rounded-xl p-5 md:p-6 w-full max-w-md shadow-2xl flex-shrink-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
