// Use global Phaser from CDN
declare const Phaser: any;

import { PreloadScene } from './scenes/PreloadScene';
import { TitleScene } from './scenes/TitleScene';
import { CharacterSelectScene } from './scenes/CharacterSelectScene';
import { Level1Scene } from './scenes/Level1Scene';
import { LevelCompleteScene } from './scenes/LevelCompleteScene';

export function startGame(container: HTMLElement): any {
  console.log('[Game] Starting Falak Runner game...');
  console.log('[Game] Container:', container);
  console.log('[Game] Container dimensions:', {
    width: container.offsetWidth,
    height: container.offsetHeight,
    visible: container.offsetParent !== null,
  });

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
    scene: [
      PreloadScene,
      TitleScene,
      CharacterSelectScene,
      Level1Scene,
      LevelCompleteScene,
    ],
  };

  console.log('[Game] Creating Phaser game with config:', gameConfig);

  const phaserGame = new Phaser.Game(gameConfig);

  console.log('[Game] Phaser game created:', phaserGame);

  // Add debugging for canvas creation
  phaserGame.events.once('ready', () => {
    console.log('[Game] Phaser game ready event fired');
    const canvas = phaserGame.canvas;
    console.log('[Game] Canvas created:', canvas);
    console.log('[Game] Canvas parent:', canvas?.parentElement);
    console.log('[Game] Canvas style:', canvas?.style?.cssText);
    console.log('[Game] Canvas dimensions:', {
      width: canvas?.width,
      height: canvas?.height,
      clientWidth: canvas?.clientWidth,
      clientHeight: canvas?.clientHeight,
      offsetWidth: canvas?.offsetWidth,
      offsetHeight: canvas?.offsetHeight,
    });
  });

  // Add resize listener for responsive canvas
  window.addEventListener('resize', () => {
    const { innerWidth, innerHeight } = window;
    console.log('[Game] Window resize:', { innerWidth, innerHeight });
    phaserGame.scale.resize(innerWidth, innerHeight);
  });

  return phaserGame;
}
