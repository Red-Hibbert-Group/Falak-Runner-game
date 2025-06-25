// Main entry point for @falak-runner/game package
export { startGame } from './Game';

// Re-export any public types if needed
export type { PlayerConfig } from './prefabs/Player';

// Export game store for state management
export { getGameState } from './store/GameStore'; 