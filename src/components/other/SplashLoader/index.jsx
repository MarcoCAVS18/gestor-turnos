// src/components/other/SplashLoader/index.jsx
// Fullscreen splash used during auth loading. Does NOT depend on any context — safe to render before providers mount.

import React from 'react';
import { LoaderAnimation } from '../Loader';

const SplashLoader = () => {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
    }}>
      <LoaderAnimation color="#EC4899" size={40} />
    </div>
  );
};

export default SplashLoader;
