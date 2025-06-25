'use client';

import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/stores/gameStore';

export default function GameCanvas() {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<any>(null);
  const initializingRef = useRef<boolean>(false);
  const [gameLoaded, setGameLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const { setGameRunning, isGameRunning } = useGameStore();

  const addDebugInfo = (message: string) => {
    console.log('DEBUG:', message);
    setDebugInfo((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      addDebugInfo('Not in browser environment, skipping');
      return;
    }

    // Prevent double initialization
    if (phaserGameRef.current || initializingRef.current) {
      addDebugInfo('Game already initialized or initializing, skipping');
      return;
    }

    addDebugInfo('Starting game loading process');
    initializingRef.current = true;

    const loadGame = async () => {
      if (gameRef.current && !phaserGameRef.current) {
        try {
          setError(null);
          addDebugInfo('Game container ready, starting module import');

          // Wait a bit for DOM to be ready
          await new Promise((resolve) => setTimeout(resolve, 200));

          addDebugInfo('Attempting dynamic import of @falak-runner/game');

          // Dynamic import to avoid SSR issues with Phaser
          const gameModule = await import('@falak-runner/game');
          addDebugInfo(
            `Game module imported successfully. Keys: ${Object.keys(gameModule).join(', ')}`
          );

          if (!gameModule.startGame) {
            throw new Error('startGame function not found in game module');
          }

          addDebugInfo(
            `startGame function found, type: ${typeof gameModule.startGame}`
          );

          // Start the game
          addDebugInfo('Calling startGame function');
          phaserGameRef.current = gameModule.startGame(gameRef.current);
          addDebugInfo('startGame function completed successfully');

          setGameRunning(true);
          setGameLoaded(true);
          initializingRef.current = false;

          addDebugInfo('Falak Runner game initialized successfully!');
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          const errorStack =
            error instanceof Error ? error.stack : 'No stack available';

          addDebugInfo(`ERROR: ${errorMessage}`);
          console.error('Failed to load game:', error);
          console.error('Error stack:', errorStack);
          setError(errorMessage);
          setGameLoaded(true); // Hide loading even on error
          initializingRef.current = false;
        }
      } else {
        addDebugInfo('Game container not ready or game already initialized');
      }
    };

    loadGame();

    // Cleanup function
    return () => {
      if (phaserGameRef.current) {
        try {
          addDebugInfo('Cleaning up Phaser game instance');
          phaserGameRef.current.destroy(true);
        } catch (err) {
          console.error('Error destroying game:', err);
        }
        phaserGameRef.current = null;
        setGameRunning(false);
      }
    };
  }, [setGameRunning]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-red-400 to-red-600">
        <div className="text-white text-center p-8 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">🚫 Error Loading Game</h1>
          <p className="text-lg mb-4">Failed to load Falak Runner</p>
          <p className="text-sm bg-red-700 p-4 rounded mb-4">{error}</p>

          <div className="text-left bg-red-800 p-4 rounded max-h-64 overflow-y-auto">
            <h3 className="font-bold mb-2">Debug Information:</h3>
            {debugInfo.map((info, index) => (
              <div key={index} className="text-xs mb-1">
                {info}
              </div>
            ))}
          </div>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-white text-red-600 rounded hover:bg-gray-100"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  const showLoading = !gameLoaded && !error;

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-400 to-blue-600 overflow-hidden">
      {showLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-50">
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-white text-center mb-2">
              🧞‍♂️ FALAK RUNNER 🌊
            </h1>
            <p className="text-lg text-blue-100 text-center">
              Adventures of Baby Aladdin & Moana
            </p>
          </div>

          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
          <p>Loading game engine...</p>

          <div className="mt-4 text-left bg-blue-800 p-4 rounded max-h-32 overflow-y-auto text-xs max-w-md">
            <h4 className="font-bold mb-2">Debug Log:</h4>
            {debugInfo.map((info, index) => (
              <div key={index} className="mb-1">
                {info}
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        ref={gameRef}
        id="falak-game"
        className="w-full h-full relative z-10"
        style={{
          display: gameLoaded ? 'block' : 'none',
          backgroundColor: '#87CEEB', // Sky blue background
          minHeight: '100vh',
          minWidth: '100vw',
        }}
      />
    </div>
  );
}
