import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.orary',
  appName: 'Orary',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    GoogleSignIn: {
      clientId: '314406109434-9a62ltoo4i8ivcu712s5d3osjbf1ijpu.apps.googleusercontent.com'
    },
    SplashScreen: {
      launchShowDuration: 500,    // cede rápido — NativeSplash React toma el control
      backgroundColor: '#111827', // gray-900 — mismo fondo que NativeSplash para transición invisible
      showSpinner: false,
      launchFadeOutDuration: 300
    },
    StatusBar: {
      style: 'DARK',         // dark icons on light status bar
      overlaysWebView: true, // WebView extends under status bar — safe-area CSS handles the gap
    }
  }
};

export default config;
