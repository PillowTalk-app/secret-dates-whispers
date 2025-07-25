import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export const useContentSecurity = () => {
  useEffect(() => {
    const initSecurity = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          // Prevent screenshots on mobile platforms
          if (Capacitor.getPlatform() === 'android') {
            // Android: Add FLAG_SECURE to prevent screenshots
            await window.AndroidSecurity?.setSecureFlag(true);
          } else if (Capacitor.getPlatform() === 'ios') {
            // iOS: Hide content when app is backgrounded
            await window.IOSSecurity?.enableContentProtection(true);
          }
        } catch (error) {
          console.warn('Security features not available:', error);
        }
      }
    };

    initSecurity();
  }, []);
};

// Extend window interface for native security plugins
declare global {
  interface Window {
    AndroidSecurity?: {
      setSecureFlag: (enabled: boolean) => Promise<void>;
    };
    IOSSecurity?: {
      enableContentProtection: (enabled: boolean) => Promise<void>;
    };
  }
}