export interface GameState {
  score: number;
  lives: number;
  currentLevel: number;
  incrementScore: (points: number) => void;
  decrementLives: () => void;
  setLevel: (level: number) => void;
  resetGame: () => void;
}

// We'll use a simple state management without zustand for now
// TODO(cursor): Integrate zustand properly when setting up the web app
let gameState: GameState = {
  score: 0,
  lives: 3,
  currentLevel: 1,
  incrementScore: (points: number) => {
    gameState.score += points;
  },
  decrementLives: () => {
    gameState.lives = Math.max(0, gameState.lives - 1);
  },
  setLevel: (level: number) => {
    gameState.currentLevel = level;
  },
  resetGame: () => {
    gameState.score = 0;
    gameState.lives = 3;
    gameState.currentLevel = 1;
  },
};

export const getGameState = () => gameState; 