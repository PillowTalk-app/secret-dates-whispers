import { useEffect } from 'react';
import { useContentSecurity } from '@/hooks/useContentSecurity';

interface SecurityWrapperProps {
  children: React.ReactNode;
}

export const SecurityWrapper = ({ children }: SecurityWrapperProps) => {
  const { showSecurityWarning } = useContentSecurity();

  useEffect(() => {
    // Add watermark overlay
    const addWatermark = () => {
      const watermark = document.createElement('div');
      watermark.id = 'security-watermark';
      watermark.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        background-image: repeating-linear-gradient(
          45deg,
          transparent,
          transparent 100px,
          rgba(255, 255, 255, 0.03) 100px,
          rgba(255, 255, 255, 0.03) 200px
        );
        mix-blend-mode: overlay;
      `;
      document.body.appendChild(watermark);
    };

    addWatermark();

    // Detect dev tools
    const detectDevTools = () => {
      const threshold = 160;
      setInterval(() => {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
          showSecurityWarning();
          // Optional: blur content when dev tools detected
          document.body.style.filter = 'blur(5px)';
          setTimeout(() => {
            document.body.style.filter = '';
          }, 2000);
        }
      }, 500);
    };

    detectDevTools();

    return () => {
      const watermark = document.getElementById('security-watermark');
      if (watermark) {
        watermark.remove();
      }
    };
  }, [showSecurityWarning]);

  return <>{children}</>;
};