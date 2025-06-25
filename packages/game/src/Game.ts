import * as Phaser from 'phaser';
import { PreloadScene } from './scenes/PreloadScene';
import { TitleScene } from './scenes/TitleScene';
import { Level1Scene } from './scenes/Level1Scene';
import { LevelCompleteScene } from './scenes/LevelCompleteScene';

export function startGame(container: HTMLElement): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1200,
    height: 600,
    parent: container,
    backgroundColor: '#87CEEB', // Sky blue
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 800 },
        debug: false,
      },
    },
    scene: [PreloadScene, TitleScene, Level1Scene, LevelCompleteScene],
  };

  return new Phaser.Game(config);
} 