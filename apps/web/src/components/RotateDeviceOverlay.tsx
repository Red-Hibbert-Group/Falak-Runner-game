'use client';

import { useState, useEffect } from 'react';

export default function RotateDeviceOverlay() {
  const [isPortrait, setIsPortrait] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isPortraitMode = window.matchMedia(
        '(orientation: portrait)'
      ).matches;
      const isMobileDevice = window.matchMedia('(max-width: 1023px)').matches;

      setIsPortrait(isPortraitMode);
      setIsMobile(isMobileDevice);
    };

    // Check on mount
    checkOrientation();

    // Listen for orientation changes
    const mediaQuery = window.matchMedia('(orientation: portrait)');
    const mobileQuery = window.matchMedia('(max-width: 1023px)');

    mediaQuery.addEventListener('change', checkOrientation);
    mobileQuery.addEventListener('change', checkOrientation);

    return () => {
      mediaQuery.removeEventListener('change', checkOrientation);
      mobileQuery.removeEventListener('change', checkOrientation);
    };
  }, []);

  // Only show overlay on mobile devices in portrait mode
  if (!isMobile || !isPortrait) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="text-center text-white p-8">
        {/* Rotating phone icon */}
        <div className="mb-6 flex justify-center">
          <div className="phone-rotate-animation">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
          </div>
        </div>

        {/* Instructions */}
        <h2 className="text-2xl font-bold mb-4">Please rotate your device</h2>
        <p className="text-lg opacity-80">
          This game is best played in landscape mode
        </p>
      </div>

      <style jsx>{`
        .phone-rotate-animation {
          animation: rotatePhone 2s ease-in-out infinite;
        }

        @keyframes rotatePhone {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(90deg);
          }
        }
      `}</style>
    </div>
  );
}
