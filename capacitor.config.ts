import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.1c95d4818894404eb11c2493029b4fbd',
  appName: 'secret-dates-whispers',
  webDir: 'dist',
  server: {
    url: 'https://1c95d481-8894-404e-b11c-2493029b4fbd.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    ScreenReader: {
      speakFocusedElement: false
    }
  }
};

export default config;