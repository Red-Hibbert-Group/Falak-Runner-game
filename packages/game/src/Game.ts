// Use global Phaser from CDN
declare const Phaser: any;

import { PreloadScene } from './scenes/PreloadScene';
import { TitleScene } from './scenes/TitleScene';
import { Level1Scene } from './scenes/Level1Scene';
import { LevelCompleteScene } from './scenes/LevelCompleteScene';

export function startGame(container: HTMLElement): any {
  const gameConfig: any = {
    type: Phaser.AUTO,
    parent: 'falak-game',
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#87CEEB', // Sky blue
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    pixelArt: false,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 800 },
        debug: false,
      },
    },
    scene: [PreloadScene, TitleScene, Level1Scene, LevelCompleteScene],
  };

  const phaserGame = new Phaser.Game(gameConfig);

  // Add resize listener for responsive canvas
  window.addEventListener('resize', () => {
    const { innerWidth, innerHeight } = window;
    phaserGame.scale.resize(innerWidth, innerHeight);
  });

  return phaserGame;
}
