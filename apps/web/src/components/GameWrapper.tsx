'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import RotateDeviceOverlay from './RotateDeviceOverlay';

const GameCanvas = dynamic(() => import('@/components/GameCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-blue-600">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Loading Falak Runner...
        </h2>
        <p className="text-blue-100">Preparing your magical adventure!</p>
      </div>
    </div>
  ),
});

export default function GameWrapper() {
  return (
    <div className="relative">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-blue-600">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Loading...</h2>
              <p className="text-blue-100">Initializing game...</p>
            </div>
          </div>
        }
      >
        <GameCanvas />
      </Suspense>

      {/* Orientation guard overlay */}
      <RotateDeviceOverlay />
    </div>
  );
}
