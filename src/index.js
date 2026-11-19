// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import './i18n';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { registerServiceWorker } from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);

// Lets the website open without a connection (production web only)
registerServiceWorker();
