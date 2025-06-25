import { create } from 'zustand';

export interface GameState {
  score: number;
  lives: number;
  currentLevel: number;
  isGameRunning: boolean;
  incrementScore: (points: number) => void;
  decrementLives: () => void;
  setLevel: (level: number) => void;
  setGameRunning: (running: boolean) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  lives: 3,
  currentLevel: 1,
  isGameRunning: false,
  incrementScore: (points: number) =>
    set((state) => ({ score: state.score + points })),
  decrementLives: () =>
    set((state) => ({ lives: Math.max(0, state.lives - 1) })),
  setLevel: (level: number) => set({ currentLevel: level }),
  setGameRunning: (running: boolean) => set({ isGameRunning: running }),
  resetGame: () =>
    set({
      score: 0,
      lives: 3,
      currentLevel: 1,
      isGameRunning: false,
    }),
}));
