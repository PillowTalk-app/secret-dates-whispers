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
      } else {
        // Web platform - disable right-click and some keyboard shortcuts
        const disableRightClick = (e: MouseEvent) => {
          e.preventDefault();
          return false;
        };

        const disableKeyShortcuts = (e: KeyboardEvent) => {
          // Disable common screenshot/sharing shortcuts
          if (
            (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'a')) ||
            (e.metaKey && (e.key === 's' || e.key === 'p' || e.key === 'a')) ||
            e.key === 'PrintScreen' ||
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && e.key === 'I')
          ) {
            e.preventDefault();
            return false;
          }
        };

        const disableTextSelection = () => {
          document.body.style.userSelect = 'none';
          document.body.style.webkitUserSelect = 'none';
        };

        document.addEventListener('contextmenu', disableRightClick);
        document.addEventListener('keydown', disableKeyShortcuts);
        disableTextSelection();

        return () => {
          document.removeEventListener('contextmenu', disableRightClick);
          document.removeEventListener('keydown', disableKeyShortcuts);
          document.body.style.userSelect = '';
          document.body.style.webkitUserSelect = '';
        };
      }
    };

    initSecurity();
  }, []);

  const showSecurityWarning = () => {
    if (Capacitor.isNativePlatform()) {
      // Native toast/alert for mobile
      return 'Content is protected for privacy';
    } else {
      // Web notification
      alert('This content is protected and cannot be copied or shared');
    }
  };

  return { showSecurityWarning };
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